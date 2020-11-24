import React,{Component} from 'react';
import {Button,message} from 'antd';
import HttpTool from "../../tool/HttpTool";

class ExportTool extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading:false,
        }
    }

    render(){
        return(
            <Button
                {...this.props}
                loading={this.state.loading}
                onClick={()=>{
                    this.clickBtnAction();
                }}
            >
                {this.props.name}
            </Button>
        );
    }

    //改变loading
    changeLoadState(state,cb){
        this.setState({
            loading:state||false,
        },cb)
    }


    //点击按钮
    clickBtnAction(){
        let param = this.props.param||{};

        let successCB = (code, msg, json, option)=>{
            this.changeLoadState(false,()=>{
                //获得url,执行下载
                let url;
                if(json.domain && json.path){
                    url = json.domain + json.path
                }else{
                    url = json
                }
                this.doExport(url);
            });
        };

        let failureCB = (code, msg, option)=>{
            this.changeLoadState(false,()=>{this.props.callback && this.props.callback(false)});
            message.warning(msg);
        };

        this.changeLoadState(true,()=>{
            HttpTool[this.props.apiType](this.props.apiUrl,successCB,failureCB,param);
        });

    }

    //导出
    doExport(url){
        // alert(JSON.stringify(url))
        if(!url){
            message.error('无效的资源路径');
            return;
        }

        let form = document.createElement("form");
        document.body.appendChild(form);
        form.action = url;
        form.submit();

        // window.open(url);
        this.props.callback && this.props.callback(true);
    }

}

ExportTool.defaultProps = {
    apiType:'post',
    name:'导出'
};

export default ExportTool;