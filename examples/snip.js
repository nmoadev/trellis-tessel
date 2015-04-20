var tessel = require('tessel'),
    trellis = require('./../index.js')(tessel.port['B'], true),
    fs= require('fs');

trellis.on('error', function(err) {
  console.log(err);
});



trellis.ready(function() {
  var i = 0,
      j = 0,
      p = 0,
      interval = 500,
      dim = 0;
  trellis.on('button', function() {
    console.log('Button pushed!');
    dim++;
  });

  console.log("Running Sweep for 8000ms");
  console.log("Turning on (" + i + ',' + j + ')');
  trellis.led(0,0).output(1);

  i = 0x00;
  setInterval(function() {
    trellis.led(i,j).output(0);
    j++;
    if (j > 3) {
      j = j % 4;
      i++;
      i = i % 4;
    }
    console.log("Turning on (" + i + ',' + j + ')');
    trellis.led(i,j).output(1);
    console.log("G1 == " + tessel.port['B'].digital[0].read());
  }, 250);

  setInterval(function() {
    console.log("Dimming at level" + dim);
    trellis.brightness(dim);
  }, 250);
});
