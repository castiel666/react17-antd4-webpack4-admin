import React from 'react';
import Error from './Error.js';
import Config from '../Config.js';
import css from "./TabConfig.less";

export default {
    getTabConfig(obj, activeKey, openTab, closeTab, callBack, getCurrentAcitveKey) {
        let props = {
            openTab: openTab,
            closeTab: closeTab,
            post: obj.post ? obj.post : {},
            title: obj.title,
            path: obj.path,
            targetKey: activeKey,
            callBack: callBack ? callBack : {},
            getCurrentAcitveKey: getCurrentAcitveKey ? getCurrentAcitveKey : {}
        };
        let arr = Config.getView(props);
        let tabView = <Error {...props}/>;
        let multiple = false;
        for (let i in arr) {
            let view = arr[i];
            if (view.path == obj.path) {
                multiple = !!view.multiple;
                tabView = (
                    <div className={css.layout_main}>{view.component}</div>
                )

            }
        }

        return {
            title: obj.title,
            content: obj.title,
            //默认不填 可关闭
            closable: obj.closable == undefined ? true : !!obj.closable,
            path: obj.path,
            key: activeKey,
            multiple: multiple,
            getView: () => {
                return tabView
            },
        };
    },
};