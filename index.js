var tessel = require('tessel'),     // This requires that tessel libraries be installed on developers machine
    TNode = require('./lib/TNode.js'),       // This 
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    Commands,
    Trellis;                        // The module function


/**
 * The commands used to communicate with the HT16K33
 */
Commands = {
  DEV_ADDR: 0x70,
  OSC_ON: 0x21,
  DISP_ON: 0x81,
  INT_ON_ACT_HI: 0xA3,
  READ_BTN: 0x40
};


/**
 * This function creates a new Trellis object
 */
Trellis = function Trellis(port, interrupt_enable) {
  var trellis = new EventEmitter(), // For public interface, errors, etc
      _trellis = {}; // For internal data

  //
  // Initialization
  //

  // Setup default options
  trellis.setMaxListeners(20);
  _trellis.pub = trellis;
  _trellis.port = port;
  _trellis.dispBuf = new Buffer(17);
  _trellis.dispBuf.fill(0);
  // The device i2c address
  _trellis.i2c = new port.I2C(Commands.DEV_ADDR);
  _trellis.interrupts = !!interrupt_enable;
  
  // Device connection


  /**
   * Build up the matrix of nodes
   */
  _trellis.nodes = [
    [TNode(0x72, 0x07, _trellis), TNode(0x67, 0x04, _trellis), TNode(0x65, 0x02, _trellis), TNode(0x64, 0x22, _trellis)],
    [TNode(0x50, 0x05, _trellis), TNode(0x51, 0x00, _trellis), TNode(0x43, 0x00, _trellis), TNode(0x44, 0x01, _trellis)],
    [TNode(0x26, 0x03, _trellis), TNode(0x33, 0x10, _trellis), TNode(0x21, 0x30, _trellis), TNode(0x20, 0x21, _trellis)],
    [TNode(0x16, 0x13, _trellis), TNode(0x15, 0x12, _trellis), TNode(0x14, 0x11, _trellis), TNode(0x02, 0x31, _trellis)]
  ];

  /**
   * Read the key data and store it in the btn buffer. This is called whenever an interrupt is raised
   * NOTE: The key data was be read entirely in order for the inerrupt flag to be reset
   */
  _trellis.readKeyData = function(cause) {
    _trellis.i2c.transfer(new Buffer([Commands.READ_BTN]), 6, function(err, rx) { 
    if (err) {
      trellis.emit("error", err);
      return;
    }
    _trellis.btnBuf = rx;
    trellis.emit('keydata');
    trellis.emit(cause);
    });
  }; // end read key data

  _trellis.buttonValueCached = function buttonValueCached(addr) {
    var mask;
    mask = (1 << (addr & 0x0F)); // Use the lower half othe address as a mask to choose just one bit
    return (_trellis.btnBuf[(addr >> 4)] & mask);
  };

  /**
   *
   */
  _trellis.buttonValue = function buttonValue(addr, callback) {    
    var mask;
    mask = (1 << (addr & 0x0F)); // Use the lower half othe address as a mask to choose just one bit
    // If interrupts are enabled, the key data was already read and stored in btnBuf
    if (_trellis.interrupts) {
      callback(_trellis.btnBuf[(addr >> 4)] & mask);
    // If interrupts are NOT enabled, the key data must be read on demand.
    } else {
      // Setup a one-time event handler for grabbing the button value
      _trellis.pub.once('keydata', function() {
        // Get 1 byte from the buffer and mask it, if the result equals the mask, the button is on
        if (_trellis.btnBuf[(addr >> 4)] & mask) {
          callback(1);
        } else {
          callback(0);
        }    
      });

      // Initate key data read
      _trellis.readKeyData(); 
    }
  }; // end buttonValue

  /**
   *
   */
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
  }; // end outputLed

  /**
   * Called to setup the actual connection to the HT16K33
   */
  trellis.ready = function ready(callback) {
    _trellis.i2c.send(new Buffer([Commands.OSC_ON]), function(err1) { // Turn on system oscillator
      if (err1) {
        trellis.emit('error', err1);
        return;
      }
      _trellis.i2c.send(new Buffer([Commands.DISP_ON]), function(err2) { // Turn on display no blink
        if (err2) {
          trellis.emit('error', err2);
          return;
        }
        _trellis.i2c.send(new Buffer([Commands.INT_ON_ACT_HI]), function(err3) { // Turn on Interrupts, with the interrupt pin being active high
          if (err3) {
            trellis.emit('error', err3);
            return;
          }

          if (_trellis.interrupts) {
            _trellis.port.digital[0].input();
            // Initial read to ensure that interrupt is cleared
            trellis.once('keydata', function() {
              _trellis.port.digital[0].on('rise', function() {
                _trellis.readKeyData('press');
              }); // end on rise
              _trellis.port.digital[0].on('fall', function() {
                _trellis.readKeyData('release');
              });
            }); // end button once
            _trellis.readKeyData();
            callback();
          } // end if interrupts
        }); // end send INT_ON
      }); // end send DISP_ON
    }); // end send OSC_ON
  }; // end ready
  

  /**
   * Retrieve the port that the module is using.
   */
  trellis.port = function port() {
    return _trellis.port;
  };

  /**
   * Grab a specific LED
   */
  trellis.led = function led(row, col) {
    return _trellis.nodes[row][ col].led;
  };

  /**
   * Grab a specific Button
   */
  trellis.button = function button(row, col) {
    return _trellis.nodes[row][col].button;
  };

  /**
   * Grab a node (button-led pair)
   */
  trellis.node = function node(row, col) {
    return _trellis.nodes[row][col];
  };

  /**
   * Set the brightness of the display
   * Levels: - 0 (dimmest) to 7 (brightest)
   */
  trellis.brightness = function brightness(level) {
    level = level % 8;
    _trellis.i2c.send(new Buffer([0xE0 | level]));
  }; 

  /**
   * Sets the blinking frequency for the display
   * 0 - No Blinking
   * 1 - 2 Hz
   * 2 - 1 Hz
   * 3 - .5 Hz
   */
  trellis.blink = function blink(speed) {
    speed = speed & 0x07;
    speed = speed << 1;
    _trellis.i2c.send(new Buffer([Commands.DISP_ON | speed]));
  };

  return trellis;
};


module.exports = Trellis;
