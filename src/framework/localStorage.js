(function(){
	var l = fishGame.LocalStorage = {};
	
	l.getItem = function(key){
		return cc.sys.localStorage.getItem(key);
	};
	
	l.setItem = function(key,value){
		cc.sys.localStorage.setItem(key, value);
	};
	
	l.removeItem = function(key){
		cc.sys.localStorage.removeItem(key);
	};
})();