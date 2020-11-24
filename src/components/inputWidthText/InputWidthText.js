import React, {Component} from 'react';
import ReactDOM from "react-dom";

import {InputNumber} from 'antd';

/**
 * 输入框，带前后文字
 */
class InputWidthText extends Component {
    constructor(props) {
        super(props);
    }
    _initDefaultValue(data){
        return data.option.defaultValue||undefined;
    }
    render(){
        return (
            <div ref={(ref)=>{this.cascaderBox = ref;}}>
                {
                    this.props.data.beforeText
                    ?   <span style={{paddingRight:'5px'}}>{this.props.data.beforeText}</span>
                    :   null
                }
                <InputNumber
                    style={{textAlign:'center'}}
                    getPopupContainer={()=>{
                        return ReactDOM.findDOMNode(this.cascaderBox);
                    }}
                    {...this.props.option}
                    options={this.props.data.data||[]}
                    onChange={(e)=>{
                        // log(e);
                        this.props.verification(this.props.data, e)
                    }
                    }
                />
                {
                    this.props.data.behindText
                        ?   <span style={{paddingLeft:'5px'}}>{this.props.data.behindText}</span>
                        :   null
                }
            </div>
        );
    }


}


export default InputWidthText;