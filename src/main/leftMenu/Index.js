import React, {Component} from 'react';
import {Menu, message, Modal, Tooltip } from 'antd';
import UserMenu from '../login/UserMenu';
import css from './Index.less';
import Tab from '../power/Tab.js';
import {MenuUnfoldOutlined, MenuFoldOutlined} from "@ant-design/icons";
import APILXD from "../../http/APILXD";
import md5 from "md5";
import ModalBase from "../../components/modalBase/index";
//获取导航栏数据
import NavConfig from './NavConfig.js';

const SubMenu = Menu.SubMenu;
let MB = new ModalBase();

class page extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: false,
            mode: 'inline',
            title: "none",
            selectKey: ['0'],
            openKey: ['0'],
            leftData: [],
        };


        this.userMenu = [
            {
                title: '修改密码',
                actEvt: () => {
                    this.openUserPassWord();
                }
            },
            {
                title: '退出登录',
                actEvt: () => {
                    this.props.logout();
                }
            }
        ]
    }


    componentDidMount() {
        //得到左侧菜单
        let menuData = ___.checkPower(NavConfig, this.props.permission);
        let tree = ___.toTreeData(_.merge([], menuData), {
            rootIdValue: null,
            parentId: "parentId",
            curId: "id",
            children: "data",
        }, (obj) => {
            return {
                id: obj.id,
                title: obj.name,
                path: obj.url,
                index: obj.index,
                icon: obj.icon,
                icon_active: obj.icon_active,
                post: {
                    type: "list",
                    functions: obj.functions
                },
            }
        });
        //排序
        let resultTree = [];
        for (let obj of tree) {
            resultTree[obj.index] = obj;
        }
        this.loadLeftMenuData(resultTree);
    }

    /**
     * 加载左侧菜单显示
     */
    loadLeftMenuData(json) {
        this.setState(
            {
                leftData: json,
            }, () => {
                this.openTab({
                    //path: this.state.panes.isRight?"HomePage":"NoRightHomePage",
                    path: "IndexPage",
                    title: "首页",
                    closable: false, // false 不可关闭
                    post: null,
                })
            }
        );
    }


    toggleCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    onTabItemChange(actKey) {
        // pathArr is descent by submenu key
        let pathKey = !actKey ? '0' : (actKey.split('__')[1] !== 'undefined' ? actKey.split('__')[1] : '0');
        this.setState({
            selectKey: [pathKey],
            openKey: [pathKey.split('_')[0]]
        });
    }

    getItemView(data, un) {
        let viewS = [];
        for (let i in data) {
            let key = "" + un + "_" + i;
            let obj = data[i];
            if (obj.data && obj.data.length > 0) {
                viewS.push(
                    <div title={obj.title} key={key}>
                        {this.getItemView(obj.data, key)}
                    </div>
                )
            } else {
                viewS.push(
                    <Menu.Item key={key}
                               className={css.sider_sub_menu}
                    >{obj.title}</Menu.Item>
                )
            }

        }
        return viewS;
    }

    render() {
        let leftViewS = [],
            {collapsed, selectKey, openKey} = this.state;
        let leftData = this.state.leftData;
        for (let i in leftData) {
            let obj = leftData[i];
            leftViewS.push(
                <SubMenu
                    key={"" + i}
                    title={<div className={
                        selectKey[0].split('_').length > 1 && openKey == "" + i ?
                            css.submenu_cover_active :
                            css.submenu_cover}>
                        <img className={css.menu_icon} src={obj.icon}
                             alt=""/>
                        <img className={css.menu_icon_active}
                             src={obj.icon_active} alt=""/>
                        <span className="nav-text">
                            {obj.title}
                        </span></div>}
                    // icon={<MenuFoldOutlined/>}
                    // title={obj.title}
                >
                    {this.getItemView(obj.data, i)}
                </SubMenu>
            )
        }
        return (
            <div className={css.main}>
                <div className={!collapsed ? css.sider : css.sider_hide}>

                    <div className={collapsed ? css.logoLayout_hide : css.logoLayout}>
                        <div className={collapsed ? css.logo1 : css.logo2}
                             style={{backgroundImage: 'url(' + require('../../images/logo.png') + ')'}}>
                        </div>
                        {
                            collapsed
                                ? (<div className={css.littleBox}>
                                    <div className={css.littleLogo}
                                         style={{backgroundImage: 'url(' + require('../../images/logo.png') + ')'}}>
                                    </div>
                                    <br/>
                                    <div>管</div>
                                    <div>理</div>
                                </div>)
                                : (<div className={css.headTitle}>后台管理平台</div>)
                        }
                    </div>
                    <div className={!collapsed ? css.bottom : css.bottom_collapsed} onClick={() => {
                        this.toggleCollapsed()
                    }}>
                        <div className={css.icon_fold_left}>
                            {
                                collapsed
                                    ?<MenuUnfoldOutlined/>
                                    :<MenuFoldOutlined/>
                            }
                        </div>

                        {!collapsed ? <div className={css.icon_fold_right}>
                            收起
                        </div> : null}
                    </div>
                    <Menu
                          inlineIndent={40}
                          theme="dark"
                          style={{backgroundColor: "transparent"}}
                          mode={this.state.mode}
                          selectedKeys={selectKey}
                          defaultOpenKeys={openKey}
                          inlineCollapsed={this.state.collapsed}
                          onClick={(item) => {
                              //提取显示的对像
                              let arr = item.key.split("_");
                              let obj = {data: this.state.leftData};
                              for (let i in arr) {
                                  obj = obj.data[arr[i]];
                              }
                              obj['pathKey'] = item.key; // used for menu openkey
                              if (this.openTab) {
                                  this.openTab(obj);
                              } else {
                                  message.error("不可打开此项")
                              }
                          }}
                    >
                        {leftViewS}
                    </Menu>
                </div>
                <div className={!collapsed ? css.right : css.right_hide}>
                    <div>
                        <Tab openTab={(fun) => {
                            //打开页面
                            this.openTab = fun;
                        }}
                             action={(obj) => {
                                 if (this.props.action) {
                                     this.props.action(obj);
                                 }
                             }}
                             onTabItemChange={(e) => this.onTabItemChange(e)}
                        />
                    </div>
                    <div className={css.top}>
                        <div className={css.top_menu}>
                            <UserMenu panes={this.userMenu}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    openUserPassWord() {
        let addData = this.getPassData();
        MB.show(
            {
                title: "修改密码",
                okTitle: "保存",
                closeTitle: "取消",
            },
            addData.props
            ,
            {
                otherParam: {},
                url: APILXD.modfiyPasswd,
                noMessage: true,
                beforeSubmit: (param) => {
                    if (param.newpasswd != param.checkword) {
                        message.warning('新密码两次输入不一致');
                        return false;
                    }
                    let result = true;
                    //加密
                    param.oldpasswd = md5(param.oldpasswd);
                    param.newpasswd = md5(param.newpasswd);

                    return result;
                },
                callBack: (state, msg) => {
                    //添加成功回调
                    if (state == 'success') {
                        Modal.success({
                            title: '提示',
                            content: '修改成功，请重新登录',
                            onOk: () => {
                                this.props.logout()
                            }
                        });
                    } else {
                        message.error(msg);
                    }
                }
            });
    }


    /**
     * 新增
     * @returns {{colCount: number, formItemLayout: {labelCol: {span: number}, wrapperCol: {span: number, offset: number}}, parameterArr: *[]}}
     */
    getPassData() {
        let defaultOption = {
            type: "input",
            ver: true,
            reg: /^[a-zA-Z0-9]{6,12}$/,
            verMessage: "6-12位数字或英文字母",
            required: true,
        };
        let props = {
            colCount: 1,
            formItemLayout: {
                labelCol: {span: 5},
                wrapperCol: {span: 6, offset: 0},
            },
            parameterArr: [
                {
                    ...defaultOption,
                    field: "oldpasswd",
                    name: "旧密码",
                    option: {
                        placeholder: '请输入旧密码',
                        maxLength: '12',
                        type: 'password',
                    }
                },
                {
                    ...defaultOption,
                    field: "newpasswd",
                    name: "新密码",
                    option: {
                        placeholder: '6-12位数字或英文字母',
                        maxLength: '12',
                        type: 'password',
                    }
                },
                {
                    ...defaultOption,
                    field: "checkword",
                    name: "确认密码",
                    verMessage: "请核对密码",
                    option: {
                        placeholder: '再次输入密码',
                        maxLength: '12',
                        type: 'password',
                    }
                },
            ],
        };
        return {
            props,
            otherParam: null
        }
    }
}

export default page;