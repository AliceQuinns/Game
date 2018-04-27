/*
*  主角脚本
*
* */

cc.Class({
    extends: cc.Component,

    properties: {
        parent: {
            default: null,
            type: cc.Node
        },
        // 分数节点
        achievementNode: {
            default: null,
            type: cc.Node
        },
        // 分数及路线
        achievement: 0,
        DestroySpeed: 100,// 销毁速度 ms
        open: 0, // 销毁计数
        // 弹窗
        alert: {
            default: null,
            type: cc.Node
        }
    },

    // 获取跳跃相关参数
    getJumpDate: function(){
        this.games = this.parent.getComponent('game');// games节点
        this.laderHeight = (this.games.fixedPosition.height)/1.5;// 无障碍阶梯的高度
    },

    // 动画库
    LeadAnimation: function(direction,positon){
        let Animations = null;
        // 左跳
        if(direction === 0){
            /* 改变主角x轴方向 */
            this.node.scaleX = 1;
            Animations = cc.jumpTo(0.3,cc.p(positon.x,positon.y+this.laderHeight),50,1);
        }
        // 原地跳
        else if(direction === 2){
            Animations = cc.sequence(
                cc.scaleTo(0.1, 0.8, 1.2),
                cc.scaleTo(0.1, 1, 1),
                cc.scaleTo(0.1, 1.2, 0.8),
                cc.scaleTo(0.1, 1, 1),
                ).repeat(2);
        }
        // 右跳
        else if(direction === 1){
            /* 改变主角x轴方向 */
            this.node.scaleX = -1;
            Animations = cc.jumpTo(0.3,cc.p(positon.x,positon.y+this.laderHeight),50,1);
        }
        // game over 动画
        else if(direction === 3){
            Animations = cc.spawn(cc.moveBy(1,0,-500),cc.fadeOut(1));// 动画
        }
        return Animations
    },

    /*
    *       路线表数据结构  [{direction: 0,node: cc.Node},{direction: 1,node: cc.Node}]
    *
    * */

    // 阶梯节点主入口
    LeadMain: function(direction,node){
        this.achievement++;// 增加分数
        if(direction === node[this.achievement].direction){
            this.achievementNode.getComponent(cc.Label).string = this.achievement;// 更新分数
            this.node.runAction(this.LeadAnimation(direction,node[this.achievement].node.getPosition()));// 跳跃动画
            this.addlader();// 添加下一个阶梯
            this.router = node;//把无障碍节点数组暴露到全局
        }else{
            this.games.touch(false);// 关闭全部事件监听
            this.node.runAction(this.LeadAnimation(3));// 执行game over 动画
            // 开启弹框
            this.alert.getComponent('alert').init();
        }
    },

    /* 销毁速度控制 */
    MoveSpeed: function(){
        let self = this;
        if(!self.router){
            return;
        }
        let a =  setInterval(function(){
            try{
                self.router[self.open].node.getComponent('LaderScript').over();// 销毁阶梯
                self.open++;
                /* 判断主角在此阶梯 */
                if(self.open >= self.achievement ){
                    self.games.touch(false);// 关闭全部事件监听
                    self.node.runAction(self.LeadAnimation(3));// 执行game over动画
                    self.router[self.open].node.getComponent('LaderScript').over();// 销毁当前阶梯
                    clearInterval(a);// 关闭计时器
                    // 开启弹框
                    self.alert.getComponent('alert').init();
                }
            }catch(err){
                clearInterval(a);
            }
        },self.DestroySpeed);
    },

    // 添加下一个阶梯
    addlader: function(){
        this.games.updateLadder();
    },

    start () {
        this.getJumpDate();// 初始化获取跳跃相关参数
        this.router = this.games.routeList;// 初始化获取路由表
    },

    // update (dt) {},
});
