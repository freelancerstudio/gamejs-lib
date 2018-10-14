const { describe, it } = require('mocha')
const assert = require('assert')
const game = require('../../')
const dhttp = require('dhttp/200')

const LITECOIN = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0
}

// deterministic RNG for testing only
function rng () { return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }

describe('gamejs-lib (addresses)', function () {
  it('can generate a random address', function () {
    const keyPair = game.ECPair.makeRandom({ rng: rng })
    const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey })

    assert.strictEqual(address, 'GXvR7UcrjVPmJuT3bUW6pkhYAB4EMxebGS')
  })

  it('can generate an address from a SHA256 hash', function () {
    const hash = game.crypto.sha256(Buffer.from('correct horse battery staple'))

    const keyPair = game.ECPair.fromPrivateKey(hash)
    const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey })

    // Generating addresses from SHA256 hashes is not secure if the input to the hash function is predictable
    // Do not use with predictable inputs
    assert.strictEqual(address, 'GUxv3azjjrP95Wax5yaVBqnCTb6wqBbJfx')
  })

  it('can import an address via WIF', function () {
    const keyPair = game.ECPair.fromWIF('Rfr6XJJb7jj2n6hcJH7eJyJEy7nnXm6Z161d2wFdXjTP7so6PMDo')
    const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey })

    assert.strictEqual(address, 'GUxv3azjjrP95Wax5yaVBqnCTb6wqBbJfx')
  })

  it('can generate a P2SH, pay-to-multisig (2-of-3) address', function () {
    const pubkeys = [
      '03e41eb9436ab4be78fd30bd93d9f461696e7e10737acdda6162db3d1d0befe0b6',
      '024f9c3a8224d870ce375f3484664671b3a34e8739d21c669946f0bb80f92bdc1a',
      '020a32c5d287b892dcf1d14ddd95bc50996757d1dd0ad2caae1950a64a642cecea'
    ].map((hex) => Buffer.from(hex, 'hex'))

    const { address } = game.payments.p2sh({
      redeem: game.payments.p2ms({ m: 2, pubkeys })
    })

    assert.strictEqual(address, '38m61DPrgKTeFhStfnHoteqPxgCoLdTXhP')
  })

  // TODO@Micic: Check if we actually have SegWit
  // it('can generate a SegWit address', function () {
  //   const keyPair = game.ECPair.fromWIF('Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct')
  //   const { address } = game.payments.p2wpkh({ pubkey: keyPair.publicKey })

  //   assert.strictEqual(address, 'bc1qt97wqg464zrhnx23upykca5annqvwkwujjglky')
  // })

  it('can generate a SegWit address (via P2SH)', function () {
    const keyPair = game.ECPair.fromWIF('Rfr6XJJb7jj2n6hcJH7eJyJEy7nnXm6Z161d2wFdXjTP7so6PMDo')
    const { address } = game.payments.p2sh({
      redeem: game.payments.p2wpkh({ pubkey: keyPair.publicKey })
    })

    assert.strictEqual(address, '3KToBU4ykTWfjnu4kAUV1q8QosnxT61sbf')
  })

  // TODO@Micic: Check if we actually have SegWit
  // it('can generate a P2WSH (SegWit), pay-to-multisig (3-of-4) address', function () {
  //   const pubkeys = [
  //     '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
  //     '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
  //     '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
  //     '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9'
  //   ].map((hex) => Buffer.from(hex, 'hex'))
  //   const { address } = game.payments.p2wsh({
  //     redeem: game.payments.p2ms({ m: 3, pubkeys })
  //   })

  //   assert.strictEqual(address, 'bc1q75f6dv4q8ug7zhujrsp5t0hzf33lllnr3fe7e2pra3v24mzl8rrqtp3qul')
  // })

  it('can generate a P2SH(P2WSH(...)), pay-to-multisig (2-of-2) address', function () {
    const pubkeys = [
      '03e41eb9436ab4be78fd30bd93d9f461696e7e10737acdda6162db3d1d0befe0b6',
      '024f9c3a8224d870ce375f3484664671b3a34e8739d21c669946f0bb80f92bdc1a'
    ].map((hex) => Buffer.from(hex, 'hex'))
    const { address } = game.payments.p2sh({
      redeem: game.payments.p2wsh({
        redeem: game.payments.p2ms({ m: 2, pubkeys })
      })
    })

    assert.strictEqual(address, '36LkV9RTC2qjwfBz4XimhnoiZ1zVSXeV1p')
  })

  it('can support the retrieval of transactions for an address (via 3PBP)', function (done) {
    const keyPair = game.ECPair.makeRandom()
    const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey })

    dhttp({
      method: 'GET',
      url: 'https://blockexplorer.gamecredits.org/api/addresses/' + address + '/balance'
    }, function (err, result) {
      if (err) return done(err)

      // random private keys [probably!] have no balance
      assert.strictEqual(result.balance, 0)
      done()
    })

    dhttp({
      method: 'GET',
      url: 'https://blockexplorer.gamecredits.org/api/addresses/' + address + '/transaction-count'
    }, function (err, result) {
      if (err) return done(err)

      // random private keys [probably!] have no transactions
      assert.strictEqual(result.transactionCount, 0)
      done()
    })
  })

  // TODO@Micic: Check for testnet network parameters
  // // other networks
  // it('can generate a Testnet address', function () {
  //   const testnet = game.networks.testnet
  //   const keyPair = game.ECPair.makeRandom({ network: testnet, rng: rng })
  //   const wif = keyPair.toWIF()
  //   const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey, network: testnet })

  //   assert.strictEqual(address, 'mubSzQNtZfDj1YdNP6pNDuZy6zs6GDn61L')
  //   assert.strictEqual(wif, 'cRgnQe9MUu1JznntrLaoQpB476M8PURvXVQB5R2eqms5tXnzNsrr')
  // })

  // it('can generate a Litecoin address', function () {
  //   const keyPair = game.ECPair.makeRandom({ network: LITECOIN, rng: rng })
  //   const wif = keyPair.toWIF()
  //   const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey, network: LITECOIN })

  //   assert.strictEqual(address, 'LZJSxZbjqJ2XVEquqfqHg1RQTDdfST5PTn')
  //   assert.strictEqual(wif, 'T7A4PUSgTDHecBxW1ZiYFrDNRih2o7M8Gf9xpoCgudPF9gDiNvuS')
  // })
})
