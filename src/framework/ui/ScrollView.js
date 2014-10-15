/**
 * Created by Don on 14-8-14.
 */
var ScrollView = fishGame.ScrollView = {};

fishGame.ScrollView.DIR_NONE=0;
fishGame.ScrollView.DIR_VERTICAL=1;
fishGame.ScrollView.DIR_HORIZONTAL=2;
fishGame.ScrollView.DIR_BOTH=3;

ScrollView = cc.Node.extend({
    ctor: function(width, height, scene){
        this._super();

        this.scene = scene;

        this.direction = fishGame.ScrollView.DIR_VERTICAL;

        this.setContentSize(fishGame.display.width, fishGame.display.height);

        var contentNode = cc.Node.create();
        contentNode.setAnchorPoint(0,1);
        contentNode.setPosition(fishGame.display.left, fishGame.display.top-300);
        contentNode.setContentSize(fishGame.display.width, fishGame.display.height);

        var descWord = this.descWord = cc.LabelTTF.create("    我压抑着激动的心情往加油站里冲，可是我没有注意到，加油站中布置在半空中的鱼线。\n    突然我感到脖子被什么东西碰了一下，用手一摸全是血，还在不断的向外喷涌。\n    “糟糕！大动脉破了。”\n    一分钟后，我带着遗憾失去了所有知觉。",  'Times New Roman', 30, cc.size(fishGame.display.width-60,fishGame.display.height), cc.TEXT_ALIGNMENT_LEFT);
        descWord.setColor(cc.color(0,0,0,255));
        descWord.setAnchorPoint(cc.p(0,1));
        descWord.setPosition(fishGame.display.left+30, fishGame.display.top-300);
        contentNode.addChild(descWord, 5);


        var maskNode = cc.DrawNode.create();
        maskNode.drawRect(cc.p(0, 0), cc.p(fishGame.display.width, fishGame.display.height));
        maskNode.setAnchorPoint(0,1);
        contentNode.setPosition(cc.p(fishGame.display.left, fishGame.display.top-300));

        var clippnode = cc.ClippingNode.create(maskNode);
        clippnode.setAnchorPoint(0,1);
        clippnode.setPosition(fishGame.display.left, fishGame.display.top-300);
        clippnode.setContentSize(width, height);
        clippnode.addChild(contentNode);

        this.addChild(clippnode);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                var self = event.getCurrentTarget(), pos = touch.getLocation();

                pos = self.convertToNodeSpace(pos);

                var rect = cc.rect(0, 0, self.getContentSize().width, self.getContentSize().height);

                if (cc.rectContainsPoint(rect, pos)) {
                    console.log(1);
                    return true;
                }
                console.log(2);
                return false;
            },
            onTouchMoved: function(touch, event){
                console.log("onTouchMoved",touch,event);
            },
            onTouchEnded: function(touch, event){
                console.log("onTouchEnded",touch,event);
            },
            onTouchCancelled: function(touch, event){

            }
        }, clippnode);
    },
    setDirection:function(direction){
        this.direction = direction || fishGame.ScrollView.DIR_VERTICAL;
    },
    setInfo: function(desc){
        this.descWord.setString(desc);
    }

});
ScrollView.create = function(width, height, scene){
    return new ScrollView(width, height, scene);
};