var tessel = require('tessel'),     // This requires that tessel libraries be installed on developers machine
    TNode = require('./TNode.js'),       // This 
    Trellis;                        // The module function

/**
 * This function creates a new Trellis object
 */
Trellis = function Trellis(port, interrupt_enable, interrupt_mode) {
  var trellis = {}, // For public interface
      _trellis = {}; // For internal data
  
  // Setup default options
  _trellis.port = port;
  // The device i2c address
  _trellis.addr = 0x70;
  _trellis.i2c = new port.I2C(_trellis.addr);
  _trellis.interrupts = {
    enable: true,
    mode: 'edge'
  };

  _trellis.interrupts.enable = !!interrupt_enable; // coerce enable to be boolean
  if (mode === 'level' || mode === 'edge') {
    _trellis.interrupts.mode = interrupt_mode;
  }

  /**
   * Build up the matrix of nodes
   */
  _trellis.nodes = [
    [TNode(0x3A, 0x07, _trellis), TNode(0x37, 0x04, _trellis), TNode(0x35, 0x02, _trellis), TNode(0x34, 0x22, _trellis)],
    [TNode(0x28, 0x05, _trellis), TNode(0x06, 0x00, _trellis), TNode(0x23, 0x00, _trellis), TNode(0x24, 0x01, _trellis)],
    [TNode(0x16, 0x03, _trellis), TNode(0x1B, 0x10, _trellis), TNode(0x11, 0x30, _trellis), TNode(0x10, 0x21, _trellis)],
    [TNode(0x0E, 0x13, _trellis), TNode(0x0D, 0x12, _trellis), TNode(0x0C, 0x11, _trellis), TNode(0x02, 0x31, _trellis)]
  ];
 
  _trellis.buttonValue = function checkButton(buttonAddr) {
    console.trace("Check");
    // Send read button data response
//    _trellis.i2c.transfer(new Buffer([]), function (err, rx) {
      // Get back some buffer and go through the results, we REALLY need something better than callbacks
//    });
  };

  _trellis.outputLed = function outputLed(ledAdr, value) {
    console.trace("Check");
    console.log("Check");

  };


  /**
   * Retrieve the port that the module is using.
   */
  trellis.port = function port() {
    return _trellis.port;
  };

  trellis.led = function led(row, col) {
    return _trellis.nodes[row][ col].led;
  };

  trellis.button = function button(row, col) {
    return _trellis.nodes[row][col].button;
  };

  trellis.node = function node(row, col) {
    console.trace("In node");
    return _trellis.nodes[row][col];
  };

  return trellis;
}


module.exports = Trellis;
