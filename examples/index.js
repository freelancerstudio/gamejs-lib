'use strict'

const game = require('../')
const bip32 = require('bip32')
const bip39 = require('bip39')

function generateRandomAddress() {
  // Generate random GameCredits key pair
  const keyPair = game.ECPair.makeRandom();
  // Retrieve address from that key pair
  const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey })

  // Display relevant information
  console.log('Private key (WIF format): ' + keyPair.toWIF())
  console.log('Public key: ' + keyPair.publicKey.toString('hex'))
  console.log('Address: ' + address)
}

function generateAddressFromSha256() {
  // Get sha256 hash from a string
  const hash = game.crypto.sha256(Buffer.from('correct horse battery staple'))
  // Get GameCredits keypair from given hash
  const keyPair = game.ECPair.fromPrivateKey(hash)
  // Retrieve address from that key pair
  const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey })

  // Display relevant information
  console.log('Private key (WIF format): ' + keyPair.toWIF())
  console.log('Public key: ' + keyPair.publicKey.toString('hex'))
  console.log('Address: ' + address)
}

function importAddressFromWIF() {
  // Retrieve key pair from an existing private key in WIF format
  const keyPair = game.ECPair.fromWIF('Rfr6XJJb7jj2n6hcJH7eJyJEy7nnXm6Z161d2wFdXjTP7so6PMDo')
  // Get GameCredits address using that keypair
  const { address } = game.payments.p2pkh({ pubkey: keyPair.publicKey })

  // Display relevant information
  console.log('Private key (WIF format): ' + keyPair.toWIF())
  console.log('Public key: ' + keyPair.publicKey.toString('hex'))
  console.log('Address: ' + address);
}

function generate2of2P2SHAddress() {
  // GameCredits public keys that are used in creating a multisignature address
  const pubKeys = [
    '024f9c3a8224d870ce375f3484664671b3a34e8739d21c669946f0bb80f92bdc1a',
    '020a32c5d287b892dcf1d14ddd95bc50996757d1dd0ad2caae1950a64a642cecea'
  ].map((hex) => Buffer.from(hex, 'hex'))

  // Create P2SM (Pay to multisignature) to define type of our multisignature address
  const p2ms = game.payments.p2ms({
    // Number of required signatures to send GameCredits from multisignature address
    // M variable can go between 1 and 16
    m: 2,
    // GameCredits public keys that are invloved in creation of multisignature address
    pubkeys: pubKeys
  })

  // Create P2SH (Pay to script hash) using P2MS as redeem script
  const p2sh = game.payments.p2sh({
    redeem: p2ms
  })

  // Display relevant information
  // In order to use multisignature address, you should send GameCredits to that address
  console.log('Multisignature address: ' + p2sh.address)
  console.log('Redeem script: ' + p2ms.output.toString('hex'))
}

function generate2of3P2SHAddress() {
  // GameCredits public keys that are used in creating a multisignature address
  const pubKeys = [
    '03e41eb9436ab4be78fd30bd93d9f461696e7e10737acdda6162db3d1d0befe0b6',
    '024f9c3a8224d870ce375f3484664671b3a34e8739d21c669946f0bb80f92bdc1a',
    '020a32c5d287b892dcf1d14ddd95bc50996757d1dd0ad2caae1950a64a642cecea'
  ].map((hex) => Buffer.from(hex, 'hex'))

  // Create P2SM (Pay to multisignature) to define type of our multisignature address
  const p2ms = game.payments.p2ms({
    // Number of required signatures to send GameCredits from multisignature address
    // M variable can go between 1 and 16
    m: 2,
    // GameCredits public keys that are invloved in creation of multisignature address
    pubkeys: pubKeys
  })

  // Create P2SH (Pay to script hash) using P2MS as redeem script
  const p2sh = game.payments.p2sh({
    redeem: p2ms
  })

  // Display relevant information
  // In order to use multisignature address, you should send GameCredits to that address
  console.log('Multisignature address: ' + p2sh.address)
  console.log('Redeem script: ' + p2ms.output.toString('hex'))
}

