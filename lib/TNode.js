var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    TLed,
    TButton,
    TNode;

TLed = function TLed(ledAddr, _trellis) {
  var tled = {};
  tled.output = function output(value) {
    _trellis.outputLed(ledAddr, value);
  }
  return tled;
};

TButton = function TButton(buttonAddr, _trellis) {
  var tbutton = new EventEmitter();

  tbutton.getValue = function getValue(cb) {
    return _trellis.buttonValue(buttonAddr,cb);
  };

  // If interrupts are enabled
  if (_trellis.interrupts.enable) {

    // If Edge Triggers are to be be used
    if (_trellis.interrupts.mode === 'edge') {
      
      // Edge Trigger for button being pressed
      _trellis.port.digital[0].on('rise', function onRise() {
        // Go get which button was pressed
        if (_trellis.buttonValue(buttonAddr)) {
          tbutton.emit('press');
        }
      });

      // Edge Trigger for button being released
      _trellis.port.digital[0].on('fall', function onFall() {
        if (_trellis.buttonValue(buttonAddr)) {
          tbutton.emit('release');
        }
      });

    } 
  }

  return tbutton;
};

TNode = function TNode(ledAddr, buttonAddr, _trellis) {
  var tnode = {};
  tnode.button = TButton(buttonAddr, _trellis);
  tnode.led = TLed(ledAddr, _trellis);
  return tnode;
};

module.exports = TNode;
