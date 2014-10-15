/**
 * Created by Don on 14-9-18.
 */
var GameOverLayer = cc.Layer.extend({
    ctor:function(scoreNum,bestScoreNum){
        this._super();

        var bgd = cc.Sprite.create(res.gameBgd);
        bgd.setAnchorPoint(0.5,1);
        bgd.setPosition(fishGame.display.cx,fishGame.display.top);
        this.addChild(bgd);
        
        var logo = cc.Sprite.create(res.pageLogo);
        logo.setAnchorPoint(0,1);
        logo.setPosition(fishGame.display.left,fishGame.display.top);
        this.addChild(logo,20);

        var shareHelpImg = this.shareHelpImg = cc.MenuItemImage.create(res.shareBgd,res.shareBgd,this.clickBtn,this);
        shareHelpImg.setAnchorPoint(0.5,1);
        shareHelpImg.setPosition(fishGame.display.cx, fishGame.display.top);
        shareHelpImg.setVisible(false);
        shareHelpImg.tag = 2;

        var cakeImg = cc.Sprite.create(res.gameOverIcon);
        cakeImg.setPosition(fishGame.display.cx, fishGame.display.cy+50);
        this.addChild(cakeImg, 1);

        scoreNum = scoreNum||0;

        var nowScore = this.nowScore = cc.LabelBMFont.create(scoreNum, res.endNumFnt, fishGame.display.width, cc.TEXT_ALIGNMENT_LEFT);
        nowScore.setPosition(fishGame.display.cx+50,fishGame.display.cy+160);
        this.addChild(nowScore,4);

        if(scoreNum <= 1000) {
            window.shareData.enddesc = "我打败了"+(Math.floor(Math.random()*14)+8)+"%的吃货，妙趣指数为“吃货书童”，笑点低的童鞋们遇到可要谨慎靠近我哦~";
        } else if(scoreNum <= 2000){
            window.shareData.enddesc = "我打败了"+(Math.floor(Math.random()*31)+22)+"%的吃货，妙趣指数为“吃货法门”，此人只闻天上有，人家哪得机会见….";
        } else if(scoreNum <= 3000){
            window.shareData.enddesc = "我打败了"+(Math.floor(Math.random()*12)+53)+"%的吃货，妙趣指数为“吃货童姥”，在不开心，跟我一起，那也都不是事儿~";
        } else {
            window.shareData.enddesc = "我打败了"+(Math.floor(Math.random()*31)+65)+"%的吃货，妙趣指数为“吃货盟主”，妙食天下，芙与天齐，一人之下，万人之上！";
        }
        var bestScore = cc.LabelTTF.create(window.shareData.enddesc, 'Times New Roman', 32, cc.size(380,260), cc.TEXT_ALIGNMENT_LEFT);
        bestScore.setColor(cc.color(96,23,4,255));
        bestScore.setPosition(fishGame.display.cx+35,fishGame.display.cy-70);
        this.addChild(bestScore,4);
        /*var bestScore = this.bestScore = cc.LabelBMFont.create(bestScoreNum||0, res.endNumFnt, fishGame.display.width, cc.TEXT_ALIGNMENT_CENTER);
        bestScore.setPosition(fishGame.display.cx,fishGame.display.cy-200);
        this.addChild(bestScore,4);*/

        var shareBtn = cc.MenuItemImage.create("#shareBtn.png","#shareBtn.png",this.clickBtn,this);
        var againBtn = cc.MenuItemImage.create("#againBtn.png","#againBtn.png",this.clickBtn,this);
        shareBtn.setAnchorPoint(1,0.5);
        shareBtn.tag = 0;
        againBtn.setAnchorPoint(0,0.5);
        againBtn.tag = 1;
        var top = cakeImg.getPositionY()-cakeImg.getContentSize().height/2-50;
        shareBtn.setPosition(fishGame.display.cx-5, top);
        againBtn.setPosition(fishGame.display.cx+5, top);

        var menu = cc.Menu.create(shareBtn, againBtn,shareHelpImg);
        menu.setPosition(fishGame.display.left, fishGame.display.bottom);
        this.addChild(menu,6);

        /*cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:  function(touch, event) {        //实现 onTouchBegan 事件回调函数
                console.log("layer onTouchBegan");
                return true;
            }
        }, this);*/
    },
    clickBtn:function(sender){
        if(sender.tag == 0) {
            this.shareHelpImg.setVisible(true);
        } else if(sender.tag == 1){
            window.shareData.desc = null;
            cc.director.runScene(new GameScene());
        } else if(sender.tag == 2){
            this.shareHelpImg.setVisible(false);
        }
    }
});
var GameOverScene = cc.Scene.extend({
    ctor:function(score,bestScore){
        this._super();
        this.addChild(new GameOverLayer(score,bestScore));
    },
    onEnter:function(){
        this._super();
    },
    onExit:function(){
        this._super();
    }
});