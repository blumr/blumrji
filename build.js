/*
 * Copyright (c) 2014. LetsBlumIt Corp.
 */
'use strict';

var fs = require('fs'),
  util = require('util'),
  path = require('path'),
  Svgo = require('svgo'),
  lwip = require('lwip'),
  async = require('async'),
  chalk = require('chalk'),
  dir = require('node-dir'),
  svg2png = require('svg2png'),
  Imagemin = require('imagemin'),
  task = process.argv[3],
  srcDir = process.argv[2],
  srcPath = path.join(__dirname, srcDir),
  outPath = path.join(__dirname, 'png'),
  outPath16 = path.join(__dirname, '16x16'),
  outPath36 = path.join(__dirname, '36x36'),
  outPath72 = path.join(__dirname, '72x72');

dir.files(srcPath, function (err, files) {
  if (err) {
    throw err;
  }

  if (task === 'clean') {
    var allZero, finishing = 1, svgo = new Svgo();
    async.doUntil(function (callback1) {
      allZero = true;

      async.eachSeries(files, function (file, callback2) {
        if (path.extname(file).toLowerCase() === '.svg') {

          fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
              callback2(err);
            } else {
              try {
                var optimizeStat, svgData = data;
                async.doUntil(function (callback3) {

                  svgo.optimize(svgData, function (results) {
                    if (results.error) {
                      callback3(results.error);
                    } else {
                      optimizeStat = (svgData.length - results.data.length) / svgData.length * 100;
                      svgData = results.data;
                      callback3();
                    }
                  });

                }, function () {
                  if (optimizeStat) {
                    allZero = false;
                    util.log(chalk.red(path.basename(file) + ' ✗ ' + optimizeStat));
                  } else {
                    util.log(chalk.green(path.basename(file) + ' ✓ '));
                  }
                  return optimizeStat === 0;

                }, function (err) {
                  if (err) {
                    callback2(err);
                  } else {
                    fs.writeFile(file, svgData, function (err) {
                      if (err) {
                        callback2(err);
                      } else {
                        callback2();
                      }
                    });
                  }
                });

              } catch (err) {
                callback2(err);
              }
            }
          });
        } else {
          callback2();
        }
      }, function (err) {
        callback1(err);
      });

    }, function () {
      util.log(chalk.yellow('(⌐■_■) iteration clean: ' + allZero + ' finishing:' + finishing));
      if (allZero) {
        finishing--;
      }
      return finishing === 0;

    }, function (err) {
      if (err) {
        util.log(chalk.red(' (╯︵╰,)  ' + err));
      } else {
        util.log(chalk.green('all svgs optimized! ٩(^‿^)۶'));
      }
    });
  }

  if (task === 'convert') {
    async.eachSeries(files, function (file, callback1) {
      if (path.extname(file).toLowerCase() === '.svg') {
        var filename = path.basename(file),
          pngFile = filename.replace('.svg', '.png');
        try {
          async.series([

            function (callback2) {
              svg2png(file, path.join(outPath, pngFile), 2, function (err) {
                if (err) {
                  callback2(err);
                } else {
                  util.log(chalk.green(filename + ' converted ✓'));
                  callback2();
                }
              });
            },

            function (callback2) {
              lwip.open(path.join(outPath, pngFile), function (err, image) {
                processImage(image, 72, path.join(outPath72, pngFile), function (err) {
                  if (err) {
                    callback2(err);
                  } else {
                    util.log(chalk.green(filename + ' 72x72 resized ✓'));
                    processImage(image, 36, path.join(outPath36, pngFile), function (err) {
                      if (err) {
                        callback2(err);
                      } else {
                        util.log(chalk.green(filename + ' 36x36 resized ✓'));
                        processImage(image, 16, path.join(outPath16, pngFile), function (err) {
                          if (err) {
                            callback2(err);
                          } else {
                            util.log(chalk.green(filename + ' 16x16 resized ✓'));
                            callback2();
                          }
                        });
                      }
                    });
                  }
                });
              });
            }

          ], function (err) {
            callback1(err);
          });
        } catch (err) {
          callback1(err);
        }
      } else {
        callback1();
      }
    }, function (err) {
      if (err) {
        util.log(chalk.red(' (╯︵╰,)  ' + err));
      } else {
        util.log(chalk.green('all svgs converted! ٩(^‿^)۶'));
      }
    });
  }
});

function processImage(image, resize, outpath, callback) {
  image.clone(function (err, clone) {
    if (err) {
      callback(err);
    } else {
      clone.resize(resize, function (err, clone) {
        if (err) {
          callback(err);
        } else {
          clone.toBuffer('png', function (err, buffer) {
            if (err) {
              callback(err);
            } else {
              var imagemin = new Imagemin().src(buffer);
              imagemin.use(Imagemin.optipng({optimizationLevel: 3}));
              imagemin.run(function (err, files) {
                if (err) {
                  callback(err);
                } else {
                  fs.writeFile(outpath, files[0].contents, function (err) {
                    if (err) {
                      callback(err);
                    } else {
                      callback();
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

