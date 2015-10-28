var BitcoreExt, TX_FEE, bitcore;

TX_FEE = 10000;

bitcore = require('bitcore');

BitcoreExt = (function() {
  function BitcoreExt(address1, pvt_key_string) {
    this.address = address1;
    this.pvt_key_string = pvt_key_string;
  }

  BitcoreExt.prototype.sign_and_broadcast = function(message, utxos, callback) {
    var address, amount, amount_btc, amount_satoshis, does_include, fee, i, is_empty, len, pvt_key, store, total_amount_sathoshis, transaction, tx_amount, tx_hash, tx_id, utxo, utxos_out;
    store = false;
    does_include = function(array, element) {
      return array.indexOf(element) !== -1;
    };
    is_empty = function(val) {
      return !val || val === "";
    };
    console.log("sign and broadcast");
    tx_amount = 1000;
    console.log("utxo_count", utxos.length);
    utxos_out = [];
    total_amount_sathoshis = 0;
    for (i = 0, len = utxos.length; i < len; i++) {
      utxo = utxos[i];
      amount_satoshis = utxo.value;
      total_amount_sathoshis += amount_satoshis;
      amount_btc = new bitcore.Unit.fromSatoshis(amount_satoshis).BTC;
      console.log(amount_btc);
      tx_id = utxo.tx_hash_big_endian;
      if (store && store.utxos && does_include(JSON.parse(store.utxos), tx_id)) {
        console.log("skipping transaction: " + tx_id);
        continue;
      }
      utxos_out.push({
        address: this.address,
        txId: tx_id,
        scriptPubKey: utxo.script,
        amount: amount_btc,
        vout: utxo.tx_output_n
      });
      if (amount_satoshis > TX_FEE + tx_amount) {
        break;
      }
    }
    console.log("utxos_out:", utxos_out.size);
    if (!is_empty(utxos)) {
      fee = TX_FEE;
      address = this.address;
      amount = tx_amount;
      pvt_key = this.pvt_key_string;
      console.log("utxos_out: ", utxos_out);
      transaction = new bitcore.Transaction().from(utxos_out).to(address, amount).change(address).fee(fee).addData(message).sign(pvt_key);
      tx_hash = transaction.serialize();
      console.log(tx_hash);
      console.log("TODO: push");
    } else {
      console.log("ERROR: Not enough UTXOs");
    }
    return console.log("END");
  };

  return BitcoreExt;

})();

if (typeof module !== "undefined" && module !== null) {
  module.exports = BitcoreExt;
}