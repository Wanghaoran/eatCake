cc.game.onStart = function(){
    //load resources
    fishGame.display.init();
    cc.director.setDisplayStats(false);
    cc.view.resizeWithBrowserSize(true);

    cc.LoaderScene.preload(g_resources, function () {
        cc.spriteFrameCache.addSpriteFrames(res.itemsplist, res.items);
        cc.spriteFrameCache.addSpriteFrames(res.gameUiplist, res.gameUi);
        cc.spriteFrameCache.addSpriteFrames(res.dragonplist, res.dragon);
        cc.director.runScene(new StartScene());
    }, this);
};
cc.game.run();
