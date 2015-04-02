# Blumrji
Blumr emojis \u2764

### Maintainers
* Gene Diaz Jr. <gene@letsblumit.com>
* Jobert Cruz <jobert@letsblumit.com>

### Technologies
* [svgo](https://github.com/svg/svgo/) - svg optimizer
* [svg2png](https://github.com/domenic/svg2png) - converter
* [twemoji](https://github.com/twitter/twemoji) - parser

### Configs
* [.jscsrc](http://jscs.info/rules.html) - javascript code style
* [.jshintrc](http://jshint.com/docs/options/) - javascript code quality
* [.gitignore](http://git-scm.com/docs/gitignore) - git ignored dirs and files
* [package.json](https://docs.npmjs.com/files/package.json) - project details through nodejs

### Contributing
Make sure that [nodejs is installed](http://nodejs.org/download/) first.
For osx, its best to [use homebrew](http://shapeshed.com/setting-up-nodejs-and-npm-on-mac-osx/).

#### Install dependencies
```
npm install
```

#### Clean SVGs
```
npm run clean            -- all files
npm run clean [svg name] -- single file
```

#### Convert SVGs
```
npm run convert            -- all files
npm run convert [svg name] -- single file
```

### Roadmap
* support for unicode 8.0

#### Project directory structure
```
├─ preview
├─ 72x72  - minified
├─ png    - converted
└─ svg    - source
```

### License
* All codes are under [MIT License](https://github.com/letsblumit/blumrji/blob/master/LICENSE-CODE)
* All graphics are under [Creative Commons Attribution 4.0 International CC-BY 4.0](https://github.com/letsblumit/blumrji/blob/master/LICENSE-GRAPHICS)

