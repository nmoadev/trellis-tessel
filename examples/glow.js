var tessel = require('tessel'),
    trellis = require('./../index.js')(tessel.port['B'], true),
    fs= require('fs');

trellis.on('error', function(err) {
  console.log(err);
});



trellis.ready(function() {
  var up = 1,
      dim = 0;

  trellis.blink(1);
  trellis.led(0,0).output(1);
  trellis.led(0,1).output(1);
  trellis.led(0,2).output(1);
  trellis.led(0,3).output(1);
  trellis.led(1,0).output(1);
  trellis.led(1,1).output(1);
  trellis.led(1,2).output(1);
  trellis.led(1,3).output(1);
  trellis.led(2,0).output(1);
  trellis.led(2,1).output(1);
  trellis.led(2,2).output(1);
  trellis.led(2,3).output(1);
  trellis.led(3,0).output(1);
  trellis.led(3,1).output(1);
  trellis.led(3,2).output(1);
  trellis.led(3,3).output(1);
});
/**
  setInterval(function() {
    if (up) {
      dim++;
    } else {
      dim--;
    }

    if (dim == 7) {
      up = 0;
    }

    if (dim == 0) {
      up = 1;
    }
    console.log("Dimming at level" + dim);
    trellis.brightness(dim);
  }, 250);
});
*/
