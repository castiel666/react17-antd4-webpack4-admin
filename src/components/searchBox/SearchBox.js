import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {Input, Button} from 'antd';
import less from './SearchBox.less';
import Layout from "../../components/layout/index";
import {DownOutlined, UpOutlined, CloseCircleOutlined} from "@ant-design/icons";

class SearchBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show:this.props.openSenior||false,
            searchLoading: false,       //是否正在搜索
            resetLoading: false,        //是否正在重置
            value: this.props.defaultValue || null,                //输入框的值
            reg:this.props.reg||null,   //正则
            passed:true,                  //正则验证状态
            showChange:false,
        };

        this.doSearch = this.doSearchForEnterBtn.bind(this);
    }

    componentDidMount(){
        setTimeout(()=>{
            let target = ReactDom.findDOMNode(this.searchBox);
            if (target.addEventListener) {
                target.addEventListener('keypress',this.doSearch,false)
            }
            else if(target.attachEvent){
                target.attachEvent('onkeypress',this.doSearch)
            }
        },0)
    }

    componentWillUnmount(){
        let target = ReactDom.findDOMNode(this.searchBox);
        if (target.removeEventListener) {
            target.removeEventListener('keypress',this.doSearch,false)
        }
        else if(target.detachEvent){
            target.detachEvent('onkeypress',this.doSearch)
        }
    }

    doSearchForEnterBtn(event){
        if(event.keyCode == "13"){
            this.searchCallBack();
        }
    }

    //从外部设置搜索框的值
    setSearchValue(keyword,parameterArr){
        this.setInputValue(keyword,()=>{
            this.searchAction.changeState("parameterArr",parameterArr,()=>{
                this.searchAction.changeState("resetCount",this.searchAction.state.resetCount + 1,()=>{
                    this.searchCallBack()
                })
            })
        });
    }

    searchCallBack(){
        if(!this.state.passed){
            return
        }

        let values = _.merge({
                keyword:this.state.value,
            }, this.searchAction?this.searchAction.getLayoutValue().parameter:{}
        );

        for(let key in values){
            if(values[key] == ''||values[key]==undefined){
                values[key] = null;
            }
        }

        //是否搜索
        let ifSearch = true;
        if(this.props.beforeSubmit){
            ifSearch = this.props.beforeSubmit(values);
        }

        ifSearch && this.props.searchAction&&this.props.searchAction(values,this.changeLoadingState.bind(this));
    }

    showSearch( cb) {

        this.setState({
            show:!this.state.show
        }, cb);
    }
    render() {
        return (
            <div ref={(ref)=>{this.searchBox = ref;}} className={less.container}>
                <Input
                    size={'large'}
                    maxLength={'50'}
                    className={this.props.hideInput?less.hiddenDiv:(this.state.passed?less.inputStyle:less.inputErr)}
                    placeholder={this.props.placeholder || ''}
                    disabled={this.state.searchLoading||this.state.resetLoading}
                    value={this.state.value}
                    onChange={(obj) => {
                        let value = obj.target.value;
                        if(this.state.reg){
                            this.setState({
                                passed:this.state.reg.test(value)
                            });
                        }
                        this.setInputValue(value);

                    }}
                    suffix={
                        <CloseCircleOutlined
                            className={this.state.value&&!this.state.searchLoading&&!this.state.resetLoading ? less.clearBtn : less.hidden}
                            style={{fontSize: 18}}
                            onClick={() => {
                                this.setState({
                                    passed:true,
                                    value:null,
                                });
                            }}
                        />
                    }
                />
                <Button
                    size={'large'}
                    type={'primary'}
                    className={less.searchBtn}
                    loading={this.state.searchLoading}
                    // disabled={this.state.resetLoading||!this.state.value||!this.state.passed}
                    // onPressEnter={() => {
                    //     this.searchCallBack();
                    // }}
                    onClick={() => {
                        this.searchCallBack();
                    }}
                >
                    搜索
                </Button>
                <Button
                    size={'large'}
                    className={less.resetBtn}
                    loading={this.state.resetLoading}
                    disabled={this.state.searchLoading}
                    onClick={()=>{
                        this.setState({
                            value:null,
                            passed:true,
                        });
                        this.props.reSetAction&&this.props.reSetAction(this.changeLoadingState.bind(this));

                        this.searchAction&&this.searchAction.resetLayoutValue()
                    }}
                >
                    重置
                </Button>

                {
                    this.props.seniorSearch&&!this.props.hideSeniorBtn? <Button
                        className={less.extraSearchBtn}
                        loading={this.state.loadAPI}
                        size={'large'}
                        type="primary"
                        onClick={() => {
                            this.showSearch(()=>{

                            })
                        }}
                    >
                        高级搜索
                        {
                            this.state.show
                                ?<UpOutlined />
                                :<DownOutlined />
                        }
                    </Button>:null
                }

                {
                    this.props.seniorSearch?
                        <div className={this.state.show?less.show:less.hidden}>
                            <Layout
                                ref={(ref)=>{
                                    this.searchAction = ref;
                                }}
                                {
                                    ...this.props.seniorSearch
                                }
                            />
                        </div>:null
                }


            </div>
        );
    }

    /**
     * 设置输入框值
     * @param value
     */
    setInputValue(value,cb) {
        this.setState({
            value: value || null
        },cb);
    }

    /**
     * 设置加载状态
     * @param type
     * @param state
     */
    changeLoadingState(type, state) {
        this.setState({
            [type]: state || false
        });
    }
}

SearchBox.defaultProps = {
    hideInput:false,
    openSenior:false,
    hideSeniorBtn:false,
}
export default SearchBox;