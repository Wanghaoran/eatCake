/**
 * Created by Don on 14-9-15.
 */
var Fruit  = cc.Sprite.extend({
    ctor:function(itemInfo){
        this._super();

        this.itemInfo = itemInfo;

        this.setSpriteFrame(itemInfo.image);

        this.startRotation = Math.random()*361;
        this.setRotation(this.startRotation);
    }
});