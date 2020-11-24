import React, {Component} from 'react';
import message from 'antd/lib/message';
import 'antd/lib/message/style';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import less from "./style/index.less";
import HttpTool from '../../tool/HttpTool';
import ModalConfig from "../modalConfig/index.js"
import Layout from '../layout/index.js';

/**
 * 添加、编辑业务模块
 */
class Index {
    constructor() {
    }


    getContent(option,props,apiConfig) {

        return (
            <div>
                <Layout
                    ref={(ref) => {
                        this.layoutAction = ref;
                    }}
                    {
                        ...props
                    }
                    load={({
                               loadAPI,
                               loadAPIError
                           }) => {

                    }}
                />
                <div className={less.btnBox}>
                    {this.base_getBottomLeft(apiConfig)}
                    {
                        option.closeTitle? <Button
                                size={'large'}
                                className={less.btn}
                                onClick={() => {
                                    this.close(option.modalId);
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
                                className={less.btn}
                                type={'primary'}
                                onClick={() => {
                                    let obj = this.layoutAction.getLayoutValue(true);
                                    if (obj.error) {
                                        //
                                        message.error("请填写正确的信息")
                                    } else {
                                        //禁用所有可输入值
                                        this.layoutAction.disableLayout(true, () => {
                                            this.base_disableLayout(true)
                                            this.buttonNet.setLoading(true,()=>{
                                                if(apiConfig.beforeSubmit){
                                                    //存在前置条件
                                                    let exe = ()=>{
                                                        this.doSubmit(_.merge(obj.parameter,this.base_getLayoutValue()), apiConfig,option.modalId);
                                                    }
                                                    let close = ()=>{
                                                        this.layoutAction.disableLayout(false, () => {
                                                            this.base_disableLayout(false);
                                                            this.buttonNet.setLoading(false,()=>{

                                                            })
                                                        });
                                                    }
                                                    let v = apiConfig.beforeSubmit(obj.parameter);
                                                    if(v === undefined){
                                                        return
                                                    }else
                                                    if(typeof (v) === "boolean"){
                                                        if(v){exe()}else{
                                                            close()
                                                        }
                                                    }else{
                                                        v.then(function(data) {
                                                            //go to
                                                            exe()
                                                        }).catch(function(err) {
                                                           //break
                                                            close()
                                                        });
                                                    }
                                                }else{
                                                    this.doSubmit(_.merge(obj.parameter,this.base_getLayoutValue()), apiConfig,option.modalId);
                                                }

                                            })

                                        });
                                    }
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

    base_getBottomLeft(apiConfig){
        return null;
    }
    base_disableLayout(action){

    }
    base_getLayoutValue(){

        return null;
    }

    close(id){
        ModalConfig.close(id);
    }

    show(option, props, apiConfig = {}) {


        ModalConfig.show(
            {
                maskClosable: false,
                ...option,
                width: "60%",
                footer: null,
            }
            , this.getContent(option,props,apiConfig),
            option.modalId
        );
    }

    /**
     * 提交数据
     * @param values
     */
    doSubmit(values, apiConfig,modalId) {

        let param = _.merge(values, apiConfig.otherParam)
        let exe = (state,msg,data)=>{
            this.layoutAction.disableLayout(false, () => {
                this.base_disableLayout(false);
                this.buttonNet.setLoading(false,()=>{
                    !apiConfig.noMessage&&message[state](msg);

                    if(state==="success"){
                        if(apiConfig.callBack){
                            apiConfig.callBack(state,msg,data,param);
                        }
                        this.close(modalId);
                    }else{
                        if(apiConfig.callBack){
                            apiConfig.callBack(state,msg,data,param);
                        }
                    }
                })
            });
        }
        let successCB = (code, msg, json, option) => {
            exe("success",msg,json);
        };
        let failureCB = (code, msg, option) => {
            exe("error",msg);
        };

        HttpTool[apiConfig.apiType||"post"](apiConfig.url, successCB, failureCB,param,apiConfig['reqOptions'] )
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


export default  Index;