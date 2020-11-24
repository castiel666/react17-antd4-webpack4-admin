import React, {Component} from 'react';
import {Button,message} from 'antd';
import less from "./ModalList.less";
import ContentList from './ContentList.js';
import LXDHelp from '../../main/help/LXDHelp.js';
import ModalConfig from "../../components/modalConfig/index";

class ModalList{
    constructor(props) {
    }

    getContent(option,props,apiConfig) {
        return(
            <ModalContent
                option={option}
                props={props}
                apiConfig={apiConfig}
                close={()=>{this.close()}}
            />
        )
    }

    close(){
        ModalConfig.close();
    }

    show(option, props, apiConfig = {}) {
        ModalConfig.show(
            {
                maskClosable: false,
                ...option,
                width: "90%",
                footer: null,
            }
            , this.getContent(option,props,apiConfig),
            'modalListComponent'
        );
    }
}

class ModalContent extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading:false,
            recordList:this.props.props.defaultValue,
        }
    }

    render(){
        const {option,props} = this.props;
        log('ModalContent refresh');

        let keyList = this.getKeyList();

            return (
                <div>
                    <div>
                        <ContentList
                            post={{navPath:props.listConfig.navPath}}
                            selectedValue = {this.selectedValue.bind(this)}
                            listConfig = {
                                props.listConfig
                            }
                            defaultSelected={keyList}
                        />
                    </div>
                    <div className={less.btnBox}>
                        {
                            option.closeTitle? <Button
                                size={'large'}
                                className={less.btn}
                                onClick={() => {
                                    this.props.close('modalListComponent');
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
                                            this.doSubmit();
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

    //获取选中key值
    getKeyList(){
        let recordList = this.state.recordList;
        if(!recordList || !recordList.length || recordList.length<=0){
            return [];
        }
        let keyList = [];
        for(let obj of recordList){
            keyList.push(obj.id || obj.key);
        }

        return keyList;
    }

    //子页面数据
    selectedValue(keyList,recordList){
        //keyList是全的，recordList仅是当前页选中的，所以要对recordList做计算
        log(keyList);
        log(recordList);

        let currKeyList = this.getKeyList();
        let newKeyList = keyList;

        let currRecordList = this.state.recordList;
        let newRecordList = recordList;


        if(currKeyList.length == newKeyList.length){
            //基本不可能有这种情况，应该是非增即减
            return;
        }

        let resultRecordList = [];

        if(currKeyList.length > newKeyList.length){
            //减少，取出减去的key数组
            let desKeyList = [].concat(currKeyList);
            _.pullAll(desKeyList,newKeyList);

            resultRecordList = LXDHelp.drop(currRecordList,desKeyList,'id');
        }else{
            //增加，取出增加的key数组
            let addKeyList = [].concat(newKeyList);
            _.pullAll(addKeyList,currKeyList);

            resultRecordList = currRecordList;
            for(let obj of newRecordList){
                if(addKeyList.indexOf(obj.id)>=0){
                    //增加
                    resultRecordList.push(obj);
                }
            }
        }

        this.setState({
            recordList:resultRecordList,
        });
    }
    /**
     * 确定
     */
    doSubmit() {
        log('submit select')
        this.props.apiConfig.callBack &&  this.props.apiConfig.callBack('success',this.state.recordList);
        this.props.close('modalListComponent');
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


export default ModalList;