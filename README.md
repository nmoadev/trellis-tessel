# trellis-tessel
A [Tessel](https://tessel.io/) module for [Adafruit Trellis](http://www.adafruit.com/product/1616).
Designed for use with the Tessel 1, this module provides a simple interface to HT16K33 RAM Mapped LED driver that is the heart of the Adafruit Trellis system.

## Features
* Straight-forward button/LED access with row-col coordinates.
* Button press and release events
* Brightness and blink control

## Getting Started
```sh
$ npm install trellis-tessel
```

To use the module
```javascript
var tessel = require('tessel'),
    Trellis = require('trellis-tessel'),
    myTrellis = Trellis(tessel.port['B'], false); // Create a new trellis object connected to portB with interrupts off
myTrellis.ready(function(err) {
  if (!err) {
    myTrellis.fillDisplay();// Turn on all LEDs
    myTrellis.blink(1); // Blink @ 2Hz
  }
});
```

