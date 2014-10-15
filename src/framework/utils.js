(function(){
	var u = fishGame.utils = {};
	
	u.random = function(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	};
	
	u.handler = function(self,callback){
		return function(){
			if(arguments.length > 0){
				return callback.apply(self, Array.prototype.slice.call(arguments, 0));
			}
			return callback.call(self);
		};
	};
	u.getDirector = function(){
		if(fishGame.device.isNative)return cc.director;
		
		return cc.Director._getInstance();
	};
	u.createSpriteWithSpriteFrameName = function(name){
		if(fishGame.device.isNative){
			return cc.Sprite.createWithSpriteFrameName(name);
		}
		
		var sprite = cc.Sprite.create();
		
		sprite.initWithSpriteFrameName(name);
		
		return sprite;
	};
	
	u.arraySearchObject = function(array, object){
		if(!array || !array.length)return -1;

		for(var i=0, length=array.length; i<length; ++i){
			if(array[i] === object){
				return i;
			}
		}

		return -1;
	};

	u.arrayRemoveObject = function(array, object){
		if(!array || !array.length)return false;

		for(var i=0, length=array.length; i<length; ++i){
			if(array[i] === object){
				array.splice(i, 1);
				return true;
			}
		}

		return false;
	};

	u.invokeCallback = function(callback){
		if(!callback)return;
		
		if(arguments.length > 1){
			callback.apply(null, Array.prototype.slice.call(arguments, 1));
		}else{
			callback.call(null);
		}
	};

	//获得object元素个数
	u.sizeof = function(object){
		if(!object)return 0;

		var size = 0;

		for(var key in object){
			if(object.hasOwnProperty(key) && typeof(object[key]) !== "function"){
				++size;
			}
		}

		return size;
	};

	var counter = 0;
	var last = 0;

	u.createGenId = function(){
		var now = new Date().getTime();

		if(now - last >= 1000){
			last = now;
			counter = 0;
		}

		return now + "_" + (++counter);
	};
	
	u.print = function(){
		cc.log(Array.prototype.join.call(arguments, " "));
	};
})();

var print = fishGame.utils.print;