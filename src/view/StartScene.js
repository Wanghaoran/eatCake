/**
 * Created by Don on 14-9-15.
 */
var HelpLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        var bgd = cc.Sprite.create(res.helpInfo);
        bgd.setPosition(fishGame.display.cx,fishGame.display.cy);
        this.addChild(bgd);

        var closeBtn = cc.Sprite.create("#closeBtn.png");
        closeBtn.setPosition(fishGame.display.cx+bgd.getContentSize().width/2-100,fishGame.display.cy+bgd.getContentSize().height/2-75);
        this.addChild(closeBtn,2);

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:  function(touch, event) {        //实现 onTouchBegan 事件回调函数
                var target = event.getCurrentTarget();    // 获取事件所绑定的 target
                target.removeFromParent(true);
                return true;
            }
        }, this);
    }
});
HelpLayer.create = function(){
    return new HelpLayer();
};

var StartScene = cc.Scene.extend({
    ctor:function(){
        this._super();

        this.canClick = false;
        var layer = cc.Layer.create();

        var bgd = cc.Sprite.create(res.startBgd);
        bgd.setAnchorPoint(0,1);
        bgd.setPosition(fishGame.display.left,fishGame.display.top);
        layer.addChild(bgd);

        var title = cc.Sprite.create(res.indexTitle);
        title.setAnchorPoint(0,1);
        title.setPosition(fishGame.display.left+50,fishGame.display.top-100);
        layer.addChild(title,2);
        
        var logo = cc.Sprite.create(res.pageLogo);
        logo.setAnchorPoint(1,1);
        logo.setPosition(fishGame.display.right,fishGame.display.top);
        layer.addChild(logo,20);


        var tip = cc.Sprite.create(res.tips);
        tip.setAnchorPoint(0,1);
        tip.setPosition(fishGame.display.left,fishGame.display.top-500);
        layer.addChild(tip,3);

        var dragon = cc.Sprite.create(res.indexDragon);
        dragon.setAnchorPoint(0.5,0);
        dragon.setPosition(fishGame.display.cx,fishGame.display.bottom);
        layer.addChild(dragon,1);

        var startBtn = this.startBtn = cc.MenuItemImage.create("#startBtn.png","#startBtn.png",null,this.clickBtn,this);
        startBtn.tag = 0;
        var helpBtn = this.helpBtn = cc.MenuItemImage.create("#helpBtn.png","#helpBtn.png",null,this.clickBtn,this);
        helpBtn.tag = 1;
        startBtn.setPosition(fishGame.display.right+160,fishGame.display.top-450);
        helpBtn.setPosition(fishGame.display.right+160,fishGame.display.top-600);

        var menu = cc.Menu.create(startBtn, helpBtn);
        menu.setPosition(0,0);

        layer.addChild(menu,4);

        this.addChild(layer);
    },
    clickBtn:function(sender){
        if (!this.canClick) return;
        switch (sender.tag){
            case 0:
                cc.director.runScene(new GameScene());
                break;
            case 1:
                var helplayer = HelpLayer.create();
                this.addChild(helplayer,10);
                break;
        }
    },
    onEnter:function(){
        this._super();
        this.runAction(cc.Spawn.create(
            cc.TargetedAction.create(this.startBtn, cc.EaseSineInOut.create(cc.MoveBy.create(0.5,cc.p(-350,0)))),
            cc.TargetedAction.create(this.helpBtn, cc.Sequence.create([
                cc.DelayTime.create(0.2),
                cc.EaseSineInOut.create(cc.MoveBy.create(0.5,cc.p(-350,0))),
                cc.CallFunc.create(function(){this.canClick = true;},this)
            ]))
        ));
    }
});