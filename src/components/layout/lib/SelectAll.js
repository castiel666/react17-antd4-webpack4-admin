import React, {Component} from 'react';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import 'antd/lib/select/style';
import HttpTool from "../../../tool/HttpTool";
import ReactDOM from "react-dom";

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
        this.state = {
            dataall: (this.props.data.option && this.props.data.option.defaultValue) ? this.props.data.option.defaultValue : [],
            data: this.props.data.data ? this.props.data.data : [],
            fetching: false,
        };

        //发送都请求次数
        this.apiAction = 0;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data.data})
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
        return data.option.defaultValue[data.selectType] ? data.option.defaultValue[data.selectType] : data.option.defaultValue;
    }

    datas = (value, option) => {
        let {data} = this.props;
        let {dataall} = this.state
        if (data.selectType === "all") {
            if (data.option && data.option.single) {
                //单选，替换当前值
                dataall[0] = option.props.original;
            } else {
                //多选，追加
                dataall.push(option.props.original)
            }

            this.props.verification(data, dataall);
            this.setState({dataall})
        }

    }

    fetchUser = (value) => {
        let {data} = this.props;

        let param = value && value.replace(/(^\s*)|(\s*$)/g, "") || null;
        if (!param) {
            return;
        }

        let obj = {}
        this.setState({data: [], fetching: true});

        //排序+1，记录本次请求排序
        let currAction = ++this.apiAction;
        if (data.realtime && data.realtime.url && data.realtime.name) {
            let action = data.realtime.apiType || 'post';
            if (!data.realtime.obj) {
                obj[data.realtime.name] = param
            } else {
                obj = data.realtime.obj
                obj[data.realtime.name] = param
            }
            HttpTool[action](data.realtime.url,
                (code, msg, json, option) => {
                    if (currAction < this.apiAction) {
                        return;
                    }
                    setTimeout(() => {
                        data.data = data.realtime.fillObject ? data.realtime.fillObject(json) : json
                        this.setState({
                            fetching: false,
                            data: data.realtime.fillObject ? data.realtime.fillObject(json) : json
                        }, () => {
                            console.log(this.state.data)
                        });
                    }, 100)
                }, (code, msg, option) => {

                }, obj);

        }

    }

    render() {
        let {fetching, data, dataall} = this.state
        return (<div>
                {(this.props.data.purpose == "edit" || !this.props.data.purpose) ?
                    <Select
                        // getPopupContainer={()=>{
                        //     return ReactDOM.findDOMNode(this.selectAllBox);
                        // }}
                        labelInValue={true}
                        mode="multiple"
                        notFoundContent={fetching ? <Spin size="small"/> : null}
                        // filterOption={false}
                        onSearch={this.fetchUser}
                        {...this.props.option}
                        onSelect={this.datas}
                        onChange={(e) => {
                            if (this.props.data.option && this.props.data.option.single) {
                                //单选，仅在onSelect时处理就可以了
                                return
                            }
                            let datall = []
                            // if (data.selectType === "all") {
                            //     //value是唯一值，拿到value对应的类型，进行反转
                            //     for (let {temp} of data.data) {
                            //         log('看看全部被值是啥玩意')
                            //         log(temp)
                            //         if (temp.value === e.key) {
                            //             // data.resultValue = this.formatValueType(temp.type, temp.value);
                            //             break;
                            //         }
                            //     }
                            // } else {
                            //     e.map((v, k) => {
                            //         data.selectType === "value" ? datall.push(v.key) : datall.push(v.label)
                            //     })
                            //     data.resultValue = datall;
                            // }

                            if (this.props.data.selectType !== "all") {
                                e.map((v, k) => {
                                    this.props.data.selectType == "value" ? datall.push(v.key) : datall.push(v.label)
                                })
                                this.props.data.resultValue = datall;
                                this.props.verification(this.props.data, datall);
                            } else {
                                for (let i = 0; i < e.length; i++) {
                                    for (let j = 0; j < dataall.length; j++) {
                                        if (e[i].label == dataall[j].title) {
                                            e[i] = dataall[j]
                                        }
                                    }
                                }
                                this.setState({
                                    dataall: e
                                }, () => {
                                    this.props.data.resultValue = e;
                                    this.props.verification(this.props.data, e);
                                })
                            }
                        }}
                    >

                        {data ? data.map((obj, key) => {
                            obj.temp = this.getValueTypeObject(obj.value)
                            return <Option original={obj} value={obj.temp.value} key={key}>{obj.title}</Option>
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
        let str = []
        if (data.option && data.option.defaultValue) {
            data.option.defaultValue.map((v, k) => {
                str.push(v.title)
            })
        }
        return str.join(", ")
    }

    getValueTypeObject(value) {
        let type = undefined;
        if (!value && typeof (value) != "undefined" && value != 0) {
            type = "null";
        } else {
            type = typeof (value);
        }
        return {
            type: type,
            value: type === "object" ? JSON.stringify(value) : value.toString()
        }

    }

    formatValueType(type, value) {
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

    // test(t) {
    //     let obj = this.getValueTypeObject(t)
    //     let c = this.formatValueType(obj.type, obj.value);
    //     return c;
    // }
    findObj(list, mark, value) {
        if (!list || !list.length || list.length <= 0 || !mark || !value) {
            return null;
        }

        for (let obj of list) {
            if (obj[mark] == value) {
                return obj;
            }
        }
    }

}

export default  LayoutSelect;