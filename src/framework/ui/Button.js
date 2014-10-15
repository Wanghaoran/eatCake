(function(){
	var STATE_NORMAL = 0;
	var STATE_PRESSED = 1;
	var STATE_DISABLE = 2;
	
	var RECT_ZERO = cc.rect(0, 0, 0, 0);
	
	fishGame.Button = cc.Sprite.extend({
		textures_: null,
		
		state_: 0,
		currentTexture_: null,
		
		touchListener: null,
		
		isTouched_: false,
		
		clickCallback_: null,
		
		ctor: function(){
			this._super();
			
			this.state_ = STATE_NORMAL;
			
			this.textures_ = [null, null, null];
			
			this.touchListener = cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: this.onTouchEvent_,
				onTouchMoved: this.onTouchEvent_,
				onTouchEnded: this.onTouchEvent_,
				onTouchCancelled: this.onTouchEvent_
			}, this)
		},
		
		onTouchEvent_: function(touch, event){
			var self = event.getCurrentTarget(),
				pos = touch.getLocation();
			
			pos = self.convertToNodeSpace(pos);
			
			var rect = cc.rect(0, 0, self.getContentSize().width, self.getContentSize().height);
			
			var isTouched = cc.rectContainsPoint(rect, pos);
			
			var eventCode = event.getEventCode();
			
			switch(eventCode){
			case fishGame.EventTouch.BEGAN:
				if(isTouched){
					self.isTouched_ = true;
					self.setState(STATE_PRESSED);
				}
				
				return isTouched;
				break;
			case fishGame.EventTouch.MOVED:
				self.isTouched_ = isTouched;
				
				self.setState(self.isTouched_ ? STATE_NORMAL : STATE_PRESSED);
				break;
			case fishGame.EventTouch.ENDED:
				
				if(self.isTouched_ && isTouched){
					self.setState(STATE_NORMAL);
					fishGame.utils.invokeCallback(self.clickCallback_, self);
				}
				
				self.isTouched = false;
				
				break;
			case fishGame.EventTouch.CANCELLED:
				self.isTouched_ = false;
				break;
			}
		},
		
		setClickCallback: function(callback){
			this.clickCallback_ = callback;
		},
		
		setNormal: function(texture){
			this.setTexture_(STATE_NORMAL, texture);
		},
		setPressed: function(texture){
			this.setTexture_(STATE_PRESSED, texture);
		},
		setDisable: function(texture){
			this.setTexture_(STATE_DISABLE, texture);
		},
		
		setTexture_: function(state, texture){
			this.textures_[state] = texture;
			
			if(this.state_ === state){
				this.switchTexture_(this.state_);
			}
		},
		
		switchTexture_: function(state){
			var filename = this.textures_[state] || this.textures_[STATE_NORMAL];

		    if(!filename){
				this.setTexture(null);
				return;
			}
			
			if(filename[0] === "#"){
				var spriteFrame = cc.spriteFrameCache.getSpriteFrame(filename.substring(1));
				
				if(spriteFrame)this.setSpriteFrame(spriteFrame);
				else
					this.setTexture(null);
				
				return;
			}
            this.setTexture(filename);
		},
		
		setState: function(state){
			if(this.state_ !== state){
				this.state_ = state;
				
				this.switchTexture_(this.state_);
			}
		},
		
		getState: function(){
			return this.state_;
		}
	});
	
	fishGame.Button.create = function(normal, pressed, disable, onClick){
		if(arguments.length === 3){
			onClick = disable;
			disable = null;
		}
		
		var button = new fishGame.Button();
		
		if(normal)button.setNormal(normal);
		if(pressed)button.setPressed(pressed);
		if(disable)button.setDisable(disable);
		
		if(onClick)button.setClickCallback(onClick);
		
		button.setState(STATE_NORMAL);
		
		return button;
	};
})();