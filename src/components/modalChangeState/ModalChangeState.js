import React, {Component} from 'react';
import {Button,message} from 'antd';
import less from "./ModalChangeState.less";
import HttpTool from "../../tool/HttpTool";
import ModalConfig from "../../components/modalConfig/index";
import {ExclamationCircleOutlined} from "@ant-design/icons";

/**
 * 修改启用/禁用状态
 */
class ModalChangeState {
    constructor(props) {
    }


    getContent(option,props,apiConfig) {

        return (
            <div>
                <div>
                    <div className={less.contentText}>
                        <ExclamationCircleOutlined  className={less.icon}/>
                        <span>是否</span>
                        {
                            apiConfig.state
                                ?<span className={less.redText}>禁用</span>
                                :<span className={less.greenText}>启用</span>
                        }
                        <span>{apiConfig.content?apiConfig.content:'此项'}</span>
                        <span>？</span>
                    </div>
                    <div className={less.tipText}>{apiConfig.tip?apiConfig.tip:''}</div>
                </div>
                <div className={less.btnBox}>
                    {
                        option.closeTitle? <Button
                            size={'large'}
                            className={less.btn}
                            onClick={() => {
                                this.close();
                            }}
                        >
                            {option.closeTitle}
                        </Button>:null
                    }
                    {
                        option.okTitle?
                            <ButtonNet
                                ref={(ref)=>{
                                    this.buttonNet = ref;
                                }}
                                size={'large'}
                                type={'primary'}
                                onClick={() => {
                                    this.buttonNet.setLoading(true,()=>{
                                        this.doSubmit(apiConfig);
                                    })
                                }}
                            >
                                {option.okTitle}
                            </ButtonNet>
                            :null
                    }

                </div>
            </div>
        )
    }

    close(){
        ModalConfig.close();
    }

    show(option, props, apiConfig = {}) {


        ModalConfig.show(
            {
                maskClosable: true,
                ...option,
                width: "35%",
                footer: null,
            }
            , this.getContent(option,props,apiConfig)
        );
    }

    /**
     * 提交数据
     */
    doSubmit(apiConfig) {
        let exe = (state,msg)=>{
            this.buttonNet.setLoading(false,()=>{
                message[state](msg);

                if(state==="success"){
                    if(apiConfig.callBack){
                        apiConfig.callBack(state,msg);
                    }
                    this.close();

                }
            })
        };
        let successCB = (code, msg, json, option) => {
            exe("success",msg);
        };
        let failureCB = (code, msg, option) => {
            exe("error",msg);
        };

        HttpTool[apiConfig.apiType||"post"](apiConfig.url, successCB, failureCB, _.merge({}, apiConfig.otherParam))
    }


}

class ButtonNet extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading:false
        }
    }
    setLoading(loading,cb){
        this.setState({loading},cb);
    }
    render(){
        return (
            <Button
                {...this.props}
                loading={this.state.loading}
            >
                {this.props.children}
            </Button>
        );
    }
}


export default ModalChangeState;