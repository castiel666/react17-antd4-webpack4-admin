import React from 'react';
import less from './AccountManage.less';
import {Spin, Button, message, Row, Col, Modal, Tree} from 'antd';
import APILXD from '../../../http/APILXD.js';
import md5 from 'md5';
import HttpTool from "../../../tool/HttpTool";
import Layout from "../../../components/layout/index";
const ConfigData = require('../../leftMenu/PermissionConfig.js');
const TreeNode = Tree.TreeNode;

let treeData = ConfigData.treeData;


class AddAccount extends React.Component {
    constructor(props) {
        super(props);

        this.id = this.props.post.id;
        this.state = {
            loading: false,
            selected: [],
            defaultData: {},
            upDate: 0,
            ifRefresh: false,    //是否重置密码
        }
    }

    componentDidMount() {
        if (this.id) {
            this.loadData(this.id);
        }
    }

    render() {
        let data = this.state.defaultData;
        return (<div className={less.mainPage}>
            <Spin size={'large'} spinning={this.state.loading}>
                <div className={less.formContainer}>
                    <Layout
                        key={'layout' + this.state.upDate}
                        ref={(ref) => {
                            this.baseMsgLayout = ref;
                        }}
                        {
                            ...this.getConfig(data)
                        }
                    />
                    {
                        this.id
                            ? (<Row>
                                <Col span={24} offset={4}>
                                    <Button
                                        size={'large'}
                                        type={'primary'}
                                        onClick={() => {
                                            Modal.confirm({
                                                title: '提示',
                                                content: '重置密码为 123456 ？',
                                                onOk: () => {
                                                    let defaultData = this.state.defaultData;
                                                    defaultData.passwd = '123456';
                                                    this.setState({
                                                        defaultData: defaultData,
                                                        ifRefresh: true,
                                                        upDate: this.state.upDate + 1,
                                                    }, () => {
                                                        this.clickAddBtn();
                                                    });
                                                }
                                            })
                                        }}
                                    >重置密码</Button>
                                </Col>
                            </Row>)
                            : null
                    }
                    <Row>
                        <Col span={3} offset={1}>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                            <div className={less.label}>权限设定：</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={13} offset={2}>
                            <div className={less.treeBox}>
                                <Tree
                                    checkable={true}
                                    autoExpandParent={true}
                                    defaultExpandAll={true}
                                    checkedKeys={this.state.selected}
                                    onCheck={(selectedKeys, e) => {
                                        this.setState({
                                            selected: selectedKeys,
                                        })
                                    }}
                                >
                                    {this.renderTreeNodes(treeData)}
                                </Tree>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} offset={4}>
                            <Button
                                size={'large'}
                                className={less.submitBtn}
                                type={'primary'}
                                onClick={() => {
                                    this.clickAddBtn();
                                }}
                            >{this.id ? '确认编辑' : '创建完成'}</Button>
                            <Button
                                size={'large'}
                                className={less.cancelBtn}
                                onClick={() => {
                                    this.props.openTab(this.props.post.parent);
                                    this.props.closeTab(this.props.targetKey);
                                }}
                            >返回</Button>
                        </Col>
                    </Row>
                </div>
            </Spin>
        </div>)
    }


    //点击创建完成按钮
    clickAddBtn() {
        let option = this.baseMsgLayout.getLayoutValue(true);
        if (option.error) {
            message.warning('请完善表单信息');
            return;
        }
        if (this.state.selected.length <= 0) {
            message.warning('请设定权限');
            return;
        }
        let data = option.parameter;
        if (data.passwd !== data.checkword) {
            message.warning('两次密码输入不一致');
            return;
        }
        let powerResult = this.setPower(treeData, this.state.selected);

        let param = {
            name: data.name,
            permission: JSON.stringify(powerResult),
        };

        if (!this.id || this.state.ifRefresh) {
            //如果不是编辑，或是编辑，但重置了密码
            param.passwd = md5(data.passwd);
        }
        if (this.id) {
            param.id = this.id;
        }

        this.doSubmit(param);
    }

    //根据组件值设置权限树
    setPower(treeData, selected) {
        let newTree = [].concat(treeData);
        for (let obj of newTree) {
            if (!obj.hide) {
                for (let child of obj.children) {
                    if (selected.indexOf(child.key) != -1) {
                        child.permit = true;
                    } else {
                        child.permit = false;
                    }
                }
            }
        }
        return newTree;
    }

    //获取已选择的权限
    getPower(treeData) {
        if (!treeData || !treeData.length) {
            return [];
        }

        let result = [];
        for (let obj of treeData) {
            for (let child of obj.children) {
                if (child.permit) {
                    result.push(child.key)
                }
            }
        }

        return result;
    }

    //提交数据
    doSubmit(data) {
        let param = data;
        log(data);
        let successCB = (code, msg, json, option) => {
            this.setState({loading: false}, () => {
                message.success('操作成功');
            });
        };
        let failureCB = (code, msg) => {
            this.setState({loading: false}, () => {
                message.error(msg);
            });
        };

        this.setState({loading: true});
        let url = this.id ? APILXD.editAdmin : APILXD.addAdmin;
        HttpTool.post(url, successCB, failureCB, param);
    }

    //请求数据
    loadData(id) {
        if (!id) {
            message.error("缺少id");
            return
        }

        let param = {
            id: this.id,
        };
        let successCB = (code, msg, json, option) => {
            let permission = json && json.permission && JSON.parse(json.permission) || "";
            let sel = this.getPower(permission);
            this.setState({
                loading: false,
                defaultData: json,
                selected: sel,
                upDate: this.state.upDate + 1,
            });
        };
        let failureCB = (code, msg) => {
            this.setState({loading: false}, () => {
                message.error(msg);
            });
        };

        this.setState({loading: true}, () => {
            HttpTool.post(APILXD.getAdminDetail, successCB, failureCB, param);
        });
    }

    //产生树节点
    renderTreeNodes(data) {
        return data.map((item) => {
            if(item.hide){
                return null
            }
            if (item.children) {
                return (
                    <TreeNode className={less.big} title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item}/>;
        });
    }

    //配置
    getConfig(data) {
        let defaultOption = {
            type: "input",
            ver: true,
            reg: /^[a-zA-Z0-9]{6,12}$/,
            verMessage: "6-12位数字或英文字母",
            required: true,
        };
        return {
            colCount: 1,
            formItemLayout: {
                labelCol: {span: 4},
                wrapperCol: {span: 11, offset: 0},
            },
            parameterArr: [
                {
                    ...defaultOption,
                    field: "name",
                    name: "设置账号",
                    reg: /^[a-zA-Z0-9]{5,12}$/,
                    option: {
                        placeholder: '5-12位数字或英文字母',
                        maxLength: '12',
                        defaultValue: data && data.name || undefined,
                        disabled: this.id ? true : false,
                    }
                },
                {
                    ...defaultOption,
                    field: "passwd",
                    name: "设置密码",
                    option: {
                        placeholder: '6-12位数字或英文字母',
                        maxLength: '12',
                        type: 'password',
                        defaultValue: this.id ? (this.state.ifRefresh ? '123456' : 'xxxxxxxxxx') : undefined,
                        disabled: this.id ? true : false,
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
                        defaultValue: this.id ? (this.state.ifRefresh ? '123456' : 'xxxxxxxxxx') : undefined,
                        disabled: this.id ? true : false,
                    }
                },
            ],
        }
    }
}

export default AddAccount;