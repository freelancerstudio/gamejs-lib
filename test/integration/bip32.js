const { describe, it } = require('mocha')
const assert = require('assert')
const bip32 = require('bip32')
const bip39 = require('bip39')
const game = require('../../')

function getAddress (node, network) {
  return game.payments.p2pkh({ pubkey: node.publicKey, network }).address
}

describe('gamejs-lib (BIP32)', function () {
  it('can import a BIP32 testnet xpriv and export to WIF', function () {
    const xpriv = 'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK'
    const node = bip32.fromBase58(xpriv, game.networks.testnet)

    assert.equal(node.toWIF(), 'cQfoY67cetFNunmBUX5wJiw3VNoYx3gG9U9CAofKE6BfiV1fSRw7')
  })

  it('can export a BIP32 xpriv, then import it', function () {
    const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
    const seed = bip39.mnemonicToSeed(mnemonic)
    const node = bip32.fromSeed(seed)
    const string = node.toBase58()
    const restored = bip32.fromBase58(string)

    assert.equal(getAddress(node), getAddress(restored)) // same public key
    assert.equal(node.toWIF(), restored.toWIF()) // same private key
  })

  it('can export a BIP32 xpub', function () {
    const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
    const seed = bip39.mnemonicToSeed(mnemonic)
    const node = bip32.fromSeed(seed)
    const string = node.neutered().toBase58()

    assert.equal(string, 'xpub661MyMwAqRbcGhVeaVfEBA25e3cP9DsJQZoE8iep5fZSxy3TnPBNBgWnMZx56oreNc48ZoTkQfatNJ9VWnQ7ZcLZcVStpaXLTeG8bGrzX3n')
  })

  it('can create a BIP32, gamecredits, account 0, external address', function () {
    const path = "m/0'/0/0"
    const root = bip32.fromSeed(Buffer.from('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'hex'))

    const child1 = root.derivePath(path)

    // option 2, manually
    const child1b = root.deriveHardened(0)
      .derive(0)
      .derive(0)

    assert.equal(getAddress(child1), 'Gb8tb98LWmH98iq3bfYzASi519DPFXajNE')
    assert.equal(getAddress(child1b), 'Gb8tb98LWmH98iq3bfYzASi519DPFXajNE')
  })

  it('can create a BIP44, gamecredits, account 0, external address', function () {
    const root = bip32.fromSeed(Buffer.from('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'hex'))

    const child1 = root.derivePath("m/44'/0'/0'/0/0")

    // option 2, manually
    const child1b = root.deriveHardened(44)
      .deriveHardened(0)
      .deriveHardened(0)
      .derive(0)
      .derive(0)

    assert.equal(getAddress(child1), 'GKJuLyLR71f7j6QHsHtaW7UWsD3t6niwMf')
    assert.equal(getAddress(child1b), 'GKJuLyLR71f7j6QHsHtaW7UWsD3t6niwMf')
  })

  it('can create a BIP49, gamecredits, account 0, external address', function () {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    const seed = bip39.mnemonicToSeed(mnemonic)
    const root = bip32.fromSeed(seed)

    const path = "m/49'/1'/0'/0/0"
    const child = root.derivePath(path)

    const { address } = game.payments.p2pkh({
      pubkey: child.publicKey
    })
    assert.equal(address, 'GP19J51DcL8kiUZqiobHXwkwEmTEFjNDip')
  })

  it('can use BIP39 to generate BIP32 addresses', function () {
    // var mnemonic = bip39.generateMnemonic()
    const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
    assert(bip39.validateMnemonic(mnemonic))

    const seed = bip39.mnemonicToSeed(mnemonic)
    const root = bip32.fromSeed(seed)

    // receive addresses
    assert.strictEqual(getAddress(root.derivePath("m/0'/0/0")), 'GTLKhibrDHgR1gPR6FNDhP9VXDDQr8LrWa')
    assert.strictEqual(getAddress(root.derivePath("m/0'/0/1")), 'GTU2D16nCrChsYsQwxrG2XG4b2LmADgDyQ')

    // change addresses
    assert.strictEqual(getAddress(root.derivePath("m/0'/1/0")), 'GKu4jcw2MYFvenQWrqsBNybrFHtFS21rnE')
    assert.strictEqual(getAddress(root.derivePath("m/0'/1/1")), 'GX1r9Byaoj7uX89LZrdhbPQDdarSGbWndG')
  })
})
