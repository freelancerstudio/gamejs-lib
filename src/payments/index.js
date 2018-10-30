const embed = require('./embed')
const p2ms = require('./p2ms')
const p2pk = require('./p2pk')
const p2pkh = require('./p2pkh')
const p2sh = require('./p2sh')
const p2wpkh = require('./p2wpkh')
const p2wsh = require('./p2wsh')

// Segwit disabled
// module.exports = { embed, p2ms, p2pk, p2pkh, p2sh, p2wpkh, p2wsh }

module.exports = { embed, p2ms, p2pk, p2pkh, p2sh }
// TODO
// witness commitment
