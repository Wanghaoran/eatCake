/**
 * Created by Don on 14-9-15.
 */

/*
* 1每500分增加一个红心（红心最大数为5）
* 2.游戏开始2个红心
* 3.每增加1000分，增加水果掉落速度，炸弹道具概率增加
* 4.初始概率，蛋糕40，水果40，炸弹20，每增加1000分，蛋糕-6概率，水果炸弹各加3，最后蛋糕到10最小
 */
var GameLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        //历时
        this.totalTime = 0;
        this.cloudDirection = 1;
        this.dragonDirection = 1;
        this.moveDragon = false;
        this.fruits = [];
        this.MAXFRUITS = 80;
        this.dropSpeedY = 0;
        //是否需要增加生命
        this.needAddLife = 0;

        this.life = 2;
        this.scoreNum = 0;
        this.bestScoreNum = fishGame.LocalStorage.getItem("bestScore")||0;
        //蛋糕概率
        this.cakePorb = 30;
        this.fruitPorb = 80;

        var bgd = cc.Sprite.create(res.gameBgd);
        bgd.setAnchorPoint(0.5,1);
        bgd.setPosition(fishGame.display.cx,fishGame.display.top);
        this.addChild(bgd);

        var logo = cc.Sprite.create(res.pageLogo);
        logo.setAnchorPoint(0,1);
        logo.setPosition(fishGame.display.left,fishGame.display.top);
        this.addChild(logo,20);
        //cloud
        var cloud = this.cloud = cc.Sprite.create(res.cloud);
        cloud.setPosition(fishGame.display.cx,fishGame.display.top-500);
        this.addChild(cloud,1);
        //board
        var board = cc.Sprite.create("#bottom_bar.png");
        board.setAnchorPoint(0.5,0);
        board.setPosition(fishGame.display.cx,fishGame.display.bottom);
        this.addChild(board,3);

        var nowScore = this.nowScore = cc.LabelBMFont.create("0", res.redNumFnt, 320, cc.TEXT_ALIGNMENT_LEFT);
        nowScore.setAnchorPoint(0,0.5);
        nowScore.setPosition(fishGame.display.cx-217,fishGame.display.bottom+80);
        nowScore.setScale(1.2);
        this.addChild(nowScore,4);

        var bestScore = this.bestScore = cc.LabelBMFont.create(this.bestScoreNum, res.redNumFnt, 320, cc.TEXT_ALIGNMENT_LEFT);
        bestScore.setAnchorPoint(0,0.5);
        bestScore.setScale(1.2);
        bestScore.setPosition(fishGame.display.cx-198,fishGame.display.bottom+35);
        this.addChild(bestScore,4);

        for(var i=0; i<5; i++) {
            var heart = cc.Sprite.create(i<2?"#life.png":"#life_base.png");
            heart.setPosition(fishGame.display.cx+100+50*i,fishGame.display.bottom+65);
            this["heart"+i] = heart;
            this.addChild(heart,5);
        }

        var dragon = this.dragon = new Dragon();
        dragon.setAnchorPoint(0.5,0);
        dragon.setPosition(fishGame.display.cx,fishGame.display.bottom+110);
        this.addChild(dragon,2);

        var pauseAndPlay = this.pauseAndPlay = cc.Sprite.create("#pasueBtn.png");
        pauseAndPlay.setAnchorPoint(1,1);
        pauseAndPlay.setPosition(fishGame.display.right,fishGame.display.top);
        pauseAndPlay.isPlay = true;
        this.addChild(pauseAndPlay,10);

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:  function(touch, event) {        //实现 onTouchBegan 事件回调函数
                var target = event.getCurrentTarget();    // 获取事件所绑定的 target
                // 获取当前点击点所在相对按钮的位置坐标
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if(cc.rectContainsPoint(rect, locationInNode)){        // 点击范围判断检测
                    target.isPlay = !target.isPlay;
                    target.setSpriteFrame(target.isPlay?"pasueBtn.png":"playBtn.png");
                    if(!target.isPlay){
                        var scene = cc.director.getRunningScene();
                        target.getParent().unscheduleUpdate();
                        target.getParent().isPause = true;
                    } else {
                        target.getParent().scheduleUpdate();
                        target.getParent().isPause = false;
                    }
                    return true;
                }
                return false;
            }
        }, pauseAndPlay);
        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:  function(touch, event) {        //实现 onTouchBegan 事件回调函数
                var target = event.getCurrentTarget();    // 获取事件所绑定的 target
                // 获取当前点击点所在相对按钮的位置坐标
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if(!target.getParent().isPause &&cc.rectContainsPoint(rect, locationInNode)){        // 点击范围判断检测
                    target._touchBeganPoint = locationInNode;
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch, event){
                var target = event.getCurrentTarget();    // 获取事件所绑定的 target
                var moveX = touch.getLocation().x;
                var halfW = target.getContentSize().width/2;
                if( moveX < halfW) {
                    target.setPositionX(halfW);
                } else if (moveX > fishGame.display.width-halfW){
                    target.setPositionX(fishGame.display.width-halfW);
                } else {
                    target.setPositionX(moveX);
                }
            },
            onTouchEnded: function(touch, event){
            }
        }, dragon);

        this.createFruit(this.MAXFRUITS);
        
        var that = this;
        
        var guide = this.guide = cc.Sprite.create(res.guide);
        guide.setPosition(fishGame.display.cx,fishGame.display.cy);
        this.addChild(guide,300);
        guide.runAction(cc.Sequence.create(
        		cc.MoveBy.create(0.5,cc.p(50,0)),
        		cc.MoveBy.create(0.5,cc.p(-100,0)),
        		cc.MoveBy.create(0.5,cc.p(100,0)),
        		cc.MoveBy.create(0.5,cc.p(-100,0)),
        		cc.CallFunc.create(function(){
        			this.guide.removeFromParent(true);
        			this.scheduleUpdate();
        		},that)
        ));

        this.isPause = false;
        
        cc.eventManager.addListener({
        	event:cc.EventListener.TOUCH_ONE_BY_ONE,
        	swallowTouches:false,
        	onTouchBegan:function(touch, event){
            	var target = event.getCurrentTarget();
            	target.guide.removeFromParent(true);
            	target.scheduleUpdate();
            }
        },this);
    },
    createFruit:function(num){
        for(var i=0; i<num; i++) {
            var fruitPos = fishGame.fruits.length-1;
            var prob = Math.floor(Math.random()*101);
            if(prob<this.cakePorb){
                fruitPos = Math.floor(Math.random()*7);
            } else if(prob<this.fruitPorb){
                fruitPos = Math.floor(Math.random()*5)+7;
            }
            var fruitInfo = fishGame.fruits[fruitPos];
            var fruit = new Fruit(fruitInfo);
            var stepTime1 = 2-Math.floor(this.scoreNum/200)*0.1;
            stepTime1 = stepTime1 > 0.5 ? stepTime1 : 0.5;
            var stepTime2 = 4-Math.floor(this.scoreNum/200)*0.1;
            stepTime2 = stepTime2 > 1 ? stepTime2 : 1;
            fruit.delay = stepTime2*Math.floor(i/5)+Math.floor(Math.random()*stepTime1);

            fruit.setPosition(50+Math.random()*(fishGame.display.width-100),fishGame.display.top+60);
            this.addChild(fruit,2);

            this.fruits.push(fruit);
        }
    },
    update:function(dt){
        this.totalTime += dt;
        //count Prob
        var _t = Math.floor(this.scoreNum/500);
        if(this.scoreNum>=4000) {
            this.fruitPorb = 40;
        } else {
            this.cakePorb = 30;
            this.fruitPorb = 80 - _t*10;
        }
        this.dropSpeedY = Math.floor(this.scoreNum/200)*30;
        //cloud moved
        var cloudx = this.cloud.getPositionX();
        var nowx = cloudx+this.cloudDirection*dt*50;
        if(nowx<-585) {
            this.cloudDirection = 1;
        } else if(nowx>fishGame.display.width+585) {
            this.cloudDirection = -1;
        }
        this.cloud.setPositionX(nowx);
        //fruit drop and create
        if(this.fruits.length){
            for(var i=0; i<this.fruits.length; i++){
                var fruit = this.fruits[i];
                if(!fruit) continue;
                if(fruit.delay>0) {
                    fruit.delay -= dt;
                    continue;
                }
                fruit.startRotation += dt*60;
                fruit.startRotation %= 360;
                fruit.setRotation(fruit.startRotation);

                var fruitY = fruit.getPositionY();
                var nowY = fruitY-(fruit.itemInfo.speedy+this.dropSpeedY)*dt;
                if(nowY<=fishGame.display.bottom){
                    this.fruits.splice(i,1);
                    i--;
                    fruit.removeFromParent(true);
                }else{
                    fruit.setPositionY(nowY);
                    var dragonX = this.dragon.getPositionX();
                    var fruitX = fruit.getPositionX();

                    //hit the dragon, and dragon can eat it
                    if(nowY>=250 && nowY <= 320 && Math.abs(fruitX-dragonX)<=130 && !fruit.isHit){
                        fruit.isHit = true;
                        if(fruit.itemInfo.life) {
                            this.addLife(fruit.itemInfo.life);
                            this.dragon.eatFood(true);
                        }else if(fruit.itemInfo.score) {
                            this.dragon.eatFood();
                            this.addScoreNum(fruit.itemInfo.score);
                        }
                        this.fruits.splice(i,1);
                        i--;
                        fruit.removeFromParent(true);
                    }
                }
            }
        } else {
            if(this.scoreNum<=500) {
                this.createFruit(50);
            } else if(this.scoreNum<=1000){
                this.createFruit(60);
            } else if(this.scoreNum<=1500){
                this.createFruit(70);
            } else if(this.scoreNum<=2000){
                this.createFruit(80);
            } else
                this.createFruit(90);
        }
    },
    addLife:function(num){
        this.life += num;
        this.life = this.life>5 ? 5 : this.life;
        if(this.life <=0) {
            this.gameOver();
            this.dragon.isDead();
        } else {
            this.dragon.checkBodyImage(this.life);
        }
        for(var i=0;i<5;i++){
            if(i<this.life){
                this["heart"+i].setSpriteFrame("life.png");
            }else{
                this["heart"+i].setSpriteFrame("life_base.png");
            }
        }
    },
    addScoreNum:function(num){
        this.scoreNum += num;

        var tempNumImg = cc.LabelBMFont.create("+"+num, res.blueNumFnt, 320, cc.TEXT_ALIGNMENT_CENTER);
        tempNumImg.setPosition(this.dragon.getPositionX(),this.dragon.getPositionY()+this.dragon.getContentSize().height+20);
        this.addChild(tempNumImg,200);
        tempNumImg.setScale(2);
        tempNumImg.scheduleOnce(function(){tempNumImg.removeFromParent(true);},0.5);

        //微信分享使用
        fishGame.eatCakeScore = this.scoreNum;

        this.needAddLife += num;
        if(this.needAddLife>=500) {
            this.addLife(1);
            this.needAddLife = 0;
        }
        this.nowScore.setString(this.scoreNum);
        if(this.scoreNum>this.bestScoreNum){
            this.bestScoreNum = this.scoreNum;
            this.bestScore.setString(this.bestScoreNum);
        }
    },
    gameOver:function(){
        cc.director.runScene(new GameOverScene(this.scoreNum,this.bestScoreNum)) ;
        fishGame.LocalStorage.setItem("bestScore",this.bestScoreNum);
    }
});

var GameScene = cc.Scene.extend({
    ctor:function(){
        this._super();
        this.gamelayer = new GameLayer();
        this.addChild(this.gamelayer);
    }
});