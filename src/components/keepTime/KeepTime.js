import React, {Component} from 'react';
import ReactDOM from "react-dom";

import {InputNumber} from 'antd';

/**
 * 持续时间输入框，天，小时，分
 */
class KeepTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
        }
    }
    _initDefaultValue(data){
        this.setState({
            data:data.option.defaultValue
        });
        return data.option.defaultValue||undefined;
    }
    render(){
        return (
            <div ref={(ref)=>{this.cascaderBox01 = ref;}}>
                <InputNumber
                    value={this.state.data[0]}
                    style={{textAlign:'center'}}
                    getPopupContainer={()=>{
                        return ReactDOM.findDOMNode(this.cascaderBox01);
                    }}
                    precision={0}
                    {...this.props.option}
                    options={this.props.data.data||[]}
                    onChange={(e)=>{
                        // log(e);
                        this.valueChange(0,e);
                    }
                    }
                />
                {
                    this.props.data.behindText01
                        ?   <span style={{paddingLeft:'2px',paddingRight:'30px'}}>{this.props.data.behindText01}</span>
                        :   null
                }
                <InputNumber
                    value={this.state.data[1]}
                    style={{textAlign:'center'}}
                    getPopupContainer={()=>{
                        return ReactDOM.findDOMNode(this.cascaderBox02);
                    }}
                    precision={0}
                    {...this.props.option}
                    options={this.props.data.data||[]}
                    onChange={(e)=>{
                        // log(e);
                        this.valueChange(1,e);
                    }
                    }
                />
                {
                    this.props.data.behindText02
                        ?   <span style={{paddingLeft:'2px',paddingRight:'30px'}}>{this.props.data.behindText02}</span>
                        :   null
                }
                <InputNumber
                    value={this.state.data[2]}
                    style={{textAlign:'center'}}
                    getPopupContainer={()=>{
                        return ReactDOM.findDOMNode(this.cascaderBox03);
                    }}
                    precision={3}
                    {...this.props.option}
                    options={this.props.data.data||[]}
                    onChange={(e)=>{
                        // log(e);
                        this.valueChange(2,e);
                    }
                    }
                />
                {
                    this.props.data.behindText03
                        ?   <span style={{paddingLeft:'2px',paddingRight:'30px'}}>{this.props.data.behindText03}</span>
                        :   null
                }
            </div>
        );
    }

    valueChange(num,e){
        let data = this.state.data;
        data[num] = e;
        this.setState({
            data:data,
        },()=>{
            this.props.verification(this.props.data,this.state.data)
        })
    }

}


export default KeepTime;