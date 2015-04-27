var Trellis = require('../index.js'),
    should = require('should'),
    sinon = require('sinon'),
    tessl_mock,
    MockI2C,
    spies = {};


/**
 * A mocked-out implementation of the I2C 'class' available on the tessel port
 */
MockI2C = function(addr) {
  this.send = function(buf, cb){
    if (cb) {
      cb();
    }
  };
  this.transfer = function(buf, sz, cb) {
    cb(new Buffer(sz));
  };
  spies.send = sinon.spy(this, 'send');
  spies.transfer = sinon.spy(this, 'transfer');
};


/**
 * A mocked out tessl object
 */
tessel_mock = {
  port: {
    B : {
      I2C : MockI2C,
      digital: [
        {
          on: function() {},
          input: function() {}
        }  
      ]
    }
  }
};

var trellis;
trellis = Trellis(tessel_mock.port['B'], true);
trellis.on('error', console.log);
describe('Trellis', function() {
  before(function(done) {
    trellis.ready(function() {
      done();
    });
  });

  
    it('should have all the methods called out by API', function() {
      trellis.should.have.properties([
        'button',
        'led',
        'node',
        'clearDisplay',
        'fillDisplay',
        'brightness',
        'blink',
        'ready',
        'port'
      ]);
      trellis.button.should.be.a.Function;
      trellis.node.should.be.a.Function;
      trellis.led.should.be.a.Function;
      trellis.clearDisplay.should.be.a.Function;
      trellis.fillDisplay.should.be.a.Function;
      trellis.brightness.should.be.a.Function;
      trellis.blink.should.be.a.Function;
      trellis.port.should.be.a.Function;
      trellis.ready.should.be.a.Function;
    }); //end it
  
    it('#port should return the tessel port in use.', function() {
      trellis.port().should.equal(tessel_mock.port['B']);
    }); // end it

    describe('#button', function() {
      it('should return a TButton object with methods in API', function() {
        var button = trellis.button(0,0);
        button.should.have.properties([
          'on',
          'once',
          'value'
        ]);

        button.on.should.be.a.Function;
        button.once.should.be.a.Function;
        button.value.should.be.a.Function;
      });
      
      it('should throw an error when bad indices are given', function() {
        (function(){trellis.button(-1,-1)}).should.throw();
      });
    }); //end describe #button

    describe('#led', function() {
      it('should return a TLed object with methods in API', function() {
        var button = trellis.led(0,0);
        button.should.have.properties([
          'output'
        ]);

        button.output.should.be.a.Function;
      });
      it('should throw an error when bad indices are given', function() {
        (function(){trellis.led(-1,-1)}).should.throw();
      });
    }); //end describe #led

    describe('#node', function() {
      it('should return a TNode object with methods in API', function() {
        var node = trellis.node(0,0);
        node.should.have.keys([
          'button',
          'led'
        ]);

        node.button.should.be.a.Object;
        node.led.should.be.a.Object;
      });

      it('should emit an error when bad indices are given', function() {
        (function(){trellis.node(-1,-1)}).should.throw();
      });
    }); // end describe node

    describe('#brightness', function() {
      it('should send correct brightness commands over I2C', function() {
        spies.send.reset();
        trellis.brightness(0);
        spies.send.called.should.be.true;
        spies.send.getCall(0).args[0].compare(new Buffer([0xE0])).should.equal(0);
        trellis.brightness(5);
        spies.send.calledTwice.should.be.true;
        spies.send.getCall(1).args[0].compare(new Buffer([0xE5])).should.equal(0);
      });

      it('should force all brightness values to be valid', function() {
        spies.send.reset();
        trellis.brightness(-1);
        spies.send.called.should.be.true;
        spies.send.getCall(0).args[0].compare(new Buffer([0xEF])).should.equal(0);
        trellis.brightness(31);
        spies.send.calledTwice.should.be.true;
        spies.send.getCall(1).args[0].compare(new Buffer([0xEF])).should.equal(0);
      });
    }); //end describe #brightness

    describe('#blink', function() {
      it('should send correct commands over I2C', function() {
        spies.send.reset();
        trellis.blink(0);
        spies.send.callCount.should.equal(1);
        spies.send.getCall(0).args[0].compare(new Buffer([0x81])).should.equal(0);
        trellis.blink(1);
        spies.send.callCount.should.be.equal(2);
        spies.send.getCall(1).args[0].compare(new Buffer([0x83])).should.equal(0);
        trellis.blink(2);
        spies.send.callCount.should.be.equal(3)
        spies.send.getCall(2).args[0].compare(new Buffer([0x85])).should.equal(0);
        trellis.blink(3);
        spies.send.callCount.should.be.equal(4);
        spies.send.getCall(3).args[0].compare(new Buffer([0x87])).should.equal(0);
      });
      it('should force all blink values to be valid', function() {
        spies.send.reset();
        trellis.blink(-1);
        spies.send.callCount.should.equal(1);
        spies.send.getCall(0).args[0].compare(new Buffer([0x87])).should.equal(0); 

      });
    });
}); // end describe trellis;
