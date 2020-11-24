import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';
import HttpTool from "../../../tool/HttpTool";

const Option = Select.Option;

/**
 * 输入框模板
 *
 * 默认值写法
 * 当用于selectTyle：value时
 otpion.defaultValue:{
                            key:"这是data【0】.value值",
                             value:"2222"

                        }
 * 当用于selectTyle：title时
 otpion.defaultValue:{
                            key:这是data【0】.value值",
                             title:"这是显示值"

                        }
 */
class LayoutSelect extends Component {
    constructor(props) {
        super(props);

        //发送都请求次数
        this.apiAction = 0;
    }

    componentDidMount() {
        let {data} = this.props;
        if (data.url) {
            HttpTool.post(data.url,
                (code, msg, json, option) => {
                    data.data = json
                }, (code, msg, option) => {

                }, {});
        }
    }

    _initDefaultValue(data) {
        return data.option.defaultValue[data.selectType] != undefined ? data.option.defaultValue[data.selectType] : data.option.defaultValue;
    }

    data = (value) => {
        let param = value && value.replace(/(^\s*)|(\s*$)/g, "") || null;
        if (!param) {
            return;
        }

        let {data} = this.props;

        //排序+1，记录本次请求排序
        let currAction = ++this.apiAction;

        if (data.url) {
            HttpTool.post(data.url,
                (code, msg, json, option) => {

                    if (currAction < this.apiAction) {
                        return;
                    }

                    data.data = json
                }, (code, msg, option) => {

                }, {name: param});
        }

    }

    render() {
        let {data} = this.props;
        return (<div ref={(ref)=>{this.selectBox = ref;}}>
                {(data.purpose == "edit" || !data.purpose) ?
                    <Select
                        getPopupContainer={()=>{
                            return ReactDOM.findDOMNode(this.selectBox);
                        }}
                        labelInValue={true}
                        {...this.props.option}
                        onSearch={this.data}
                        onChange={(e) => {

                            if (data.selectType === "value") {
                                //value是唯一值，拿到value对应的类型，进行反转
                                for (let {temp} of data.data) {
                                    if (temp.value === e.key) {
                                        data.resultValue = this.formatValueType(temp.type, temp.value);
                                        break;
                                    }
                                }

                            } else {
                                data.resultValue = e.label;
                            }
                            this.props.verification(data, data.resultValue);


                        }}
                    >
                        {data.data ? data.data.map((obj, key) => {
                            obj.temp = this.getValueTypeObject(obj.value)
                            return <Option value={obj.temp.value} key={key}>{obj.title}</Option>
                        }) : null}
                    </Select> : <div>
                        {this.sortOut()}
                    </div>
                }

            </div>

        );
    }

    sortOut = () => {
        let {data} = this.props;
        let str = ''
        if (data.option && data.option.defaultValue) {
            //此处，在展示详情的时候因该直接显示title的值即可，不做判断
            str = data.option.defaultValue.title || data.option.defaultValue.value
            // if (data.selectType == "title") {
            //     str = data.option.defaultValue.title
            // } else {
            //     str = data.option.defaultValue.value
            // }
        }
        return str
    }

    getValueTypeObject(value) {
        let type = undefined;
        if (!value && typeof(value) != "undefined" && value != 0) {
            type = "null";
        } else {
            type = typeof(value);
        }
        return {
            type: type,
            value: type === "object" ? JSON.stringify(value) : value.toString()
        }

    }

    formatValueType(type, value) {
        // console.log("看看返回的是个啥")
        // console.log(type)
        // console.log(value)
        switch (type) {
            case "boolean":
                return value === "true";
            case "number":
                return new Number(value).valueOf();
            case "string":
                return new String(value).valueOf();
            case "object":
                return JSON.parse(value);
            case "undefined":
                return undefined;
            case "null":
                return null;
            default:
                return value;
        }
    }

    test(t) {
        let obj = this.getValueTypeObject(t)
        let c = this.formatValueType(obj.type, obj.value);
        return c;
    }


}

export default  LayoutSelect;