function create1to1Transaction() {
  // Insert your private key in WIF format
  const keyPair = game.ECPair.fromWIF("Rfr6XJJb7jj2n6hcJH7eJyJEy7nnXm6Z161d2wFdXjTP7so6PMDo")
  
  // Instance of a Transaction Builder
  const txb = new game.TransactionBuilder()
  // Sets the version of the transaction (default is 1, but could also be 2)
  txb.setVersion(1)
  // Set locktime to 0 so receiver can immediately use GameCredits
  txb.setLockTime(0)
  
  // Insert unspent transaction that you are about to spend (transaction hash, vout index)
  txb.addInput('unspent transaction hash', 1000000)
  // Set receivers address and amount that you want to send
  txb.addOutput('receivers address', 1000000)
  
  // Sign your input with your private key
  txb.sign(0, keyPair)

  // Our raw transaction in hexadecimal format that is ready to be broadcasted over the GameCredist network
  const rawTransactionHex = txb.build().toHex()
  // Display raw transaction in hexadecimal format
  console.log('Raw Transaction (Hexadecimal): ' + rawTransactionHex)
}

function create2to2Transaction() {
  // Insert both of your private keys in WIF format
  const keyPair1 = game.ECPair.fromWIF('Rfr6XJJb7jj2n6hcJH7eJyJEy7nnXm6Z161d2wFdXjTP7so6PMDo')
  const keyPair2 = game.ECPair.fromWIF('RdjqATG6F8DL3j4NiLetyPBzNcBWJWsVgWLHDxwkw3jLC7ADPaZU')

  // Instance of a Transaction Builder
  const txb = new game.TransactionBuilder()

  // Sets the version of the transaction (default is 1, but could also be 2)
  txb.setVersion(1)
  // Set locktime to 0 so receiver can immediately use GameCredits
  txb.setLockTime(0)

  // Insert unspent transactions that you are about to spend (transaction hash, vout index)
  // In this case first input should be first private keys unspent transaction
  // and the second input should be second private keys unspent transaction
  txb.addInput('unspent transaction hash', 0)
  txb.addInput('unspent transaction hash', 0)

  // Set receivers address and amount that you want to send
  txb.addOutput('receivers address', 1000000)
  txb.addOutput('receviers address', 1000000)

  // Sign your first input with the first private key
  txb.sign(0, keyPair1)
  // Sign your second input with the second private key
  txb.sign(1, keyPair2)

  // Our raw transaction in hexadecimal format that is ready to be broadcasted over the GameCredist network
  const rawTransactionHex = txb.build().toHex()
  // Display raw transaction in hexadecimal format
  console.log('Raw Transaction (Hexadecimal): ' + rawTransactionHex)
}

function createTransactionFromMultisignatureAddress() {
  // List of GameCredits key pairs
  const keyPairs = [
    game.ECPair.fromWIF('Rf2H2R4KRA8khyBspuhNBE3sRXvVdaYjyQzGCfPH44nDRmABeapA'),
    game.ECPair.fromWIF('RdjqATG6F8DL3j4NiLetyPBzNcBWJWsVgWLHDxwkw3jLC7ADPaZU'),
    game.ECPair.fromWIF('RbmPvgWhR5tcHsxooJR7ngo2sLUig3K6cVfzS8uQidLd1cB32fzv')
  ]
  // Transform those keypairs to public keys
  const pubkeys = keyPairs.map(x => x.publicKey)

  // Create P2SM (Pay to multisignature) to define type of our multisignature address
  const p2ms = game.payments.p2ms({ m: 2, pubkeys: pubkeys })
  // Create P2SH (Pay to script hash)
  const p2sh = game.payments.p2sh({ redeem: p2ms })

  // Create transaction to retreive funds from this multisignature address
  const txb = new game.TransactionBuilder()
  // Sets the version of the transaction (default is 1, but could also be 2)
  txb.setVersion(1)
  // Set locktime to 0 so receiver can immediately use GameCredits
  txb.setLockTime(0)

  // Insert unspent transaction that you are about to spend (transaction hash, vout index)
  // This unspent transaction should be from multisignature address that you created earlier
  txb.addInput('unspent transaction hash', 0)
  // Set receivers address and amount that you want to send
  txb.addOutput('receviers address', 1000000)

  // This transaction should be signed with at least two GameCredits private keys
  // We should declare redeem script in this case
  txb.sign(0, keyPairs[0], p2sh.redeem.output)
  txb.sign(0, keyPairs[1], p2sh.redeem.output)

  // Our raw transaction in hexadecimal format that is ready to be broadcasted over the GameCredist network
  const rawTransactionHex = txb.build().toHex()
  // Display raw transaction in hexadecimal format
  console.log('Raw Transaction (Hexadecimal): ' + rawTransactionHex)
}

