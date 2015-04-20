/**
 * TNode.js
 *
 * This file defines the 3 objects that build up the interface for trellis-tessel.
 * TNode
 *  ┣ TLed
 *  ┖ TButton
 *
 */
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

  tbutton.value = function getValue(cb) {
    return _trellis.value(buttonAddr,cb);
  };

  // If interrupts are enabled
  if (_trellis.interrupts) {

      // Edge Trigger for button being pressed
      _trellis.pub.on('press', function onRise() {
        var val = _trellis.buttonValueCached(buttonAddr); 
        // Go get which button was pressed
        if (val) {
          tbutton.emit('press');
        }
      });

      // Edge Trigger for button being released
      _trellis.pub.on('release', function onFall() {
        if (_trellis.buttonValueCached(buttonAddr)) {
          tbutton.emit('release');
        }
      });
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
