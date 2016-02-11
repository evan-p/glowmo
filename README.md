# glow

Use glow.js to animate property data and create simple to complex animations.

- Specify how to handle the animation-data using callbacks
- Create the animations using a simple language parsing system

### Example

```js
var blueBox = document.getElementById("blue-box1");

// this is your data handler
var fBlue = function(o){
	blueBox.style.setProperty('margin-top', o.y+'px');
	blueBox.style.setProperty('margin-left', o.x+'px');
};

var glow = new Glow({handler: fBlue});
glow.parse('from x=0,y=0 to x=300 in 0.4s wait 0.5s [to x=600 in 0.3s then to y=400 in 0.4s then to x=300 in 0.4s then to y=0 in 0.4s]*3 wait 0.3s to x=0 in 0.2s wait 0.5s');
```

You can use glow.stop(), glow.start(), glow.startLoop(), glow.toggle(), glow.toggleLoop() to control the animation(s). To jump to a specific point in the animation, use glow.makeTransition(p), where p:0-1