function verifyTransactionSignature() {
  // Raw transaction in hexadecimal format
  const txHex = '010000000321c5f7e7bc98b3feda84aad36a5c99a02bcb8823a2f3eccbcd5da209698b5c20000000006b48304502210099e021772830207cf7c55b69948d3b16b4dcbf1f55a9cd80ebf8221a169735f9022064d33f11d62cd28240b3862afc0b901adc9f231c7124dd19bdb30367b61964c50121032b4c06c06c3ec0b7fa29519dfa5aae193ee2cc35ca127f29f14ec605d62fb63dffffffff8a75ce85441ddb3f342708ee33cc8ed418b07d9ba9e0e7c4e1cccfe9f52d8a88000000006946304302207916c23dae212c95a920423902fa44e939fb3d542f4478a7b46e9cde53705800021f0d74e9504146e404c1b8f9cba4dff2d4782e3075491c9ed07ce4a7d1c4461a01210216c92abe433106491bdeb4a261226f20f5a4ac86220cc6e37655aac6bf3c1f2affffffffdfef93f69fe32e944fad79fa8f882b3a155d80383252348caba1a77a5abbf7ef000000006b483045022100faa6e9ca289b46c64764a624c59ac30d9abcf1d4a04c4de9089e67cbe0d300a502206930afa683f6807502de5c2431bf9a1fd333c8a2910a76304df0f3d23d83443f0121039e05da8b8ea4f9868ecebb25998c7701542986233f4401799551fbecf316b18fffffffff01ff4b0000000000001976a9146c86476d1d85cd60116cd122a274e6a570a5a35c88acc96d0700'
  // List of public keys that were in hexadecimal transacation
  const keyPairs = [
    '032b4c06c06c3ec0b7fa29519dfa5aae193ee2cc35ca127f29f14ec605d62fb63d',
    '0216c92abe433106491bdeb4a261226f20f5a4ac86220cc6e37655aac6bf3c1f2a',
    '039e05da8b8ea4f9868ecebb25998c7701542986233f4401799551fbecf316b18f'
  ].map(function (q) { return game.ECPair.fromPublicKey(Buffer.from(q, 'hex')) })

  // Parse raw transacation
  const tx = game.Transaction.fromHex(txHex)

  // For every input in raw transaction check the signature
  tx.ins.forEach(function (input, i) {
    const keyPair = keyPairs[i]
    const p2pkh = game.payments.p2pkh({
      pubkey: keyPair.publicKey,
      input: input.script
    })

    const ss = game.script.signature.decode(p2pkh.signature)
    const hash = tx.hashForSignature(i, p2pkh.output, ss.hashType)

    const verify = keyPair.verify(hash, ss.signature)
    // Dispaly relevant information
    console.log('Is the signature verified? - ' + verify)
  })
}

// Get address using BIP39 and BIP32 Nodes
// This function is a utilty function
function getAddress (node, network) {
  return game.payments.p2pkh({ pubkey: node.publicKey, network }).address
}

function generate12WordMnemonic() {
  // Default instance of generateMnemonic() will generate a 12 word mnemonic
  // Default strenght is 128
  const mnemonic = bip39.generateMnemonic()

  // Display mnemonic
  console.log(mnemonic)
}

function generateStrongerMnemonic() {
  // This instance of generateMnemonic() will generate a 24 word mnemonic
  const mnemonic24Words = bip39.generateMnemonic(256)

  // Display mnemonic
  console.log(mnemonic24Words)
}

