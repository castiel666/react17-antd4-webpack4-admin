import React, {Component} from 'react';
import Checkbox from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style';

let CheckboxGroup = Checkbox.Group;

/**
 * 单选模板
 */
class Index extends Component {
    constructor(props) {
        super(props);
    }

    date = (checkedValues) => {
        this.props.verification(this.props.data, checkedValues)
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

    render() {
        let {data} = this.props;
        return (
            <div>
                {(data.purpose == "edit" || !data.purpose) ?
                    <CheckboxGroup
                        {...this.props.option}
                        options={data.data ? data.data.map((obj, key) => {
                            obj.temp = this.getValueTypeObject(obj.value)
                            return {label: obj.title, value: obj.temp.value}
                        }) : []}
                        onChange={this.date}
                    /> : <div>{data.option && data.option.defaultValue.join(" ")}</div>
                }
            </div>
        )
    }


}


export default  Index;