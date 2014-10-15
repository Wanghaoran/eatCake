(function(){
	var d = fishGame.display = {};
	
	var FIXED_WIDTH = "FIXED_WIDTH";
	var FIXED_HEIGHT= "FIXED_HEIGHT";
	
	var mobileBrowserInit = function(){
		var winSize = fishGame.utils.getDirector().getWinSize();

		d.contentScaleFactor = 1;
		d.size.width = winSize.width;
		d.size.height= winSize.height;
		d.width = d.size.width;
		d.height= d.size.height;
		d.cx = d.width/2;
		d.cy = d.height/2;
		d.c_left = -d.width/2;
		d.c_right= d.width/2;
		d.c_top = d.height/2;
		d.c_bottom = -d.height/2;
		d.left = 0;
		d.right = d.width;
		d.top = d.height;
		d.bottom = 0;
		d.widthInPixels = d.sizeInPixels.width;
		d.heightInPixels = d.sizeInPixels.height;
	};
	
	var init = function(){
		var director = fishGame.utils.getDirector();
		
		
		var glView = cc.view;

		var size = glView.getFrameSize();

		d.sizeInPixels.width = size.width;
		d.sizeInPixels.height= size.height;

		var w = d.sizeInPixels.width, h = d.sizeInPixels.height;

		if(!CONFIG_SCREEN_WIDTH || !CONFIG_SCREEN_HEIGHT){
			CONFIG_SCREEN_WIDTH = w;
			CONFIG_SCREEN_HEIGHT = h;
		}

		if(!CONFIG_SCREEN_AUTOSCALE){
			if(w > h){
				CONFIG_SCREEN_AUTOSCALE = FIXED_WIDTH;	
			}else{
				CONFIG_SCREEN_AUTOSCALE = FIXED_HEIGHT;
			}
		}

		var scale, scaleX, scaleY;
		if(CONFIG_SCREEN_AUTOSCALE){
			if(typeof(CONFIG_SCREEN_AUTOSCALE) == "function"){
				var size = CONFIG_SCREEN_AUTOSCALE_CALLBACK(w, h);
				scaleX = size.width;
				scaleY = size.height;
			}

			if(!scaleX || !scaleY){
				scaleX = w / CONFIG_SCREEN_WIDTH;
				scaleY = h / CONFIG_SCREEN_HEIGHT;	
			}

			switch(CONFIG_SCREEN_AUTOSCALE){
			case FIXED_WIDTH:
				scale = scaleX;
				CONFIG_SCREEN_HEIGHT = h / scale;
				break;
			case FIXED_HEIGHT:
				scale = scaleY;
				CONFIG_SCREEN_WIDTH = w / scale;
				break;
			default:	
				scale = 1;
			break;
			}
			glView.setDesignResolutionSize(CONFIG_SCREEN_WIDTH, CONFIG_SCREEN_HEIGHT, cc.ResolutionPolicy.NO_BORDER);
		}
	
		var winSize = director.getWinSize();
		
		d.contentScaleFactor = scale;
		d.size.width = winSize.width;
		d.size.height= winSize.height;
		d.width = d.size.width;
		d.height= d.size.height;
		d.cx = d.width/2;
		d.cy = d.height/2;
		d.c_left = -d.width/2;
		d.c_right= d.width/2;
		d.c_top = d.height/2;
		d.c_bottom = -d.height/2;
		d.left = 0;
		d.right = d.width;
		d.top = d.height;
		d.bottom = 0;
		d.widthInPixels = d.sizeInPixels.width;
		d.heightInPixels = d.sizeInPixels.height;
	};
	
	d.contentScaleFactor = 1;
	d.size = {width: 0, height: 0};
	d.sizeInPixels = {width: 0, height: 0};
	d.width = 0;
	d.height = 0;
	d.cx = 0;
	d.cy = 0;
	d.c_left = 0;
	d.c_right= 0;
	d.c_top = 0;
	d.c_bottom = 0;
	d.left = 0;
	d.right= 0;
	d.top = 0;
	d.bottom = 0;
	d.widthInPixels = 0;
	d.heightInPixels = 0;
	
	d.ANCHOR_CENTER = cc.p(0.5, 0.5);
	d.ANCHOR_TOP_LEFT = cc.p(0,1);
	d.ANCHOR_CENTER_TOP = cc.p(0.5, 1);
	d.ANCHOR_RIGHT_TOP = cc.p(1,1);
	d.ANCHOR_CENTER_LEFT = cc.p(0, 0.5);
	d.ANCHOR_CENTER_RIGHT = cc.p(1,0.5);
	d.ANCHOR_BOTTOM_LEFT = cc.p(0, 0);
	d.ANCHOR_BOTTOM_RIGHT = cc.p(1,0);
	d.ANCHOR_BOTTOM_CENTER = cc.p(0.5, 0);
	
	d.init = function(){
		//d.init = null;
		init();
	};
	
	/*if(fishGame.device.isNative || cc.sys._renderType === cc._RENDER_TYPE_WEBGL)
		init();
	else{
		mobileBrowserInit();
	}*/
})();