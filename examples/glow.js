var tessel = require('tessel'),
    trellis = require('./../index.js')(tessel.port['B'], true),
    fs= require('fs');

trellis.on('error', function(err) {
  console.log(err);
});



trellis.ready(function() {
  var up = 1,
      dim = 0;

  trellis.clearDisplay();
  setInterval(function() {
    trellis.led(Math.floor(dim / 4), dim % 4).output(up);
    
    if (dim == 15 && up) {
      up = 0;
      return;
    }
    if (dim == 0 && !up) {
      up = 1;
      return;
    }
    trellis.brightness(dim);
    if (up) {
      dim++;
    } else {
      dim--;
    }

  }, 50);
});
