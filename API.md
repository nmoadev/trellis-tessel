# trellis-tessel API
#### `Trellis(port, interrupt_enable)`  
Create a `trellis` object on the Tessel port passed in.

* One trellis object will use at most one of the seven interrupts on the Tessel 1.
* Only _Edge Triggers_ are currently implemented.
* Interrupts are **disabled** by default.
* See [External GPIO Pin Interrupts API](https://github.com/tessel/docs/blob/master/tutorials/gpio-interrupts.md) for more information.


##### Parameters

* `port` Tessel port to be used
* `interrupt_enable` Boolean; disable/enable interrupts

##### Return:

a `trellis` object

##### Example:

```javascript
var tessel = require('tessel'),
	Trellis = require('trellis'),
	myTrellis;

myTrellis = Trellis(tessel.port['B']);
```

### Methods
#### `trellis.ready(callback)`
**IMPORTANT!** You must make sure that you call this function and that is has completed before trying to use any other parts of the API. This function makes sure the trellis device is correctly configured to receive commands.

##### Example
This code will turn on the LED at 0,0 when the module is ready.
```javascript
myTrellis.ready(function(err) {
	if (!err) {
		myTrellis.led(0,0).output(1);
	}
});
```

#### `trelllis.port()`
get the Tessel port on which the Trellis module is connected.
#### `trellis.led[i][j]`
get the TLed object at location `(i,j)`
#### `trellis.button[i][j]`
get the TButton object at location `(i,j)`
#### `trellis.node[i][j]`
get the TNode (a button, led combo) at location `(i,j)`
### `trellis.fillDisplay()`
Turn on every LED
### `trellis.clearDisplay()`
Turn off every LED
### `trellis.brightness(level)`
Sets the brightness of the panel. Levels are 0 (dimmest, but on) to 15 (brightest)
### `trellis.blink(rate)`
Sets the blink rate of the panel. Rates are
* 0 (no blink)
* 1 (2Hz blink)
* 2 (1Hz blink)
* 3 (.5Hz blink)

## TNode
#### `tnode.button`

Get the button at this node.
#### `tnode.led` 

Get the led at this node.

## TButton

### Events
A `TButton` is an extended [EventEmitter](https://nodejs.org/api/events.html). The following events are available:

* `press` - the button state has transitioned from released to pressed
* `release` - the button sate has transitioned from pressed to released

### Methods

#### `button.value()`
Get the current value of the button.

## TLed

## Methods
#### `led.output(value)`
Set the state of the LED. If `value` is non-zero the LED will be turned on.



