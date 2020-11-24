import React, {Component} from 'react';
import less from './FormBox.less';
import {Button, Spin} from 'antd';
import {Modal} from "antd/lib/index";
import message from "antd/lib/message/index";
import Layout from "../../components/layout/index";
import HttpTool from "../../tool/HttpTool";

class FormBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: this.props.edit,
            loading: false,
        }
    }

    render() {
        return (
            <div className={less.container}>
                <Spin size={'large'} spinning={this.state.loading}>
                    <div className={less.header}>
                        <div className={less.title}>
                            {this.props.title}
                        </div>
                        {
                            this.state.edit
                                ? (
                                    <div>
                                        <Button
                                            loading={this.state.loading}
                                            className={less.submitBtn}
                                            type={'primary'}
                                            size={'large'}
                                            onClick={() => {
                                                this.clickBtn()
                                            }}
                                        >
                                            保存
                                        </Button>
                                        <Button
                                            type={'danger'}
                                            size={'large'}
                                            onClick={() => {
                                                this.setState({
                                                    edit: false
                                                })
                                            }}
                                        >
                                            取消
                                        </Button>
                                    </div>
                                )
                                : (
                                    <div>
                                        {
                                            this.props.couldEdit
                                                ? <Button
                                                    type={'primary'}
                                                    size={'large'}
                                                    onClick={() => {
                                                        this.setState({
                                                            edit: true
                                                        })
                                                    }}
                                                >
                                                    编辑
                                                </Button>
                                                : null
                                        }
                                    </div>

                                )
                        }
                    </div>

                    <Layout
                        key={this.state.edit}
                        ref={(ref) => {
                            this.layout = ref;
                        }}
                        {
                            ...this.getLayoutConfig()
                        }
                    />

                </Spin>
            </div>
        )
    }

    //对默认对配置项做 编辑 或 查看 对属性配置
    getLayoutConfig() {
        if (this.state.edit) {
            return this.props.editConfig;
        } else {
            return this.props.detailConfig;
        }
    }


    //点击保存
    clickBtn() {
        let obj = this.layout.getLayoutValue(true);
        log(obj);
        if (obj.error) {
            message.error("请填写正确的信息")
        } else {
            let value = obj.parameter;
            Modal.confirm({
                title: '提示',
                content: this.props.confirmContent,
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.doSubmit(value);
                }
            })
        }
    }


    //请求接口
    doSubmit(data) {
        let value = data || {};
        let param = _.merge(value, this.props.extraParam);

        let successCB = (code, msg, json, option) => {
            this.setState({
                loading: false,
                edit: false,
            }, () => {
                this.props.callback && this.props.callback();
            });
            message.success(msg);
        };

        let failureCB = (code, msg, option) => {
            this.setState({
                loading: false,
            });
            message.warning(msg);
        };


        //请求前的调用
        let ifContinue = true;
        if (this.props.beforeSubmit) {
            ifContinue = this.props.beforeSubmit(param);
        }

        if (ifContinue) {
            //执行请求
            this.setState({
                loading: true,
            });

            HttpTool[this.props.apiType](this.props.apiUrl, successCB, failureCB, param);
        } else {
            //不做操作
        }
    }
}

FormBox.defaultProps = {
    edit: false,
    couldEdit: true,
    editConfig: {},
    detailConfig: {},
    title: '标题',
    apiType: 'post',
    extraParam: {},
    confirmContent: '是否保存本次修改内容？',
};

export default FormBox;