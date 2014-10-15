(function(){
	
	fishGame.AD_TYPE_BANNER 		= "1";
	fishGame.AD_TYPE_INTERSTITIAL = "2";
	
	//目前芒果的横幅和插屏广告在触发事件上都有一定问题
	//为避免混淆，为这里为横幅和插屏分别定义事件类型
	//但实际上在底层，使用的是同一套类型
	
	//横幅被点击时触发
	fishGame.AD_BANNER_EVENT_OPEN = 1;
	//从广告界面跳转回游戏时触发(实际上它基本上没有被触发过)
	fishGame.AD_BANNER_EVENT_CLOSE= 2;
	
	//目前芒果广告貌似有每点3次就有一次没法触发的问题
	fishGame.AD_INTERSTITIAL_EVENT_SHOW = 1;
	//广告关闭时触发
	fishGame.AD_INTERSTITIAL_EVENT_CLOSE= 2;

	//广告条布局方式
	fishGame.AD_LAYOUT_TOP 			= "1"		//顶部		
	fishGame.AD_LAYOUT_BOTTOM 		= "2"		//底部
	
	var _instance = null;
	
	var handler = 0;
	
	var createID = function(){
		return ++handler;
	};
	
	var AdsMogo = cc.Class.extend({
		
		layout: fishGame.AD_LAYOUT_TOP,
		
		mogoId: null,
		
		plugin: null,
		
		bannerListeners: null,
		interstitialListeners: null,
                                  
		ctor: function(){
			this.mogoId = ADS_MOGO_ID;
			
			this.bannerListeners = {};
			this.interstitialListeners = {};

			if(typeof(plugin) !== "undefined" && typeof(plugin.PluginManager) !== "undefined"){
				this.plugin = plugin.PluginManager.getInstance().loadPlugin("AdsAdmogo");
                
                               
                                  
				if(this.plugin){
					this.plugin.configDeveloperInfo({
						id: this.mogoId
					});
					
                                  /**
                                   #define ADMOGO_BANNER_CLICK "ADMOGO_BANNER_CLICK"
                                   #define ADMOGO_BANNER_CLOSE "ADMOGO_BANNER_CLOSE"
                                   #define ADMOGO_INSTERSTITIAL_SHOW "ADMOGO_INSTERSTITIAL_SHOW"
                                   #define ADMOGO_INSTERSTITIAL_HIDE "ADMOGO_INSTERSTITIAL_HIDE"
                                   **/
					//this.plugin.setAdsListener(this);
                                  cc.eventManager.addCustomListener("ADMOGO_BANNER_CLICK", fishGame.utils.handler(this, this.onAdsResult));
                                  cc.eventManager.addCustomListener("ADMOGO_BANNER_CLOSE", fishGame.utils.handler(this, this.onAdsResult));
                                  cc.eventManager.addCustomListener("ADMOGO_INSTERSTITIAL_SHOW", fishGame.utils.handler(this, this.onAdsResult));
                                  cc.eventManager.addCustomListener("ADMOGO_INSTERSTITIAL_HIDE", fishGame.utils.handler(this, this.onAdsResult));
                }
			}
		},
		
		onAdsResult: function(event){
                                  var name = event.getEventName();
                                  var code = null;
                                  var listeners = null;
                                  
                                  switch(name){
                                  case "ADMOGO_BANNER_CLICK":
                                  code = fishGame.AD_BANNER_EVENT_OPEN;
                                  listeners = this.bannerListeners;
                                  break;

                                  case "ADMOGO_BANNER_CLOSE":
                                  code = fishGame.AD_BANNER_EVENT_CLOSE;
                                  listeners = this.bannerListeners;
                                  break;

                                  case "ADMOGO_INSTERSTITIAL_SHOW":
                                  code = fishGame.AD_INTERSTITIAL_EVENT_SHOW;
                                  listeners = this.interstitialListeners;
                                  break;

                                  case "ADMOGO_INSTERSTITIAL_HIDE":
                                  code = fishGame.AD_INTERSTITIAL_EVENT_CLOSE;
                                  listeners = this.interstitialListeners;
                                  break;
                                  }
                                  for(var id in listeners){
                                  listeners[id].call(null, code);
                                  }
		},
		
		setLayout: function(layout){
			this.layout = layout;
		},
		
		getLayout: function(){
			return this.layout;
		},
		
		showBanner: function(){
			if(this.plugin){
				this.plugin.showAds({
					layout: this.layout,
					type: fishGame.AD_TYPE_BANNER
				});
			}
		},
		
		hideBanner: function(){
			if(this.plugin){
				this.plugin.hideAds({type: fishGame.AD_TYPE_BANNER});
			}
		},
		
		showInterstitial: function(){
			if(this.plugin){
				this.plugin.showAds({
					type: fishGame.AD_TYPE_INTERSTITIAL
				});
			}
		},
		
		hideInterstitial: function(){
			if(this.plugin){
				this.plugin.hideAds({
					type: fishGame.AD_TYPE_INTERSTITIAL
				});
			}
		},
		
		loadInterstitial: function(){
			if(this.plugin){
				this.plugin.showAds({
					load: "1"
				});
			}
		},
		
		registerBannerHandler: function(handler){
			var id = createID();
			
			this.bannerListeners[id] = handler;
			
			return id;
		},
		
		registerInterstitialHandler: function(handler){
			var id = createID();

			this.interstitialListeners[id] = handler;

			return id;
		},
		
		unregisterBannerHandler: function(id){
			delete this.bannerListeners[id];
		},
		
		unregisterInterstitialHandler: function(id){
			delete this.interstitialListeners[id];
		}
	});
	
	fishGame.AdsMogo = {};
	
	fishGame.AdsMogo.getInstance = function(){
		if(!_instance){
			_instance = new AdsMogo();
		}
		return _instance;
	};
	
})();