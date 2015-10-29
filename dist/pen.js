var Pen;

Pen = (function() {
  function Pen() {
    this.kc = new KeyChain;
  }

  Pen.prototype.address = function() {
    return this.kc.address_s;
  };

  Pen.prototype.balance = function(callback) {
    return this.kc.balance(function(amount) {
      return callback(amount);
    });
  };

  Pen.prototype.write = function(message, callback) {
    return this.kc.unspent((function(_this) {
      return function(unspent) {
        var be;
        if (unspent.error) {
          return console.log(unspent.error);
        } else {
          unspent = unspent.unspent_outputs;
          be = new BitcoreExt(_this.kc.address_s, _this.kc.privateKey.toString());
          return be.sign_and_broadcast(message, unspent, function(tx) {
            console.log("TX DATA " + tx);
            return callback(tx);
          });
        }
      };
    })(this));
  };

  return Pen;

})();
