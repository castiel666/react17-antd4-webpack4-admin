import React, {Component} from 'react';
import {Layout} from 'antd';
import Login from './login/Login.js';
import Index from './leftMenu/Index.js';
import css from './App.less';
import APILXD from '../http/APILXD.js';
import HttpTool from "../tool/HttpTool";
import CookieHelp from "../tool/CookieHelp";
const {Content} = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        let permission = [];
        if (window.localStorage) {
            permission = JSON.parse(window.localStorage.getItem('permission'));
        }
        this.state = {
            upData: 0,
            sRight: true,
            permission: permission,
            inputs: [
                {value: 'a', checked: true},
                {vslur: 'b',}
            ]
        };
        this.userInfo = null;


    }


    componentWillMount() {
        HttpTool.setSpecialCodeEvent((code) => {
            if (code === -420) {
                CookieHelp.clearUserInfo();
                window.location.reload();
                // this.upView();
                return true;
            } else {
                return true;
            }
        });
    }


    upView(cb) {
        this.setState({
            upData: this.state.upData + 1,
        }, cb);
    }

    _logout() {
        this.logoutAction(() => {
            CookieHelp.clearUserInfo();
            this.upView();
            HttpTool.clearAuthHeader()
        })

    }

    /**
     * 登出
     */
    logoutAction(cb) {
        HttpTool.post(APILXD.logoutAdmin,
            (code, msg, json, option) => {
                cb();
            },
            (code, msg, option) => {
                cb();
            }, {}
        )
    }

    //尝试请求后台，判断是否已经登陆失效
    toRequestUserInfo(info) {
        if (!info || !info.id) {
            CookieHelp.clearUserInfo();
            this.upView();
            HttpTool.clearAuthHeader()
        }

        //如果已经登陆失效，则请求会返回420状态码，执行登出逻辑。
        HttpTool.post(APILXD.getAdminDetail, () => {
        }, () => {
        }, {id: info.id});
    }

    render() {
        //判断,是否登录
        this.userInfo = CookieHelp.getUserInfo();
        var main = null;

        if (!this.userInfo) {
            //没登录.别进
            main = <Login login={(userInfo, permission, isForget) => {
                CookieHelp.saveUserInfo(userInfo, isForget);
                HttpTool.setAuthHeader({
                    Authorization: userInfo.accessToken,
                    //os: "web_0.1.0"
                });

                this.setState({
                    permission: permission,
                    upData: this.state.upData + 1,
                }, () => {


                })
            }
            }/>;
        } else {
            this.toRequestUserInfo(this.userInfo.info);
            main = (
                <div className={css.main_mask}>
                    <div className={css.main_mask2}>
                        <Content className={css.content}>
                            <Index
                                permission={this.state.permission}
                                logout={() => this._logout()}
                                action={(obj) => {
                                    this.openTabObj = obj;
                                }}/>
                            {this.props.children}
                        </Content>
                    </div>
                </div>);
        }
        return (
            <div className={css.main}>
                {main}
            </div>
        );
    }
};

export default App;