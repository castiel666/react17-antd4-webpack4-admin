import React, {Component} from 'react';

/** 首页 **/
import IndexPage from './indexPage/index';

//后台账号
import AccountList from '../main/navigationPages/accountManage/AccountList';
import AddAccount from '../main/navigationPages/accountManage/AddAccount';
export default {
    getView(props) {
        return [
            {
                path: "IndexPage",
                component: <IndexPage {...props} />
            },
            {
                path: "AccountList",
                component: <AccountList {...props} />
            },
            {
                path: "AddAccount",
                component: <AddAccount {...props} />
            },
        ]
    }
};
