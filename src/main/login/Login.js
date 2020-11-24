import React, {Component} from 'react';
import css from './Login.less';
import APILXD from '../../http/APILXD.js';
import md5 from 'md5';
import {message, Icon, Input, Button, Modal} from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import HttpTool from "../../tool/HttpTool";
import CookieHelp from "../../tool/CookieHelp";

class page extends Component {
    constructor(props) {
        super(props);
        let loginInfo =CookieHelp.getCookieInfo("loginInfo") ;
        if(!loginInfo){
            loginInfo= {};
        }else{
            loginInfo = JSON.parse(loginInfo)
        }
        this.state = {
            loading: false,
            upData: 0,
            usernames: loginInfo.username||"",
            passwords:"",
            isFocusCount: false,
            isFocusPwd: false,
            loginError:null,
        };


    }

    componentDidMount() {

    }

    showLoad(loading,cb) {
        this.setState({
            loading: loading,
        },cb);
    }

    upView() {
        this.setState({
            upData: this.state.upData + 1,
        });
    }

    username1(e) {
        this.setState({usernames: e.target.value, isFocusCount: true, loginError:null,});

    }

    password1(e) {
        this.setState({passwords: e.target.value, isFocusPwd: true,loginError:null,});
    }


    onKey(e){
        if(e.keyCode===13){
            this.handleClick(e)
        }

    }

    handleClick(e) {
        const passwordInput = this.refs.passwordInput;
        const usernameInput = this.refs.usernameInput;

            if(this.state.usernames.length === 0){
                usernameInput.focus();
                passwordInput.blur();
                this.setState({
                    isFocusCount:true
                });
                return
            }else if(this.state.passwords.length === 0){
                passwordInput.focus();
                usernameInput.blur();
                this.setState({
                    isFocusPwd:true
                });
                return
            }
        usernameInput.blur();
        passwordInput.blur();
        this.showLoad(true);
        e.preventDefault();


        let param ={
            name: this.state.usernames,
        }

        /**
         * 开发阶段 注释
         */
        HttpTool.post(APILXD.getRandSalt,
            (code, msg, json, option) => {
                param.passwd = md5(this.state.passwords);
                param.salt = json;

                this.login(param)

            },
            (code, msg, option) => {
                this.showLoad(false,()=>{
                    message.error(msg);
                });
            },param

        )

        //直接调用
        // this.login({})
    }
    login(param){
        /**
         * 开发阶段 注释
         */
        HttpTool.post(APILXD.login,
            (code, msg, json, option) => {
                let admin = json.admin;
                let info = {
                    id:admin.id,
                    name:admin.name,
                    addtime:admin.addtime,
                    logintime:admin.logintime,
                };
                let userInfo = {
                    account: param.name,
                    accessToken: json.token,
                    info:info,
                };

                let loginInfo={
                    username: param.name,
                };
                if(window.localStorage){
                    window.localStorage.setItem('permission',admin.permission);
                }

                CookieHelp.saveCookieInfo("loginInfo",loginInfo);
                let permission = JSON.parse(admin.permission);
                if (this.props.login) {
                    this.props.login(userInfo,permission);
                };
            },
            (code, msg, option) => {
                this.showLoad(false,()=>{
                    message.error(msg);
                });
            },param
        )
    }

    isShowLoading() {
        let main = null;
        if (this.state.loading) {
            main = (
                <div>
                    <div className={css.loading} style={{opacity: 0.5}}>
                    </div>
                    <img className={css.loading_img} src={require('../../images/login_loading.png')}
                    />
                </div>
            )
        } else {
            main = (null)
        }
        return main;
    }

    render() {
        return (
            <div
                style={{
                    backgroundImage:'url('+require('../../images/backgroundImg.jpg')+')'
                }}
                className={css.main}
            >

                <div>
                    <canvas ref={"_canvas"}/>
                </div>
                <div className={css.bottom}>
                </div>
                <div className={css.big_box}>
                    <div className={css.title}>后台管理平台</div>
                    <div className={css.box}>
                        <div>
                            <h2 className={css.h2}>· 帐户密码登录 ·</h2>
                            <div>
                            <Input
                                ref="usernameInput"
                                className={css.input}
                                placeholder="请输入账号"
                                defaultValue={this.state.usernames?this.state.usernames:""}
                                onChange={this.username1.bind(this)}
                                onKeyDown={this.onKey.bind(this)}
                                addonBefore={<UserOutlined className={css.icon}/>}
                                maxLength={'50'}
                            />
                            </div>
                            <div className={css.block}></div>
                            <Input
                                ref="passwordInput"
                                type="password"
                                className={css.input1}
                                placeholder="请输入密码"
                                onChange={this.password1.bind(this)}
                                onKeyDown={this.onKey.bind(this)}
                                addonBefore={<KeyOutlined  className={css.icon}/>}
                                maxLength={'32'}
                            />
                            <div
                                className={css.forgetPassword}
                                onClick={()=>{
                                    Modal.info({
                                        title:'提示',
                                        okText:'确定',
                                        content:<div className={css.contactText}>请联系管理员</div>,
                                    });
                                }}
                            >
                                忘记密码
                            </div>
                            <Button size={"large"} className={css.btn} onClick={this.handleClick.bind(this)}>
                                登录
                            </Button>
                        </div>
                    </div>

                </div>

                {this.isShowLoading()}
            </div>
        )
    }
}

export default page;