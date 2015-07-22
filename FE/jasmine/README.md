JavaScript 单元测试
===

- jasmine
- karma
- istanbul

## Install

```sh
$ npm install -g jasmine
$ npm install -g karma
$ npm install -g karma-coverage
```

## Config

```sh
$ karma init
```

- karma.conf.js

## Run

- jasmine
- karma `karma start karma.conf.js`
- istanbul `istanbul check-coverage --statement -5 --branch -3 --function 100`

## Reference

- [https://github.com/jasmine/jasmine](https://github.com/jasmine/jasmine)
- [http://jasmine.github.io/2.3/introduction.html](http://jasmine.github.io/2.3/introduction.html)
- [http://karma-runner.github.io/0.13/index.html](http://karma-runner.github.io/0.13/index.html)
- [jasmine行为驱动,测试先行](http://blog.fens.me/nodejs-jasmine-bdd/)
- [Karma和Jasmine自动化单元测试](http://blog.fens.me/nodejs-karma-jasmine/)
- [代码覆盖率工具 Istanbul 入门教程](http://www.ruanyifeng.com/blog/2015/06/istanbul.html)
