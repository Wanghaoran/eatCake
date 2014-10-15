(function(){
	var d = fishGame.device = {};	
	var CACHE = "FISH_GAME_CACHE";
	
	d.platform = cc.sys.OS_UNKNOWN;
	d.language = cc.sys.LANGUAGE_ENGLISH;
	d.writablePath = "";
	d.cachePath = "";
	d.isNative = cc.sys.isNative;
	
	var init = function(){
		d.platform = cc.sys.os;
		d.language = cc.sys.language;
		
		d.directorySeparator = "/";
		d.pathSeparator = ":";
		
		if(d.isNative){
			
			if(d.platform == cc.sys.OS_WINDOWS){
				d.directorySeparator = "\\";
				d.pathSeparator = ":";
			}

			d.writablePath = cc.FileUtils.getInstance().getWritablePath();
			d.cachePath = d.writablePath + d.directorSeparator + CACHE;
		}else{
			d.writablePath = "";
			d.cachePath = "";
		}
	};
	
	init();
})();