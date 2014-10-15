(function(){
	var s = fishGame.Scheduler = {};
	
	s.REPEAT_FOREVER = cc.REPEAT_FOREVER;
	
	s.DEFAULT_INTERVAL = 1;
	
	/**
	 * target 		更新对象,它必须有一个函数叫update
	 * priority 	优先级,参考CCScheduler,默认0
	 * pause 		是否暂停，默认false
	 */
	s.scheduleUpdate = function(target, priority, pause){
		cc.director.getScheduler().scheduleUpdateForTarget(target, priority||0, pause||false);
	};
	
	/**
	 * target
	 * callback
	 * interval		执行频率 												默认 DEFAULT_INTERVAL 秒
	 * repeat		重复次数（注意，实际执行次数将是repeat+1）					默认 REPEAT_FOREVENR 
	 * delay		第一次回调前等待多长时间									默认0
	 * pause		是否暂停												默认false
	 */
	s.scheduleCallbackWithDelay = function(target, callback, interval, repeat, delay, pause){
		cc.director.getScheduler().scheduleCallbackForTarget(target, callback, interval||s.DEFAULT_INTERVAL, repeat||s.REPEAT_FOREVER, delay||0, pause||false);
	};
	
	s.unscheduleUpdate = function(target){
		cc.director.getScheduler().unscheduleUpdateForTarget(target);
	};
	
	s.unscheduleCallback = function(target, callback){
		cc.director.getScheduler().unscheduleCallbackForTarget(target, callback);
	}
})();