# GameJS (gamejs-lib)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
<a href="https://gamecredits.org/" target="_blank">
<img src="https://s2.coinmarketcap.com/static/img/coins/200x200/576.png" width="60">
</a>

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
``` bash
npm install gamejs-lib
```

Typically we support the [Node Maintenance LTS version](https://github.com/nodejs/Release).
If in doubt, see the [.travis.yml](.travis.yml) for what versions are used by our continuous integration tests.

**WARNING**: We presently don't provide any tooling to verify that the release on `npm` matches GitHub.  As such, you should verify anything downloaded by `npm` against your own verified copy.


## Usage

### Browser
The recommended method of using `gamejs-lib` in your browser is through [Browserify](https://github.com/substack/node-browserify).
If you're familiar with how to use browserify, ignore this and carry on, otherwise, it is recommended to read the tutorial at http://browserify.org/.

**NOTE**: We use Node Maintenance LTS features, if you need strict ES5, use [`--transform babelify`](https://github.com/babel/babelify) in conjunction with your `browserify` step (using an [`es2015`](http://babeljs.io/docs/plugins/preset-es2015/) preset).

**NOTE**: If you expect this library to run on an iOS 10 device, ensure that you are using [buffer@5.0.5](https://github.com/feross/buffer/pull/155) or greater.

## Examples
The below examples are implemented so you can inspect them and write your own code that is fulfilling your needs. These methods should be easy to understand.
Otherwise, pull requests are appreciated.

- [Generate random address](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L7)
- [Generate an address from a SHA256 hash](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L19)
- [Import an address via WIF](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L33)
- [Generate a 2-of-2 P2SH address](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L45)
- [Generate a 2-of-3 P2SH address](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L72)
- [Create a 1-to-1 Transaction](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L100)
- [Create a 2-to-2 Tranasction](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L125)
- [Create a Transaction using MultiSignature address](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L159)
- [Verify Transaction](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L198)
- [Generate 12 word BIP39 Mnemonic](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L234)
- [Generate stronger BIP39 Mnemonic](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L243)
- [Generate BIP39 Mnemonic with a different wordlist](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L251)
- [Validate BIP39 Mnemonic](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L259)
- [Import a BIP32 xpriv and export to WIF](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L269)
- [Export a BIP32 xpriv, then import it](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L280)
- [Export a BIP32 xpub](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L295)
- [Create BIP32, gamecredits, account 0, external](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L309)
- [Use BIP39 to generate BIP32 addresses](https://github.com/gamecredits-project/gamejs-lib/blob/master/examples/index.js#L330)


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
