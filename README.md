# GameJS (gamejs-lib)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A javascript GameCredits library for node.js and browsers. This library is a fork of [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)

Released under the terms of the [MIT LICENSE](LICENSE).

## Should I use this in production?
If you are thinking of using the *master* branch of this library in production, **stop**.
Master is not stable; it is our development branch. Tagged releases coming soon!

## Can I trust this code?
> Don't trust. Verify.

We recommend every user of this library and the [GameCredits](https://github.com/gamecredits-project) ecosystem audit and verify any underlying code for its validity and suitability.

Mistakes and bugs happen, but with your help in resolving and reporting [issues](https://github.com/gamecredits-project/gamejs-lib/issues), together we can produce open source software that is:

- Easy to audit and verify,
- Tested, with test coverage >95%,
- Advanced and feature rich,
- Standardized, using [standard](http://github.com/standard/standard) and Node `Buffer`'s throughout, and
- Friendly, with a strong and helpful community, ready to answer questions.

## Documentation
Presently,  we do not have any formal documentation other than our [examples](#examples), please [ask for help](https://github.com/gamecredits-project/gamejs-lib/issues/new) if our examples aren't enough to guide you.


## Installation
**Coming soon!**

## Usage

### Browser
The recommended method of using `gamejs-lib` in your browser is through [Browserify](https://github.com/substack/node-browserify).
If you're familiar with how to use browserify, ignore this and carry on, otherwise, it is recommended to read the tutorial at http://browserify.org/.

**NOTE**: We use Node Maintenance LTS features, if you need strict ES5, use [`--transform babelify`](https://github.com/babel/babelify) in conjunction with your `browserify` step (using an [`es2015`](http://babeljs.io/docs/plugins/preset-es2015/) preset).

**NOTE**: If you expect this library to run on an iOS 10 device, ensure that you are using [buffer@5.0.5](https://github.com/feross/buffer/pull/155) or greater.

## Examples
The below examples are implemented as so you can inspect them and write your own code that is fulfilling your needs. These methods should be easy to understand.
Otherwise, pull requests are appreciated.

- [Generate random address](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L5)
- [Generate an address from a SHA256 hash](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L17)
- [Import an address via WIF](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L31)
- [Generate a 2-of-2 P2SH address](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L43)
- [Generate a 2-of-3 P2SH address](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L70)
- [Create a 1-to-1 Transaction](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L98)
- [Create a 2-to-2 Tranasction](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L123)
- [Create a Transaction using MultiSignature address](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L157)
- [Verify Transaction](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L196)

BIP32 and BIP44 standards coming in the next release!
## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).


### Running the test suite

``` bash
npm test
npm run-script coverage
```

## Complementing Libraries
**Coming soon!**


## LICENSE [MIT](LICENSE)
