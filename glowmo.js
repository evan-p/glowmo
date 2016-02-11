var Glowmo = function(){
var Glowmo = function(options){
	var _this = this;
	var jobs = [];

	var update = function(){
		var now = Date.now();
		jobs.forEach(function(job){
			var timePassed = now - job.startTime;
			var p = timePassed/(job.glow.duration*1000);
			if(job.loop == 'loop'){
				p = p % 1 || (p!=0) + 0;
			}
			if(p>1){
				job.glow.makeTransition(1);
				job.glow.stop();
				console.log('stoped')
			}else{
				job.glow.makeTransition(p);
			}
		});
		window.requestAnimationFrame(update);
	};

	this.addJob = function(glow, options){
		var o = {glow:glow, startTime: Date.now() - glow.getLastP()*glow.duration*1000};
		o.loop = options && options.loop ? options.loop : null;
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

var Transition = function(options){
	var from = options.from;
	var to = options.to;
	var transition = options.transition;
	var callback = options.callback;
	this.duration = options.duration;
	this.parent = options.parent;
	this.level = options.level ? options.level : 0;
	var _this = this;

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

	this.loop = function(){
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
		_this.makeTransition(0);
		return this;
	};

	this.makeTransition = function(p){
		lastP = p;
		return MainTimeline.makeTransition(p);
	};

	this.start = function(){
		paused = false;
		glowmo.addJob(_this)
	}

	this.startLoop = function(){
		paused = false;
		glowmo.addJob(_this,{loop:'loop'})
	}

	this.stop = function(){
		paused = true;
		glowmo.removeJob(_this)
	}

	this.toggle = function(){
		if(paused){
			_this.start()
		}else{
			_this.stop()
		}
	}

	this.toggleLoop = function(){
		if(paused){
			_this.startLoop()
		}else{
			_this.stop()
		}
	}

	this.parse = function(query){
		var objRegex = /^(?:\s*\w+\s*=\s*-?\s*\d+(?:\.\d+)?\s*,*)+/;
		var numRegex = /^\s*\d+(?:.\d+)*/;
		var secRegex = /^\s*\d+(?:.\d+)*s/;

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
				console.log('parse loop')
				_this.loop();
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

			match = query.match(/^\s*in circle/)
			if(match!=null){
				query = query.substring(match[0].length);
				console.log('parse inCircle')
				_this.inCircle();
				return true
			}

			return false;

		}

		while(parseNext()){};
		_this.create();
	}

}

return Glow}()
