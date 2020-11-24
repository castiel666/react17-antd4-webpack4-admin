import TimeHelp from '../../tool/TimeHelp.js';

//给每个元素添加唯一key
function addKey(item) {
    let data = item;
    let keyVal = parseInt(Math.random() * 10000000) * 1000;

    let add = (item) => {
        keyVal++;
        if (!item || item.length <= 0) {
            return;
        }
        for (let key in item) {
            //存在id，取id值，否则赋递增值
            item[key].key = item[key].id?item[key].id:keyVal;
            add(item[key].children);
        }
    };

    add(item);

    return data;
}

function addKeyForObj(obj){
    if(!obj){
        return {};
    }
    let newObj = obj;
    let keyVal = parseInt(Math.random() * 10000000) * 1000;
    newObj.key = keyVal;
    return newObj;
}

//返回层级信息
function getBranchNameMsg(treeData, value) {
    let spreadData = [];
    let searchChild = (childTree) => {
        if (!childTree || childTree.length <= 0) {
            return;
        }
        for (let key = 0; key < childTree.length; key++) {
            let child = childTree[key];
            spreadData.push(child);
            if (child.children) {
                searchChild(child.children);
            }
        }
    };

    searchChild(treeData);

    log(spreadData);
    if (spreadData.length <= 0) {
        return '';
    }

    let foundTarget = spreadData.find((val) => val['id'] === value);
    let pathArr = [foundTarget['name']];

    if (foundTarget) {
        let temp = {};
        while (foundTarget&&foundTarget['parentId'] !== null) {
            temp = spreadData.find(val => val['id'] === foundTarget['parentId']);
            if (temp) {
                pathArr.unshift(temp['name']);
            }
            foundTarget = temp;
        }
    }

    return pathArr.join(' / ');
}


//排除数组对象中指定 键 - 值 的对象
function drop(arg, list, name) {
    if (!arg || arg.length <= 0) {
        return [];
    }
    if (!name || !list || list.length <= 0) {
        return arg;
    }
    let newArg = [];
    for (let key in arg) {
        if (list.indexOf(arg[key][name]) >= 0) {

        } else {
            newArg.push(arg[key])
        }
    }

    return newArg;
}

/**
 * 在指定树节点中插入一条数据
 * @param target  目标树
 * @param index 用于查询的键
 * @param value 用于查找目标节点的id值
 * @param data  需要插入的子节点
 * @param type  插入的类型  'list':子集合替换  'node':新增一条子数据
 */
function insertData(target, index,value, data,childType){
    let insertType = childType?childType:'list';
    let newTree = [].concat(target);
    let insertAction = (target, index,value, data)=>{
        if (!target || target.length <= 0) {
            return;
        }
        for (let key in target) {
            let childTarget = target[key];
            if (childTarget[index] == value) {
                insertType == 'list'
                ?childTarget.children = data
                :(childTarget.children
                    ?   childTarget.children.push(data)
                    :   childTarget.children = [data]
                    );
                return;
            } else {
                insertAction(childTarget.children, index,value, data);
            }
        }
    };

    insertAction(newTree,index,value, data,);
    return newTree;
}

/**
 * 对指定节点做操作
 * @param target
 * @param index
 * @param value
 * @param data
 * @param actionType
 * @return {*[]}
 */
function changeDataFromTree(target, index,value, data,actionType){
    let newTree = [].concat(target);

    let action = (target, index,value, data)=>{
        if (!target || target.length <= 0) {
            return;
        }
        for (let key in target) {
            let childTarget = target[key];
            if (childTarget[index] == value) {
                switch(actionType){
                    case 'edit':target.splice(key,1,data);break;
                    case 'delete':target.splice(key,1);break;
                }
            } else {
                action(childTarget.children, index,value, data);
            }
        }
    };

    action(newTree,index,value, data,);
    return newTree;
}

//查询权限
function initPower(functions){
    return window.___.initPower(functions);
}

//去掉图片url 前的域名
//通过标记位 来 判断 从哪里开始截取
function DropDomain(url,mark){
    if(!url){
        return '';
    }
    let verMark = mark||'/cloudfile/';

    let index = url.indexOf(verMark);
    return url.slice(index);
}

//把Moment类型的时间转换成字符串
function MomentToStr(moment,reg){
    if(!moment){
        return null;
    }
    if(typeof moment == 'string'){
        return moment;
    }
    let regStr = reg||'yyyy-MM-dd';
    let date_ori = moment.valueOf();
    return TimeHelp.getYMDFormat(date_ori,regStr);
}

//数字中插入逗号
function formateNumber(data) {
    if (data === undefined || data === null) {
        return '';
    }

    return parseFloat(data).toLocaleString('en-US');
}

//计算两数相除，余6位小数字，取百分比
function getTransformData(value, total) {
    if (value === 0) {
        return '0%';
    }
    if (!value || !total) {
        return '';
    }

    let result = ((value / total) * 100).toFixed(6) + ' %';
    return result;
}

//返回多级对象数组中指定对象
function getTargetFromTree(target, index,value){
    let newTree = [].concat(target);
    let result = undefined;

    let action = (target, index,value)=>{
        if (!target || target.length <= 0) {
            return;
        }
        for (let key in target) {
            let childTarget = target[key];
            if (childTarget[index] == value) {
                result = childTarget;
            } else {
                action(childTarget.children, index,value);
            }
        }
    };

    action(newTree,index,value);
    return result;
}

//加载js
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if(typeof(callback) != "undefined"){
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
    }
    script.src = url;
    document.body.appendChild(script);
}

//前端生成文件
function createDataDownload(data, filename, type) {
    let file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}


export default {
    addKey,
    addKeyForObj,
    drop,
    getBranchNameMsg,
    insertData,
    changeDataFromTree,
    initPower,
    DropDomain,
    MomentToStr,
    formateNumber,
    getTransformData,
    getTargetFromTree,
    loadScript,
    createDataDownload,
};