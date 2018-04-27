// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    playerBtn: function(){
        let finished = cc.callFunc(()=>{cc.director.loadScene("game");}, this);
        this.node.runAction(cc.sequence(cc.fadeOut(1.5), finished));
    },
    moneyBtn: function(){
        cc.log('moneyBtn');
    },
    loveBtn: function(){
        cc.log('loveBtn');
    },

    onLoad () {

    },

    start () {

    },

    // update (dt) {},
});
