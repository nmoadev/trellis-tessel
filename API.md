# trellis-tessel API
## Setup
#### `Trellis.createInstance(port)`  
Create a `trellis` object on the Tessel port passed in. Will throw an exception if a trellis object is already registered for that port.

**Parameters**:

* `port` String; Acceptable ports on the Tessel 1 are `'A'`, `'B'`, `'C'`, or `'D'`

**Return**: a `trellis` object


#### `trellis.interrupts(enable, mode)`  
Enable/disable interrupts and set the mode.

* One trellis object will use **at most one of the seven interrupts on the Tessel 1.**
* Only _Edge Triggers_, or _Level Triggers_ can be used at one time. That is, `mode='edge'` is mutually exclusive of `mode='level'`.
* Interrupts are **disabled** by default.
* *Edge Triggers* are selected by default.
* Changing the interrupt mode will not remove existing event handlers, but attempting to add event handlers which do not match the current interrupt mode will throw an exception.
* See [External GPIO Pin Interrupts API](https://github.com/tessel/docs/blob/master/tutorials/gpio-interrupts.md) to get the details.

**Parameters**:

* `enable` Boolean; disable/enable interrupts
* `mode` String; `'level'` to use *Level Triggers *or `'edge'` to use *Edge Triggers*


## Accessors
#### `trelllis.port()`
get the Tessel port on which the Trellis module is connected.
#### `trellis.led[i][j]`
get the TLed object at location `(i,j)`
#### `trellis.button[i][j]`
get the TButton object at location `(i,j)`
#### `trellis.node[i][j]`
get the TNode (a button, led combo) at location `(i,j)`

## TNode
#### `tnode.button`

Get the button at this node.
#### `tnode.led` 

Get the led at this node.

## TButton
### Polling vs Interrupts
The trellis-tessel API supports both an interrupt-based and polling-based approach to getting user input from the push buttons.

### Interrupt-Based Event Handlers
These callbacks depend on the use of interrupts. See Setup for more details.

#### `button.on('press', callback)`
Requires *EdgeTriggers* to be enabled.
Callback will be executed when the button state transitions from released to pressed.

#### `button.on('release', callback)`
Requires *Edge Triggers* to be enabled.
Callback will be executed when the button state transitions from pressed to released.

#### `button.once('press', callback)`
Requires *EdgeTriggers* to be enabled.
Callback will be executed **at most once** when the button state transitions from released to pressed.

#### `button.once('release', callback)`
Requires *Edge Triggers* to be enabled.
Callback will be executed **at most once** when the button state transitions from pressed to released.

#### `button.once('pressed', callback)`
Requires *Level Triggers* to be enabled.
Callback will be executed **at most once** when the button has stabilized at the pressed state.

#### `button.once('released', callback)`
Requires *Level Triggers* to be enabled.
Callback will be executed **at most once** when the button has stabilized at the released state.

### Polling Based Event Handlers

#### `button.poll(interval, callback, value)`
Does _not_ require interrupts to be enabled.
Checks the value of the button every `interval` milliseconds, executing `callback` if `button.value() === value`

### Button Accessors

#### `button.value()`
Get the current value of the button.

## TLed

#### `led.output(value)`
Set the state of the LED. If `value` is non-zero the LED will be turned on.
#### `led.toggle()`
Toggle the state of the LED.


