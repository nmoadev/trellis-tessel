var tessel = require('tessel'),     // This requires that tessel libraries be installed on developers machine
    TNode = require('./lib/TNode.js'),       // This 
    util = require('util'),
    EventEmitter= require('events').EventEmitter,
    Trellis;                        // The module function

/**
 * This function creates a new Trellis object
 */
Trellis = function Trellis(port, interrupt_enable, interrupt_mode) {
  var trellis = new EventEmitter(), // For public interface
      _trellis = {}; // For internal data


  // Setup default options
  _trellis.port = port;
  _trellis.dispBuf = new Buffer(17);
  _trellis.dispBuf.fill(0);
  // The device i2c address
  _trellis.addr = 0x70;
  _trellis.i2c = new port.I2C(_trellis.addr);
  _trellis.interrupts = {
    enable: true,
    mode: 'edge'
  };

  trellis.ready = function ready(callback) {
    _trellis.i2c.send(new Buffer([0x21]), function(err) { // Turn on system oscillator b'0010 0001'
      if (!err) {
        _trellis.i2c.send(new Buffer([0x81]), function(err) { // Turn on display no blink  b'1000 0001'
          if (!err) {
            setTimeout(function(){callback(trellis)}, 1000);
          } else {
            trellis.emit('err');
          }
        });
      } else {
       trellis.emit('err'); 
      }
    });

  };

  _trellis.interrupts.enable = !!interrupt_enable; // coerce enable to be boolean
  if (mode === 'level' || mode === 'edge') {
    _trellis.interrupts.mode = interrupt_mode;
  }

  /**
   * Build up the matrix of nodes
   */
  _trellis.nodes = [
    [TNode(0x72, 0x07, _trellis), TNode(0x67, 0x04, _trellis), TNode(0x65, 0x02, _trellis), TNode(0x64, 0x22, _trellis)],
    [TNode(0x50, 0x05, _trellis), TNode(0x51, 0x00, _trellis), TNode(0x43, 0x00, _trellis), TNode(0x44, 0x01, _trellis)],
    [TNode(0x26, 0x03, _trellis), TNode(0x33, 0x10, _trellis), TNode(0x21, 0x30, _trellis), TNode(0x20, 0x21, _trellis)],
    [TNode(0x16, 0x13, _trellis), TNode(0x15, 0x12, _trellis), TNode(0x14, 0x11, _trellis), TNode(0x02, 0x31, _trellis)]
  ];
 
  _trellis.buttonValue = function checkButton(buttonAddr) {
    // Send read button data response
//    _trellis.i2c.transfer(new Buffer([]), function (err, rx) {
      // Get back some buffer and go through the results, we REALLY need something better than callbacks
//    });
  };

  _trellis.outputLed = function outputLed(ledAddr, value) {
    var bufferOffset, // which byte in the offset to we need to change?
        currentByte; // the current byte which we are working on 
    bufferOffset = 1 + (ledAddr >> 4); // Use the top 4 bites of the address to index into the buffer
    bytes = _trellis.dispBuf.readUInt8(bufferOffset); // Read 1 byte from that location in the buffer
    if (value) { // LED should be on
      bytes |= (1 << (0x0F & ledAddr)); // Use the bottom 4 bits of the address to choose 1 bit to toggle in the byte
    } else { // LED should be off
      bytes &= ~(1 << (0x0F & ledAddr)); // Use the buttom 4 bits of the address to choose 1 bite toggle in the byte
    }
    _trellis.dispBuf.writeUInt8(bytes, bufferOffset); // Write the byte back into the buffer
    _trellis.i2c.send(_trellis.dispBuf); // Send the whole buffer, including the display pointer command as the first byte
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
    return _trellis.nodes[row][col];
  };

  trellis.dim = function dim(level) {
    level = level | 15;
    level = level % 16;
    i2c.send(new Buffer([0xE0 | level]));
  }; 

  return trellis;
}


module.exports = Trellis;
