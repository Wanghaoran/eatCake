/**
 * Created by Don on 14-9-15.
 */
var Dragon = cc.Sprite.extend({
    ctor:function(){
        this._super();
        this.life = 2;
        this.setSpriteFrame("dragon2.png");
    },
    checkBodyImage:function(num){
        this.life = num;
        this.setSpriteFrame("dragon"+num+".png");
    },
    eatFood:function(isBomb){
        this.setSpriteFrame("dragon"+this.life+".png");
        this.setSpriteFrame(isBomb?"dragon7.png":"dragon6.png");
        var that = this;
        this.runAction(cc.Sequence.create(
            cc.DelayTime.create(0.3),
            cc.CallFunc.create(function(){this.setSpriteFrame("dragon"+this.life+".png");}, that)
        ))
    },
    isDead:function(){
        this.setSpriteFrame("dragon7.png");
    }
});