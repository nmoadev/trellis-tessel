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
  var tbutton = {};

  tbutton.getValue = function getValue() {
    return _trellis.buttonValue(buttonAddr);
  };

  // If interrupts are enabled
  if (_trellis.interrupts.enable) {
    util.inherits(tbutton, EventEmitter);

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

    // If Level Triggers are to be used
    } else if (_trellis.interrupts.mode === 'level') {
     
      /**
       * The semantics of level triggers are still iffy
       */

      // Level Trigger for button is pressed 
      //_trellis.port.digital[0].on('high', function onHigh() {
      //  if (_trellis.buttonValue(buttonAddr)) {
      //    tbutton.emit('pressed');
      //  }
      //});

      // Level Trigger for button is released
      //_trellis.port.digital[0].on('low', function onLow() {
      //  if (_trellis.buttonValue(buttonAddr)) {
      //    tbutton.emit('released');
      //  }
      //});

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
