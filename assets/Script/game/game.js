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
        //主角节点SpriteFrame
        leadGroup: {
            default: [],
            type: cc.SpriteFrame
        },
        //主角节点
        newNode: {
          default: null,
          type: cc.Node
        },
        // 阶梯预制资源1
        ladderOne: {
            default: null,
            type: cc.Prefab
        },
        // 阶梯预制资源2
        ladderTwo: {
            default: null,
            type: cc.Prefab
        },
        // 阶梯预制资源3
        ladderThree: {
            default: null,
            type: cc.Prefab
        },
        // 阶梯预制资源4
        ladderFour: {
            default: null,
            type: cc.Prefab
        },
        // layout 阶砖定位节点
        ladderLayout: {
            default: null,
            type: cc.Node
        },
        // 无障碍阶砖
        fixedPosition: null,
        // 路线表
        routeList: [],
        // 透明度
        opacity: 255,
        // 回收节点开关
        putladderSwitch: true,
        // 障碍节点的定位节点
        Other: {
            default: null,
            type: cc.Node
        }
    },

    // 创建新节点池
    newNodePool: function(obj,num){
        let nodePool = new cc.NodePool();//创建空节点池
        for(let i = 0;i < num; i++){
            let newObj = cc.instantiate(obj);// 创建一个预制对象
            nodePool.put(newObj); // 把对象放入节点池
        }
        return nodePool;
    },

    // 初始化阶砖节点池
    newladderNodePool: function(){
        this.ladderOneNodePool = this.newNodePool(this.ladderOne,10);// 普通阶砖
        this.ladderTwoNodePool = this.newNodePool(this.ladderTwo,5);// 树形阶砖
        this.ladderThreeNodePool = this.newNodePool(this.ladderThree,5);// 人形阶砖
        this.ladderFourNodePool = this.newNodePool(this.ladderFour,5);// 帽子阶砖
    },

    // 请求阶砖节点
    getladder: function(type){
        if(!type){
            cc.error('要请求的节点池类型是空的');
            return;
        }
        let obj = null;
        if(this[type].size() > 0){
            obj = this[type].get();
        }else{
            obj = cc.instantiate(this[type.replace(/NodePool/,"")])// 创建新节点
        }
        return obj;
    },

    // 添加阶砖节点
    addladder: function(type,position,Other){
        // Other true 添加主节点 Other false 添加障碍节点
            let self = this;
            let node = this.getladder(type);// 建立阶砖实例
            if(Other){
                self.ladderLayout.addChild(node);
            }else{
                self.Other.addChild(node);
            }
            node.opacity = this.opacity;// 设置透明度
            node.setPosition(position);// 设置阶砖位置
            if (type.toString() === "ladderOneNodePool") {
                self.fixedPosition = node;// 暴露当前阶砖位置
            }
            return node;// 暴露出节点
    },

    // 生成无障碍阶砖
    ladderPosition: function (direction) {
        let self = this;
        let ladderLength = this.ladderLayout.children.length;// 获取当前阶梯数量
        if(ladderLength >= 1){

            let fixedPosition = this.fixedPosition; //上一个无障碍阶梯节点
            let position = null;
            if (direction.Number0 === 0) {
                position = cc.p((fixedPosition.x-this.fixedPositionX),fixedPosition.y+this.fixedPositionY);// 左
            }else if(direction.Number0 === 1){
                position = cc.p((fixedPosition.x+this.fixedPositionX),fixedPosition.y+this.fixedPositionY);// 右
            }
            let leadNodes = self.addladder('ladderOneNodePool',position,true);
            // 把无障碍节点加入路线表
            this.routeList.push({direction: direction.Number0,node:leadNodes});

        }else if(ladderLength === 0){
            // 获取主角
            let lead = self.newNode;
            // 位置
            let oneNode = cc.p(lead.x,-(Math.abs(lead.y)+lead.height/1.5));
            // 添加阶梯
            let leadNodes = self.addladder('ladderOneNodePool',oneNode,true);
            // 阶梯相差的高度
            self.fixedPositionY = self.fixedPosition.height/1.5;
            // 阶梯的1/2宽度
            self.fixedPositionX = (self.fixedPosition.width)/2;
            // 把无障碍节点加入路线表
            this.routeList.push({direction: false,node: leadNodes});
        }
        this.obstacleladderPosition(direction);// 执行障碍节点生成函数
    },

    // 生成障碍阶砖
    obstacleladderPosition: function (direction) {
        if(direction.Number1.probability === 0){
            this.obstacleladderFunction(1,this.ladderDecision(direction.Number1),direction.Number1.direction);// 参数1:当前第几级障碍;参数2:当前使用障碍类型;参数3:当前障碍物生成方向
        }
        if(direction.Number2.probability === 0){
            this.obstacleladderFunction(2,this.ladderDecision(direction.Number2),direction.Number2.direction);
        }
        if(direction.Number3.probability === 0){
            this.obstacleladderFunction(3,this.ladderDecision(direction.Number3),direction.Number3.direction);
        }
    },

    // 判断障碍阶砖方向及类型
    ladderDecision: function(direction){
        let type = null;
        switch(direction.type) {
            case 0:
                type = 'ladderTwoNodePool';
                break;
            case 1:
                type = 'ladderThreeNodePool';
                break;
            case 2:
                type = 'ladderFourNodePool';
                break;
        }
        return type;
    },

    // 添加障碍阶砖
    obstacleladderFunction: function(Grade,type,direction){
        let position = null;
        if(direction === 0){
            position = cc.p(((this.fixedPosition.x)-(this.fixedPosition.width*Grade)),this.fixedPosition.y);
        }else if(direction === 1){
            position = cc.p(((this.fixedPosition.x)+(this.fixedPosition.width*Grade)),this.fixedPosition.y);
        }
        this.addladder(type,position,false);
    },

    // 阶砖生成算法 || 阶梯单排扫描式生成
    updateLadder: function () {
        // 0层无障碍阶砖 1层障碍阶砖 2层障碍阶砖 3层障碍阶砖
        let ladderData  = {
            Number0: this.getRandomInt(0,2),// 1/2 概率
            Number1: {direction: this.getRandomInt(0,2),type:this.getRandomInt(0,3),probability: this.getRandomInt(0,8)},// 1/4  probability: 出现概率,type: 阶梯类型,direction: 阶梯方向
            Number2: {direction: this.getRandomInt(0,2),type:this.getRandomInt(0,3),probability: this.getRandomInt(0,10)},// 1/8 概率及随机方向
            Number3: {direction: this.getRandomInt(0,2),type:this.getRandomInt(0,3),probability: this.getRandomInt(0,16)},// 1/10 概率及随机方向
        };
        this.ladderPosition(ladderData); // 传入算法对象
    },

    // 触摸事件
    touch: function(open){
        let self = this;
        if(open){
            self.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
                if(event.getStartLocation().x <= self.winX/2){
                    // 向左跳跃
                    self.newNodeScript.LeadMain(0,self.routeList);
                }else{
                    // 向右跳跃
                    self.newNodeScript.LeadMain(1,self.routeList);
                }
            },self.node);
        }else{
            cc.eventManager.removeAllListeners();// 关闭全部事件监听
        }
    },

    // 随机算法
    getRandomInt: function(min,max){
        return Math.floor(Math.random()*(max-min)+min);
    },

    // 随机选取主角
    getLead: function () {
        let num = this.getRandomInt(0,4);
        if(num !== 5){
            this.newLead(num);
        }
    },

    // 生成主角并添加到场景
    newLead: function(num) {
        // 给主角节点添加SpriteFrame
        this.newNode.getComponent(cc.Sprite).spriteFrame = this.leadGroup[num];
        // 暴露出主角节点的脚本组件
        this.newNodeScript = this.newNode.getComponent('LeadScript');
    },

    onLoad: function () {
        // 初始化获取屏幕的宽度
        this.winX = this.node.width;
        // 初始化主角
        this.getLead();
        // 初始化阶砖节点池
        this.newladderNodePool();
        // 初始化阶梯节点
        for( let i = 0; i< 10; i++){
            this.updateLadder();// 生成同x轴方向的单排阶梯对象
        }
    },

    // 销毁阶梯操作
    putladder: function(size){
        if(this.putladderSwitch===false){
            return;
        }
        this.putladderSwitch = false;// 暂时关闭回收 避免销毁过多节点
        let parent = this.ladderLayout.children;// 阶梯父节点
        for(let i=0;i<=size;i++){
            if(parent[i].name !== "ladderOneNodePool"){
                this[parent[i].name].put(parent[i]);// 回收该节点
            }
        }
        this.putladderSwitch = true;// 重新开启销毁函数监听
    },

     update (dt) {
        if(this.ladderLayout.children.length >= 30){
            this.putladder(10);// 每次回收10个障碍节点
        }
     },
});