function generateMnemonicWithSpanishWordlist() {
  // Generate default mnemonic using spanish wordlist
  const mnemonic = bip39.generateMnemonic(128, null, bip39.wordlists.spanish)

  // Display spanish mnemonic
  console.log(mnemonic)
}

function validateMnemonic() {
  // Generate a default mnemonic
  const mnemonic = bip39.generateMnemonic()
  // Check if that mnemonic is valid
  const valid = bip39.validateMnemonic(mnemonic)

  // Display relevant information
  console.log('Is this mnemonic valid? - ' + valid)
}

function importBIP39PrivExportWIF() {
  // declare BIP39 root key
  const xpriv = 'xprv9s21ZrQH143K4DRBUU8Dp25M61mtjm9T3LsdLLFCXL2U6AiKEqs7dtCJWGFcDJ9DtHpdwwmoqLgzPrW7unpwUyL49FZvut9xUzpNB6wbEnz'

  // export root key from base58
  const node = bip32.fromBase58(xpriv, game.networks.gamecredits)

  // Display relevant information
  console.log('Private key in WIF format: ' + node.toWIF())
}

function exportBIP32PrivImportIt() {
  // Hardcoded mnemonic (used as example)
  const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
  // Converting mnemonic to a valid BIP39 seed
  const seed = bip39.mnemonicToSeed(mnemonic)
  // Converting seed to BIP39 Root key
  const rootKey = bip32.fromSeed(seed, game.networks.gamecredits).toBase58()
  // Restoring the BIP32 Root key
  const restored = bip32.fromBase58(rootKey, game.networks.gamecredits)

  // Display relevant information
  console.log('Account address: ' + getAddress(restored))
  console.log('Account private key in WIF format: ' + restored.toWIF())
}

function exportBIP32xPub() {
  // Hardcoded mnemonic (used as example)
  const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
  // Converting mnemonic to a valid BIP39 seed
  const seed = bip39.mnemonicToSeed(mnemonic)
  // Converting seed to BIP39 object
  const rootKey = bip32.fromSeed(seed, game.networks.gamecredits)
  // Exporting xPubKey
  const xPubKey = rootKey.neutered().toBase58()

  // Display BIP32 xPublicKey 
  console.log('xPublicKey: ' + xPubKey)
}

function createBIP32AccountExternal() {
  // Hardcoded mnemonic (used as example)
  const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
  // Converting mnemonic to a valid BIP39 seed
  const seed = bip39.mnemonicToSeed(mnemonic)
  // Converting seed to BIP39 object
  const rootKey = bip32.fromSeed(seed, game.networks.gamecredits)
  // Creating derivation path from our root key
  // This is a default derivation path, you should use another one
  const child = rootKey.derivePath('m/0')
  
  // Path of the first child should be m/0/0
  const firstChild = child.derivePath('0')
  // Path of the second child should be m/0/1
  const secondChild = child.derivePath('1')

  // Display child addresses
  console.log('First child address: ' + getAddress(firstChild))
  console.log('Second child address: ' + getAddress(secondChild))
}

function BIP39toBIP32Addresses() {
  // Hardcoded mnemonic (used as example)
  const mnemonic = 'praise you muffin lion enable neck grocery crumble super myself license ghost'
  // Converting mnemonic to a valid BIP39 seed
  const seed = bip39.mnemonicToSeed(mnemonic)
  // Converting seed to BIP39 object
  const rootKey = bip32.fromSeed(seed, game.networks.gamecredits)

  // Declare receiving addresses
  const firstReceiveAddress = getAddress(rootKey.derivePath("m/0'/0/0"))
  const secondReceiveAddress = getAddress(rootKey.derivePath("m/0'/0/1"))

  // Declare change addresses
  const firstChangeAddress = getAddress(rootKey.derivePath("m/0'/1/0"))
  const secondChangeAddress = getAddress(rootKey.derivePath("m/0'/1/1"))

  // Display receiving addresses
  console.log('First receive address: ' + firstReceiveAddress)
  console.log('Second receive address: ' + secondReceiveAddress)

  // Display change addresses
  console.log('First change address: ' + firstChangeAddress)
  console.log('Second change address: ' + secondChangeAddress)
}
