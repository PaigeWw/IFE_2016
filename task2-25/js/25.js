/*
* Tree
* */

//扩展数组——删除指定元素
Array.prototype.indexOf = function(item){
    for(var i = 0; i< this.length; i++){
        if(this[i] === item) return i;
    }
    return -1;
}
Array.prototype.remove = function(item){
    var index = this.indexOf(item)
    if( index > -1){
        this.splice(index,1);
    }
}
//树结构
var TreeNode = function(obj){
    this.parent = obj.parent;
    this.childrenArr = obj.childrenArr || [];
    this.data = obj.data || "";
    this.dom = obj.dom;
}
TreeNode.prototype = {
    constructor: TreeNode,
    goAdd: function(obj){
        propBox({
            title:　'添加',
            html: '添加子节点：<input  id="add-txt" type="text">',
            affirm: function(){
                var txt = document.getElementById('add-txt').value;
                console.log(txt);
                if(txt.trim() == ""){
                    alert('输入不正确~。~')
                    return;
                }
                //添加元素 并 显示子元素
                obj.addChild(txt);
                obj.dom.children[3].className = '';
            }
        });
    },
    goDel: function(obj){
        propBox({
            title:　'删除',
            html: '即将删除该节点，及其子节点，确认该操作？',
            affirm: function(){
                obj.distory();
            }
        });
    },
    addChild: function(txt){
        var _dom = document.createElement('li');
        _dom.innerHTML = '<span>'+ txt +'</span><i class="add">+</i><i class="del">-</i><ul class="hide"></ul>';
        var _child = new TreeNode({parent:this,childrenArr:[],data: txt,dom: _dom})
        this.childrenArr.push(_child);
        this.dom.children[3].appendChild(_child.dom);
        //绑定事件
        var _objs = _child.dom.children;
        _objs[0].onclick = function(){
            if(_objs[3].className === 'hide'){
                _objs[3].className = '';
            }else {
                _objs[3].className = 'hide';
            }
        }
        _objs[1].onclick = function(){
            _child.goAdd(_child);
        }
        _objs[2].onclick = function(){
            _child.goDel(_child);
        }
        return this;
    },
    distory: function(){
        console.log(this.dom);
        console.log(this.parent.dom);
        var _parent = this.parent;
        _parent.childrenArr.remove(this);
        _parent.dom.children[3].removeChild(this.dom);
    },
    search: function(txt){
        this.dom.children[0].className = '';
        var _chrildArr = this.childrenArr;
        var isFind = false;
        //正则匹配
        var re = new RegExp(txt,'i');
        if(this.data.search(re) !== -1){
            this.parent.dom.children[3].className = 'hide';
            this.dom.children[0].className = 'highlight';
            isFind = true;
        }
        //深度遍历
        for(var i = 0;i < _chrildArr.length;i++){
            if(_chrildArr[i].search(txt) === true){
                this.dom.children[3].className = '';
                isFind = true;
            }
        }
        return isFind;
    }

}

//弹出框
var propBox = function(options){
    var init = function(){
        var _prop = document.createElement('div');
        var _propBg = document.createElement('div');
        _prop.innerHTML = '<div class="title">'+options.title+'</div><div class="prop-body">'+options.html+'<div class="btns"><input type="button" id="prop-off" value="取消"><input type="button" id="affirm" value="确认"></div></div>';
        _prop.className = 'prop';
        _propBg.className = 'prop-bg';
        _prop.id = 'prop';
        _propBg.id = 'prop-bg';
        document.body.appendChild(_propBg);
        document.body.appendChild(_prop);
        addEvent();
    }
    var propHide = function(){
        var prop = document.getElementById('prop');
        document.body.removeChild(prop);
        var propBg = document.getElementById('prop-bg');
        document.body.removeChild(propBg);
    }
    var addEvent = function(){
        document.getElementById('affirm').onclick = function(){

            if(Object.prototype.toString.call(options.affirm)=== '[object Function]') options.affirm();
            propHide();
        }
        document.getElementById('prop-off').onclick = propHide;
        document.getElementById('prop-bg').onclick = propHide;
    }
    init();
}
window.onload = function(){
    //加载目录
    var root = new TreeNode({parent:null,childrenArr:[],data:"",dom: document.getElementById('root')});
    root.addChild("Preface").addChild("Introduction").addChild("Backgrounds & Border")
        .addChild("Shapes").addChild("Visual Effects").addChild("Typography")
        .addChild("User Experience").addChild("Structure & Layout").addChild("Transition & Animations");
    root.childrenArr[0].addChild("Words of Thinks").addChild("Making of").addChild("About this book");
    root.childrenArr[1].addChild("Web standards:friend or foe").addChild("CSS coding tips");
    root.childrenArr[2].addChild("Chapter 1").addChild("Chapter 2");
    root.childrenArr[3].addChild("Chapter 1").addChild("Chapter 2");
    root.childrenArr[4].addChild("Chapter 1").addChild("Chapter 2");
    root.childrenArr[5].addChild("Chapter 1").addChild("Chapter 2");
    root.childrenArr[6].addChild("Chapter 1").addChild("Chapter 2");
    root.childrenArr[1].childrenArr[0].addChild("One").addChild("Two").addChild("Three");
    root.childrenArr[2].childrenArr[1].addChild("One").addChild("Two").addChild("Three");
    root.childrenArr[3].childrenArr[1].addChild("One").addChild("Two").addChild("Three");
    root.childrenArr[4].childrenArr[0].addChild("One").addChild("Two").addChild("Three");

    //绑定查找事件
    document.getElementById('search').onclick = function(){
        var keywords = document.getElementById('keywords').value;
        if(keywords.trim() == ""){
            alert('输入不正确~。~')
            return;
        }
        root.search(keywords);
    }
}