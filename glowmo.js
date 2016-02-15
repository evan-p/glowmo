var Glowmo = function(){
var Glowmo = function(options){
	var _this = this;
	var jobs = [];

	var update = function(){
		var now = Date.now();
		jobs.forEach(function(job){
			var timePassed = now - job.startTime;
			var p = timePassed/(job.glow.duration*1000);
			if(job.loop){
				p = p % 1 || (p!=0) + 0;
			}
			if(p>1){
				p = 1;
				job.glow.stop();
				console.log('stoped')
			}
			// reverse
			if(job.reverse){
				p = 1 - p;
			}
			job.glow.seek(p);
			
		});
		window.requestAnimationFrame(update);
	};

	this.addJob = function(glow, options){
		var now = Date.now();
		var o = {glow:glow};
		o.loop = options && options.loop ? options.loop : null;
		o.reverse = options && options.reverse ? options.reverse : null;
		o.startTime = !o.reverse ? now - glow.getLastP()*glow.duration*1000 : now - (1-glow.getLastP())*glow.duration*1000; // TODO
		jobs.push(o);
	};

	this.removeJob = function(glow){
		jobs = jobs.filter(function(job){
			return job.glow != glow;
		});
	}

	window.requestAnimationFrame(update);
}

var glowmo = new Glowmo();

//thanks to danro/jquery-easing
var easingFunctions = {
	easeInQuad: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function ( t, b, c, d) {
		b=0;
		d=c=1;
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function ( t, b, c, d) {
		b=0;
		d=c=1;
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function ( t, b, c, d) {
		b=0;
		d=c=1;
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function ( t, b, c, d) {
		b=0;
		d=c=1;
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function ( t, b, c, d) {
		b=0;
		d=c=1;
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function ( t, b, c, d) {
		b=0;
		d=c=1;
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function ( t, b, c, d) {
		b=0;
		d=c=1;
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function ( t, b, c, d) {
		b=0;
		d=c=1;
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function ( t, b, c, d) {
		b=0;
		d=c=1;
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function ( t, b, c, d) {
		b=0;
		d=c=1;
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function ( t, b, c, d, s) {
		b=0;
		d=c=1;
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function ( t, b, c, d, s) {
		b=0;
		d=c=1;
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function ( t, b, c, d, s) {
		b=0;
		d=c=1;
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeOutBounce: function ( t, b, c, d) {
		b=0;
		d=c=1;
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	}
};

var Transition = function(options){
	var from = options.from;
	var to = options.to;
	var transition = options.transition;
	var callback = options.callback;
	var easeFunction = function(p){return p};
	this.duration = options.duration;
	this.parent = options.parent;
	this.level = options.level ? options.level : 0;
	var _this = this;

	this.setEase = function(f){
		easeFunction = f;
	};

	this.setFrom = function(o){
		from = o;
	};

	this.setTo = function(o){
		to = o;
	};

	this.setCallback = function(o){
		callback = o;
	};

	this.finalize = function(options){
		if(from == null){
			from = options.previousTo;
		}else if(options && options.previousTo){
			Object.keys(options.previousTo).forEach(function(key){
				if(from[key]==null){
					from[key] = options.previousTo[key];
				}
			});
		}
		Object.keys(from).forEach(function(key){
				if(to[key]==null){
					to[key] = from[key];
				}
			});
		return ({
			duration: _this.duration,
			finalTo: to
		});
	};

	this.validate = function(){
		if(typeof(callback)!='function'){
			throw('error creating transition: invalid or non-exintent callback "Do"');
		}
		Object.keys(from).forEach(function(key){
			if(typeof(from[key])!='number'){
				throw('error creating transition: invalid "from" field');
			}
			if(typeof(to[key])!='number'){
				throw('error creating transition: invalid or non-exintent "to" field');
			}
		});
		Object.keys(to).forEach(function(key){
			if(typeof(to[key])!='number'){
				throw('error creating transition: invalid "to" field');
			}
			if(typeof(from[key])!='number'){
				throw('error creating transition: invalid or non-exintent "from" field');
			}
		});
	};

	this.makeTransition = function(p, escape){ // p:0-1
		if(p>1){
			p=1;
		}else if(p<0){
			p=0;
		}
		p = easeFunction(p);
		var obj = {};
		Object.keys(from).forEach(function(key){
			obj[key] = from[key]*(1-p) + to[key]*(p);
		});
		if(!escape && callback){
			callback(obj);
		}
		return obj;
	};

	this.type = 'transition';
}

var Timeline = function(options){
	var schedule = options.schedule ? options.schedule : [];
	var inCircle = options.inCircle ? options.inCircle : false;
	var times = options.times ? options.times : 1;
	this.parent = options.parent;
	this.level = options.level ? options.level : 0;
	var _this = this;

	this.isEmpty = function(){
		return schedule.length == 0;
	}

	this.finalize = function(options){
		var previousTo = options.previousTo;
		var totalDuration = 0;
		var durations = [];
		schedule.forEach(function(o){
			var stats = o.scheduled.finalize({
				previousTo: previousTo
			});
			totalDuration += stats.duration;
			previousTo = stats.finalTo;
			durations.push(stats.duration);
		});
		var cumSum = 0;
		durations.forEach(function(d, i){
			var scheduled = schedule[i];
			var nDuration = d/totalDuration;
			scheduled.from = cumSum;
			cumSum += nDuration;
			scheduled.to = cumSum;
		});
		return {
			duration: totalDuration * times,
			finalTo: _this.makeTransition(1, true)
		};
	};

	this.setTimes = function(t){
		times = t;
	};

	this.setInCircle = function(){
		inCircle = true;
	};

	this.addTimeline = function(){
		var obj = {};
		obj.scheduled = new Timeline({parent:_this, level:_this.level+1});
		schedule.push(obj);
		return obj.scheduled;
	};

	this.addTransition = function(options){
		var obj = {};
		obj.scheduled = new Transition({parent:_this, callback:options.callback, level:_this.level+1});
		schedule.push(obj);
		return obj.scheduled;
	};

	this.addWait = function(options){
		var obj = {};
		obj.scheduled = new Wait({callback:options.callback,duration:options.duration, parent:_this, level:_this.level+1});
		schedule.push(obj);
		return obj.scheduled;
	};

	this.validate = function(){
		if(schedule == null || schedule.constructor!=Array){
			throw('error validating timeline: schedule is not an Array');
		}
		schedule.forEach(function(o){
			if(typeof(o.from)!='number'){
				throw('error validating timeline: schedule element invalid');
			}
			if(typeof(o.to)!='number'){
				throw('error validating timeline: schedule element invalid');
			}
		});
	};

	this.makeTransition = function(p, escape){
		// handle repeats
		p = p * times;
		// handle loop type
		if(inCircle){
			p = Math.abs(Math.floor(p%2) - p%1);
		}else{
			p = p % 1 || (p!=0) + 0;
		}
		// get schedule
		var scheduledObj = schedule.find(function(o){
			return o.from <= p && p<= o.to;
		});
		if(scheduledObj==null){
			scheduledObj = schedule[schedule.length - 1]
		}
		// get percentage of schedule
		p = (p - scheduledObj.from)/(scheduledObj.to - scheduledObj.from);
		return scheduledObj.scheduled.makeTransition(p, escape)
	}

	this.type = 'timeline';

}

var Wait = function(options){
	var to;
	var duration = options.duration;
	var callback = options.callback;
	this.parent = options.parent;
	this.level = options.level ? options.level : 0;

	this.finalize = function(options){
		to = options.previousTo;
		return ({
			finalTo: to,
			duration: duration
		});
	};

	this.makeTransition = function(p){
		if(callback){
			callback(to)
		}
		return to;
	};

	this.type = 'wait';
};

var Glow = function(options){
	this.duration;
	var lastP = 0;
	var paused = true;
	var callback = options && options.handler ? options.handler : null;
	var MainTimeline = new Timeline({level:0});
	MainTimeline.parent = MainTimeline;
	var current = MainTimeline;
	var state = 'paused';
	var startFrom;
	var _this = this;
	var notify = function(){
		console.log('current type: ', current.type, ' , level ', current.level);
	};

	this.getLastP = function(){
		return lastP;
	}

	var configureTransition = function(){
		if(current.type=='wait'){
			current = current.parent;
			current = current.addTransition({callback:callback});
		}else if(current.type=='timeline'){
			if (!current.isEmpty()) {
				current = current.parent;
			}
			current = current.addTransition({callback:callback});
		}
	};

	this.from = function(o){
		if(startFrom==null){
			startFrom = o
		}
		Object.keys(o).forEach(function(key){
			if(startFrom[key]==null){
				startFrom[key] = o[key];
			}
		});
		configureTransition();
		current.setFrom(o);
		notify();
		return this;
	};

	this.to = function(o){
		configureTransition();
		current.setTo(o);
		notify();
		return this;
	};

	this.in = function(d){
		configureTransition();
		current.duration = d;
		notify();
		return this;
	}

	this.with = function(f){
		configureTransition();
		current.setEase(f);
		notify();
		return this;
	}

	this.do = function(callback){
		configureTransition();
		current.setCallback(callback);
		notify();
		return this;
	};

	this.wait = function(d){
		if(current.type=='transition'){
			current = current.parent;
		}else if(current.type=='wait'){
			current = current.parent;
		}else if(current.type=='timeline'){
			if (!current.isEmpty()) {
				current = current.parent;
			}
		}
		current = current.addWait({callback:callback, duration:d});
		notify();
		return this;
	};

	this.then = function(){
		if(current.type=='timeline'){
			throw('invalid then() placement');
		}
		current = current.parent;
		current = current.addTransition({callback:callback});
		notify();
		return this;
	};

	this.startLoop = function(){
		if(current.type!='timeline'){
			current = current.parent;
		}
		current = current.addTimeline();
		notify();
		return this;
	};

	this.endLoop = function(){
		current = current.parent;
		notify();
		return this;
	};

	this.times = function(t){
		if(current.type!='timeline'){
			throw('invalid times() placement');
		}
		current.setTimes(t)
		notify();
		return this;
	};

	this.inCircle = function(){
		if(current.type!='timeline'){
			throw('invalid inCircle() placement');
		}
		current.setInCircle();
		notify();
		return this;
	};

	this.create = function(){
		var o = MainTimeline.finalize({previousTo:startFrom});
		_this.duration = o.duration;
		_this.seek(0);
		return this;
	};

	this.seek = function(p){
		lastP = p;
		return MainTimeline.makeTransition(p);
	};

	this.start = function(){
		if(state == 'start'){
			return;
		}else if(state != 'paused'){
			_this.stop();
		}
		state = 'start'
		glowmo.addJob(_this)
	}

	this.reverse = function(){
		if(state == 'reverse'){
			return;
		}else if(state != 'paused'){
			_this.stop();
		}
		state = 'reverse';
		glowmo.addJob(_this, {reverse:true})
	}

	this.loop = function(){
		if(state == 'loop'){
			return;
		}else if(state != 'paused'){
			_this.stop();
		}
		state = 'loop';
		glowmo.addJob(_this,{loop:true})
	}

	this.stop = function(){
		if(state == 'paused'){
			return;
		}
		state = 'paused';
		glowmo.removeJob(_this)
	}

	this.toggle = function(){
		if(state=='paused'){
			_this.start()
		}else{
			_this.stop()
		}
	}

	this.toggleLoop = function(){
		if(state=='paused'){
			_this.loop()
		}else{
			_this.stop()
		}
	}

	this.parse = function(query){
		var objRegex = /^(?:\s*\w+\s*=\s*-?\s*\d+(?:\.\d+)?\s*,*)+/;
		var numRegex = /^\s*\d+(?:.\d+)*/;
		var secRegex = /^\s*\d+(?:.\d+)*s/;
		var easingRegex = new RegExp(`^\\s*(${Object.keys(easingFunctions).join('|')})`);

		var parseNextEasing = function(){
			var match = query.match(easingRegex); 
			query = query.substring(match[0].length);
			return easingFunctions[match[1]];
		}

		var parseNextObject = function(str){
			var objMatch = query.match(objRegex);
			if(objMatch==null){
				throw('error on parsing "from" object')
			}
			var str = objMatch[0];
			query = query.substring(str.length);
			str = str.replace(/\s/g,''); // remove spaces
				var obj = {};
				var pairs = str.split(',');
				pairs.forEach(function(pair){
					var key;
					var value;
					var splited = pair.split('=');
					key = splited[0];
					value = parseFloat(splited[1]);
					obj[key] = value;
				});
				return obj;
		}

		var parseNextNumber = function(){
			var match = query.match(numRegex);
			match = match.join('');
			query = query.substring(match.length);
			return parseFloat(match);
		}

		var parseNextSec = function(){
			var match = query.match(secRegex);
			match = match.join('');
			query = query.substring(match.length);
			return parseFloat(match);
		}

		var parseNext = function(){
			var match = query.match(/^\s*from/)
			if(match!=null){
				query = query.substring(match[0].length);
				
				var obj = parseNextObject();
				console.log('parse from: ', obj)
				_this.from(obj);
				return true
			}

			match = query.match(/^\s*to/)
			if(match!=null){
				query = query.substring(match[0].length);
				var obj = parseNextObject();
				console.log('parse to: ', obj)
				_this.to(obj);
				return true
			}

			match = query.match(/^\s*\*/)
			if(match!=null){
				query = query.substring(match[0].length);
				var num = parseNextNumber();
				console.log('parse times: ', num)
				_this.times(num)
				return true
			}

			match = query.match(/^\s*\[/)
			if(match!=null){
				query = query.substring(match[0].length);
				console.log('parse startLoop')
				_this.startLoop();
				return true
			}

			match = query.match(/^\s*\]/)
			if(match!=null){
				query = query.substring(match[0].length);
				console.log('parse endLoop')
				_this.endLoop();
				return true
			}

			match = query.match(/^\s*in/)
			if(match!=null){
				query = query.substring(match[0].length);
				var num = parseNextSec();
				console.log('parse in: ', num)
				_this.in(num);
				return true
			}

			match = query.match(/^\s*wait/)
			if(match!=null){
				query = query.substring(match[0].length);
				var num = parseNextSec();
				console.log('parse wait: ', num)
				_this.wait(num);
				return true
			}

			match = query.match(/^\s*then/)
			if(match!=null){
				query = query.substring(match[0].length);
				console.log('parse then')
				_this.then();
				return true
			}

			match = query.match(/^\s*circle/)
			if(match!=null){
				query = query.substring(match[0].length);
				console.log('parse Circle')
				_this.inCircle();
				return true
			}

			match = query.match(/^\s*with/)
			if(match!=null){
				query = query.substring(match[0].length);
				var easeFunction = parseNextEasing();
				console.log('parse with')
				_this.with(easeFunction);
				return true
			}

			return false;

		}

		while(parseNext()){};
		_this.create();
		return(_this);
	}

}

return Glow}()
