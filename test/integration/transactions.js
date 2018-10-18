const { describe, it } = require('mocha')
const assert = require('assert')
const game = require('../../')
const regtestUtils = require('./_regtest')
const regtest = regtestUtils.network

function rng () {
  return Buffer.from('YT8dAtK4d16A3P1z+TpwB2jJ4aFH3g9M1EioIBkLEV4=', 'base64')
}

describe('gamejs-lib (transactions)', function () {
  it('can create a 1-to-1 Transaction', function () {
    const alice = game.ECPair.fromWIF('Rc2TdoSek9nB5mVGgy41AGm6ARdyDykRQVYYsWChoFvUChA6BUpA')
    const txb = new game.TransactionBuilder()

    txb.setVersion(1)
    
    txb.addInput('d171f063d8dc05c5c231dba5f59bb56fcb3ba286dcc782fe5b307e27275cb6e2', 0) // Alice's previous transaction output, has 15000 satoshis
    txb.addOutput('GeMsGLjh1XygKgTQ5eKfazj8KTJamZ3CLw', 49900000)

    txb.sign(0, alice)

    // prepare for broadcast to the GameCredits network, see "can broadcast a Transaction" below
    assert.strictEqual(txb.build().toHex(), '0100000001e2b65c27277e305bfe82c7dc86a23bcb6fb59bf5a5db31c2c505dcd863f071d1000000006a47304402200572c9674dab171e64f91aa9ff0757458838ff13505be8d14f43e088979d5eff0220474f5ddd12e1ef63089f235b705c5234c01c690903d819423794f427a78ddc1c012102484c9d8950be897a073880defc2da6fce55a6f810fb51b8761d8dce2ef7bc818ffffffff01e069f902000000001976a914e10c5d2235a634b329673fe2498197b4cb033f9c88ac00000000')
  })

  it('can create a 2-to-2 Transaction', function () {
    const alice = game.ECPair.fromWIF('Rc2TdoSek9nB5mVGgy41AGm6ARdyDykRQVYYsWChoFvUChA6BUpA')
    const bob = game.ECPair.fromWIF('RZYGrLNbJE4xs3ZigGKcq5YUze4Qv5QiE5Xt9H9EVTxPCQ7YnpvR')

    const txb = new game.TransactionBuilder()
    txb.setVersion(1)
    
    txb.addInput('d171f063d8dc05c5c231dba5f59bb56fcb3ba286dcc782fe5b307e27275cb6e2', 0) // Alice's previous transaction output, has 200000 satoshis
    txb.addInput('5f0e1e790a7d33014561856186906d3dd826105683e70e7782b57588207d11df', 0) // Bob's previous transaction output, has 300000 satoshis
    
    txb.addOutput('GWfRv9RBGauU1tuYqfRPu2pSEnxFt8pE84', 99500000)
    txb.addOutput('GeMsGLjh1XygKgTQ5eKfazj8KTJamZ3CLw', 49950000)

    txb.sign(1, bob) // Bob signs his input, which was the second input (1th)
    txb.sign(0, alice) // Alice signs her input, which was the first input (0th)

    // prepare for broadcast to the GameCredits network, see "can broadcast a Transaction" below
    assert.strictEqual(txb.build().toHex(), '0100000002e2b65c27277e305bfe82c7dc86a23bcb6fb59bf5a5db31c2c505dcd863f071d1000000006a47304402203ca9b284f54513094536566ee5b09fdfa787242700d3be1c5a174856656d3d65022042bb3f936736d18f481f9f3ad61cb999194c053d0f141d938a6301c0c6694ae5012102484c9d8950be897a073880defc2da6fce55a6f810fb51b8761d8dce2ef7bc818ffffffffdf117d208875b582770ee783561026d83d6d90866185614501337d0a791e0e5f000000006a47304402202b35d354e193951f09289b81158113f2d149ff40e89d4df163de0c5c19f979e2022060152480f5b1c127bec99b4176b12de80a329c26a1749bb3677a0cc9606207c601210388b16ad109195fd487b51f4d5acbc7460b2d8ab874be2f9f8bb025773b2eedc5ffffffff02e03fee05000000001976a9148c9daf6be074f513ec93f43175fd35053226ebf988ac302dfa02000000001976a914e10c5d2235a634b329673fe2498197b4cb033f9c88ac00000000')
  })

  // TODO@All: Regtest api and faucet needs to be setup
  // it('can create (and broadcast via 3PBP) a typical Transaction', function (done) {
  //   const alice1 = game.ECPair.makeRandom({ network: regtest })
  //   const alice2 = game.ECPair.makeRandom({ network: regtest })
  //   const aliceChange = game.ECPair.makeRandom({ network: regtest, rng: rng })

  //   const alice1pkh = game.payments.p2pkh({ pubkey: alice1.publicKey, network: regtest })
  //   const alice2pkh = game.payments.p2pkh({ pubkey: alice2.publicKey, network: regtest })
  //   const aliceCpkh = game.payments.p2pkh({ pubkey: aliceChange.publicKey, network: regtest })

  //   // give Alice 2 unspent outputs
  //   regtestUtils.faucet(alice1pkh.address, 5e4, function (err, unspent0) {
  //     if (err) return done(err)

  //     regtestUtils.faucet(alice2pkh.address, 7e4, function (err, unspent1) {
  //       if (err) return done(err)

  //       const txb = new game.TransactionBuilder(regtest)
  //       txb.addInput(unspent0.txId, unspent0.vout) // alice1 unspent
  //       txb.addInput(unspent1.txId, unspent1.vout) // alice2 unspent
  //       txb.addOutput('mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf', 8e4) // the actual "spend"
  //       txb.addOutput(aliceCpkh.address, 1e4) // Alice's change
  //       // (in)(4e4 + 2e4) - (out)(1e4 + 3e4) = (fee)2e4 = 20000, this is the miner fee

  //       // Alice signs each input with the respective private keys
  //       txb.sign(0, alice1)
  //       txb.sign(1, alice2)

  //       // build and broadcast our RegTest network
  //       regtestUtils.broadcast(txb.build().toHex(), done)
  //       // to build and broadcast to the actual GameCredits network, see https://github.com/bitcoinjs/bitcoinjs-lib/issues/839
  //     })
  //   })
  // })

  // TODO@All: Regtest api and faucet needs to be setup
  // it('can create (and broadcast via 3PBP) a Transaction with an OP_RETURN output', function (done) {
  //   const keyPair = game.ECPair.makeRandom({ network: regtest })
  //   const p2pkh = game.payments.p2pkh({ pubkey: keyPair.publicKey, network: regtest })

  //   regtestUtils.faucet(p2pkh.address, 2e5, function (err, unspent) {
  //     if (err) return done(err)

  //     const txb = new game.TransactionBuilder(regtest)
  //     const data = Buffer.from('gamejs-lib', 'utf8')
  //     const embed = game.payments.embed({ data: [data] })
  //     txb.addInput(unspent.txId, unspent.vout)
  //     txb.addOutput(embed.output, 1000)
  //     txb.addOutput(regtestUtils.RANDOM_ADDRESS, 1e5)
  //     txb.sign(0, keyPair)

  //     // build and broadcast to the RegTest network
  //     regtestUtils.broadcast(txb.build().toHex(), done)
  //   })
  // })

  // TODO@All: Regtest api and faucet needs to be setup
  // it('can create (and broadcast via 3PBP) a Transaction, w/ a P2SH(P2MS(2 of 4)) (multisig) input', function (done) {
  //   const keyPairs = [
  //     game.ECPair.makeRandom({ network: regtest }),
  //     game.ECPair.makeRandom({ network: regtest }),
  //     game.ECPair.makeRandom({ network: regtest }),
  //     game.ECPair.makeRandom({ network: regtest })
  //   ]
  //   const pubkeys = keyPairs.map(x => x.publicKey)
  //   const p2ms = game.payments.p2ms({ m: 2, pubkeys: pubkeys, network: regtest })
  //   const p2sh = game.payments.p2sh({ redeem: p2ms, network: regtest })

  //   regtestUtils.faucet(p2sh.address, 2e4, function (err, unspent) {
  //     if (err) return done(err)

  //     const txb = new game.TransactionBuilder(regtest)
  //     txb.addInput(unspent.txId, unspent.vout)
  //     txb.addOutput(regtestUtils.RANDOM_ADDRESS, 1e4)

  //     txb.sign(0, keyPairs[0], p2sh.redeem.output)
  //     txb.sign(0, keyPairs[2], p2sh.redeem.output)
  //     const tx = txb.build()

  //     // build and broadcast to the GameCredits RegTest network
  //     regtestUtils.broadcast(tx.toHex(), function (err) {
  //       if (err) return done(err)

  //       regtestUtils.verify({
  //         txId: tx.getId(),
  //         address: regtestUtils.RANDOM_ADDRESS,
  //         vout: 0,
  //         value: 1e4
  //       }, done)
  //     })
  //   })
  // })

  // TODO@All: Regtest api and faucet needs to be setup
  // it('can create (and broadcast via 3PBP) a Transaction, w/ a P2SH(P2WPKH) input', function (done) {
  //   const keyPair = game.ECPair.makeRandom({ network: regtest })
  //   const p2wpkh = game.payments.p2wpkh({ pubkey: keyPair.publicKey, network: regtest })
  //   const p2sh = game.payments.p2sh({ redeem: p2wpkh, network: regtest })

  //   regtestUtils.faucet(p2sh.address, 5e4, function (err, unspent) {
  //     if (err) return done(err)

  //     const txb = new game.TransactionBuilder(regtest)
  //     txb.addInput(unspent.txId, unspent.vout)
  //     txb.addOutput(regtestUtils.RANDOM_ADDRESS, 2e4)
  //     txb.sign(0, keyPair, p2sh.redeem.output, null, unspent.value)

  //     const tx = txb.build()

  //     // build and broadcast to the GameCredits RegTest network
  //     regtestUtils.broadcast(tx.toHex(), function (err) {
  //       if (err) return done(err)

  //       regtestUtils.verify({
  //         txId: tx.getId(),
  //         address: regtestUtils.RANDOM_ADDRESS,
  //         vout: 0,
  //         value: 2e4
  //       }, done)
  //     })
  //   })
  // })

  // TODO@All: Regtest api and faucet needs to be setup
  // it('can create (and broadcast via 3PBP) a Transaction, w/ a P2WPKH input', function (done) {
  //   const keyPair = game.ECPair.makeRandom({ network: regtest })
  //   const p2wpkh = game.payments.p2wpkh({ pubkey: keyPair.publicKey, network: regtest })

  //   regtestUtils.faucetComplex(p2wpkh.address, 5e4, function (err, unspent) {
  //     if (err) return done(err)

  //     // XXX: build the Transaction w/ a P2WPKH input
  //     const txb = new game.TransactionBuilder(regtest)
  //     txb.addInput(unspent.txId, unspent.vout, null, p2wpkh.output) // NOTE: provide the prevOutScript!
  //     txb.addOutput(regtestUtils.RANDOM_ADDRESS, 2e4)
  //     txb.sign(0, keyPair, null, null, unspent.value) // NOTE: no redeem script
  //     const tx = txb.build()

  //     // build and broadcast (the P2WPKH transaction) to the GameCredits RegTest network
  //     regtestUtils.broadcast(tx.toHex(), function (err) {
  //       if (err) return done(err)

  //       regtestUtils.verify({
  //         txId: tx.getId(),
  //         address: regtestUtils.RANDOM_ADDRESS,
  //         vout: 0,
  //         value: 2e4
  //       }, done)
  //     })
  //   })
  // })

  // TODO@All: Regtest api and faucet needs to be setup
  // it('can create (and broadcast via 3PBP) a Transaction, w/ a P2WSH(P2PK) input', function (done) {
  //   const keyPair = game.ECPair.makeRandom({ network: regtest })
  //   const p2pk = game.payments.p2pk({ pubkey: keyPair.publicKey, network: regtest })
  //   const p2wsh = game.payments.p2wsh({ redeem: p2pk, network: regtest })

  //   regtestUtils.faucetComplex(p2wsh.address, 5e4, function (err, unspent) {
  //     if (err) return done(err)

  //     // XXX: build the Transaction w/ a P2WSH input
  //     const txb = new game.TransactionBuilder(regtest)
  //     txb.addInput(unspent.txId, unspent.vout, null, p2wsh.output) // NOTE: provide the prevOutScript!
  //     txb.addOutput(regtestUtils.RANDOM_ADDRESS, 2e4)
  //     txb.sign(0, keyPair, null, null, 5e4, p2wsh.redeem.output) // NOTE: provide a witnessScript!
  //     const tx = txb.build()

  //     // build and broadcast (the P2WSH transaction) to the GameCredits RegTest network
  //     regtestUtils.broadcast(tx.toHex(), function (err) {
  //       if (err) return done(err)

  //       regtestUtils.verify({
  //         txId: tx.getId(),
  //         address: regtestUtils.RANDOM_ADDRESS,
  //         vout: 0,
  //         value: 2e4
  //       }, done)
  //     })
  //   })
  // })

  // TODO@All: Regtest api and faucet needs to be setup
  // it('can create (and broadcast via 3PBP) a Transaction, w/ a P2SH(P2WSH(P2MS(3 of 4))) (SegWit multisig) input', function (done) {
  //   const keyPairs = [
  //     game.ECPair.makeRandom({ network: regtest }),
  //     game.ECPair.makeRandom({ network: regtest }),
  //     game.ECPair.makeRandom({ network: regtest }),
  //     game.ECPair.makeRandom({ network: regtest })
  //   ]
  //   const pubkeys = keyPairs.map(x => x.publicKey)

  //   const p2ms = game.payments.p2ms({ m: 3, pubkeys, network: regtest })
  //   const p2wsh = game.payments.p2wsh({ redeem: p2ms, network: regtest })
  //   const p2sh = game.payments.p2sh({ redeem: p2wsh, network: regtest })

  //   regtestUtils.faucet(p2sh.address, 6e4, function (err, unspent) {
  //     if (err) return done(err)

  //     const txb = new game.TransactionBuilder(regtest)
  //     txb.addInput(unspent.txId, unspent.vout, null, p2sh.output)
  //     txb.addOutput(regtestUtils.RANDOM_ADDRESS, 3e4)
  //     txb.sign(0, keyPairs[0], p2sh.redeem.output, null, unspent.value, p2wsh.redeem.output)
  //     txb.sign(0, keyPairs[2], p2sh.redeem.output, null, unspent.value, p2wsh.redeem.output)
  //     txb.sign(0, keyPairs[3], p2sh.redeem.output, null, unspent.value, p2wsh.redeem.output)

  //     const tx = txb.build()

  //     // build and broadcast to the GameCredits RegTest network
  //     regtestUtils.broadcast(tx.toHex(), function (err) {
  //       if (err) return done(err)

  //       regtestUtils.verify({
  //         txId: tx.getId(),
  //         address: regtestUtils.RANDOM_ADDRESS,
  //         vout: 0,
  //         value: 3e4
  //       }, done)
  //     })
  //   })
  // })

  it('can verify Transaction signatures', function () {
    const txHex = '010000000321c5f7e7bc98b3feda84aad36a5c99a02bcb8823a2f3eccbcd5da209698b5c20000000006b48304502210099e021772830207cf7c55b69948d3b16b4dcbf1f55a9cd80ebf8221a169735f9022064d33f11d62cd28240b3862afc0b901adc9f231c7124dd19bdb30367b61964c50121032b4c06c06c3ec0b7fa29519dfa5aae193ee2cc35ca127f29f14ec605d62fb63dffffffff8a75ce85441ddb3f342708ee33cc8ed418b07d9ba9e0e7c4e1cccfe9f52d8a88000000006946304302207916c23dae212c95a920423902fa44e939fb3d542f4478a7b46e9cde53705800021f0d74e9504146e404c1b8f9cba4dff2d4782e3075491c9ed07ce4a7d1c4461a01210216c92abe433106491bdeb4a261226f20f5a4ac86220cc6e37655aac6bf3c1f2affffffffdfef93f69fe32e944fad79fa8f882b3a155d80383252348caba1a77a5abbf7ef000000006b483045022100faa6e9ca289b46c64764a624c59ac30d9abcf1d4a04c4de9089e67cbe0d300a502206930afa683f6807502de5c2431bf9a1fd333c8a2910a76304df0f3d23d83443f0121039e05da8b8ea4f9868ecebb25998c7701542986233f4401799551fbecf316b18fffffffff01ff4b0000000000001976a9146c86476d1d85cd60116cd122a274e6a570a5a35c88acc96d0700'
    const keyPairs = [
      '032b4c06c06c3ec0b7fa29519dfa5aae193ee2cc35ca127f29f14ec605d62fb63d',
      '0216c92abe433106491bdeb4a261226f20f5a4ac86220cc6e37655aac6bf3c1f2a',
      '039e05da8b8ea4f9868ecebb25998c7701542986233f4401799551fbecf316b18f'
    ].map(function (q) { return game.ECPair.fromPublicKey(Buffer.from(q, 'hex')) })

    const tx = game.Transaction.fromHex(txHex)

    tx.ins.forEach(function (input, i) {
      const keyPair = keyPairs[i]
      const p2pkh = game.payments.p2pkh({
        pubkey: keyPair.publicKey,
        input: input.script
      })

      const ss = game.script.signature.decode(p2pkh.signature)
      const hash = tx.hashForSignature(i, p2pkh.output, ss.hashType)

      assert.strictEqual(keyPair.verify(hash, ss.signature), true)
    })
  })
})
