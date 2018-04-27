/*
*  阶梯脚本
* */

cc.Class({
    extends: cc.Component,

    properties: {
        AnimationTime: 2,
    },

    over: function(){
        let callback = cc.callFunc(function(){this.nodeOver()},this);
        let Animation =cc.sequence(cc.spawn(cc.moveBy(this.AnimationTime,0,-500),cc.fadeOut(this.AnimationTime)),callback);// 动画
        this.node.runAction(Animation);
    },

    nodeOver: function(){
        cc.find('Canvas').getComponent('game').ladderOneNodePool.put(this.node);
    },

    // update (dt) {},
});
