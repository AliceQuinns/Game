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
        parent: {
            default: null,
            type: cc.Node
        },
        Lead: {
          default: null,
            type: cc.Node
        },
        text: 3,// 倒计时时间
        blink: 1, // 每次闪烁时间
        blinkSize: 5, // 闪烁次数
    },



    onLoad () {
        let self = this;
        this.time = function () {
            if (self.text === 0) {
                self.parent.getComponent('game').touch(true);// 开启触摸监听
                self.node.getComponent(cc.Label).string = "Go";
                self.node.getComponent(cc.Label).unschedule(self.time);// 取消定时器
                self.node.runAction(cc.fadeOut(1.5));// 渐隐组件
                self.DestroyOne(); // 开始执行销毁
                return;
            }
            self.text--;
            self.node.getComponent(cc.Label).string = self.text;
        };
        this.node.getComponent(cc.Label).schedule(this.time, 1);
    },

    /* 第一个阶梯消失 */
    DestroyOne: function(){
        let self = this;
        let callback = cc.callFunc(function(){ self.Lead.getComponent('LeadScript').MoveSpeed()},this);// 开始销毁
        this.parent.getComponent('game').routeList[0].node.runAction(cc.sequence(cc.blink(this.blink,this.blinkSize),callback));
    },

    start () {

    },

    update (dt) {

    },
});
