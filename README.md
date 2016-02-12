# Glowmo

Use glowmo.js to animate property data and create simple to complex animations.

- Specify how to handle the animated properties using callbacks
- Create the animations using a simple syntax parsing system

### Example

```js
var blueBox = document.getElementById("blue-box1");

// this is your data handler
var fBlue = function(o){
	blueBox.style.setProperty('margin-left', o.x+'px');
	blueBox.style.transform = `rotate(${o.deg}deg)`
};

var glow = new Glow({handler: fBlue});
glow.parse('from x=0,deg=0 to x=200 in 0.4s wait 0.5s [to x=400 in 0.5s then to deg=90 in 0.4s then to x=300 in 0.5s then to deg=180 in 0.5s]*3 circle wait 0.3s to x=0 in 0.5s wait 0.5s');
glow.loop();
```

Here's a link to this [example](http://static.jzinx.com/glowmo/examples/glowExample1.html). You can use stop(), start(), loop(), toggle(), toggleLoop() and seek(p) to control the animation(s).

### Constructor commands

- from & to : specify the variables of starting and ending position of a transition. These variables will be set as keys to the object of the handler function. 'from' is optional if not the first transition
- in : specify the number of seconds the transition will last, followed by an 's'. Required for every transition
- then : use 'then' right before a transition the precedes another one
- wait : specify the number of seconds that no change is made, in seconds, followed by an 's'
- [  \] : use brackets to create loops. Loops can contain other loops
- * : place right after loops to specify the number of iterations
- circle : placed right after loops or '*', indicates that each second iteration will transit from end to start

