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
        // 分数节点
        Fraction: {
            default: null,
            type: cc.Node
        }
    },
    /* home 按钮 */
    home () {
        // 切换到开始场景
        let finished = cc.callFunc(()=>{cc.director.loadScene("player");}, this);
        this.node.runAction(cc.sequence(cc.fadeOut(.5), finished));
    },

    /* Restart 按钮 */
    restart () {
       // 切换到游戏场景
        let finished = cc.callFunc(()=>{cc.director.loadScene("game");}, this);
        this.node.runAction(cc.sequence(cc.fadeOut(.5), finished));
    },
    start () {

    },

    init () {
        cc.log('init');
        this.node.getChildByName('Fraction').getComponent(cc.Label).string = this.Fraction.getComponent(cc.Label).string;
        this.node.runAction(cc.moveTo(1,cc.p(0,0)));
    },

    // update (dt) {},
});
