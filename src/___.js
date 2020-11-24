import React, {Component} from "react";
const ConfigData = require('./main/leftMenu/PermissionConfig');
const KeyArray = ConfigData.keyArray;

window.___ = {

    navigationData: [],

    ChildPage: (Page) => {
        class ChildPage extends Component {
            render() {
                return <Page {...this.props} />;
            }
        };
        return ChildPage;
    },

    toTreeData: (data, attributes, objectStyleCall) => {
        if (!data) {
            return [];
        }
        window.___.navigationData = _.merge([], data);
        //创建虚拟根结构
        let tree = [{
            [attributes.parentId]: attributes.rootIdValue,
            [attributes.children]: []
        }];

        let run = (chiArr) => {
            if (data.length !== 0) {
                for (let i = 0; i < chiArr.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (chiArr[i][attributes.parentId] == data[j][attributes.parentId]) {
                            let call = objectStyleCall(data[j]);
                            chiArr[i][attributes.children].push(
                                Object.assign(
                                    call,
                                    {
                                        [attributes.parentId]: data[j][attributes.curId],
                                        [attributes.children]: [],
                                    }));
                            data.splice(j, 1);
                            j--;
                        }
                    }
                    //  log(chiArr[i][attributes.children])
                    run(chiArr[i][attributes.children]);
                }
            }
        };
        run(tree);
        return tree[0][attributes.children];
    },

    //将导航与权限匹配
    checkPower(NavList,powerTree){
        if(!powerTree){
            return [];
        }
        let resultNav = [];
        for(let obj of powerTree){
            for(let nav of NavList){
                if(nav.id == obj.key || nav.parentId == obj.key){
                    nav.functions = obj.children;
                    for(let power of nav.functions){
                        if(power.name == 'Query' && !!power.permit){
                            resultNav.push(nav);
                            break;
                        }
                    }
                }
            }
        }

        return resultNav;
    },


    getPower: (path) => {
        if (!path) {
            return {};
        }
        let nav = window.___.navigationData;
        let functions = [];
        for (let obj of nav) {
            if (obj.id === path) {
                functions = obj.functions;
            }
        }

        return window.___.initPower(functions);
    },

    initPower(functions) {
        if (!functions) {
            return {};
        }
        log(functions);
        let find = (type) => {
            let index = _.findIndex(functions, (obj) => {
                return obj.permit && obj.name == type;
            });
            if (index >= 0) {
                return functions[index];
            } else {
                return null;
            }
        };

        let result = {};
        KeyArray.forEach((item)=>{
            result[item.key] = find(item.key)
        });

        return result;
    }
};