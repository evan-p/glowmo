# Glowmo

Use glowmo.js to animate property data and create simple to complex animations.

- Specify how to handle the animated properties using callbacks
- Create the animations using a simple syntax parsing system

### Example

```js
var box = document.querySelector(".box");

// this is your handler
var fHandler = function(o){
	box.style.transform = `translateX(${o.x}px) rotate(${o.deg}deg)`
};

var glow = new Glowmo({handler: fHandler});
glow.parse('from x=0 to x=300 in 0.7s with easeInQuad [from deg=0 to deg = 90 in 0.3s with easeInExpo]*3 wait 1s to x=0 in 1s with easeOutBounce').loop();
```
The above parse command is equivalent to:
```js
glow.from({x:0}).to({x:300}).in(0.7).with('easeInQuad').startLoop().from({deg:0}).to({deg:90}).in(0.3).with('easeInExpo').endLoop().times(3).wait(1).to({x:0}).in(1).with('easeOutBounce').create().loop();
```

Here's a link to this [example](http://static.jzinx.com/glowmo/examples/example1.html). You can use stop(), start(), reverse, loop(), toggle(), toggleLoop() and seek(p) to control the animation(s).

### Constructor commands

- from & to : specify the variables of starting and ending position of a transition. These variables will be set as keys to the object of the handler function. 'from' is optional if not the first transition
- in : specify the number of seconds the transition will last, followed by an 's'. Required for every transition
- with : optionally specify an easing function for the transition. See [supported easing functions](https://github.com/danro/jquery-easing/blob/master/jquery.easing.js).
- then : use 'then' right before a transition the precedes another one
- wait : specify the number of seconds that no change is made, in seconds, followed by an 's'
- [  \] : use brackets to create loops. Loops can contain other loops
- * : place right after loops to specify the number of iterations
- circle : placed right after loops or '*', indicates that each second iteration will transit from end to start
