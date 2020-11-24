import React, {Component} from 'react';
import Radio from 'antd/lib/radio';
import 'antd/lib/radio/style';

let RadioGroup = Radio.Group;

/**
 * 单选模板
 */
class Index extends Component {
    constructor(props) {
        super(props);
    }

    date = (e) => {
        // console.log(e.target.value)
        this.props.verification(this.props.data, e.target.value)
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
                    <RadioGroup
                        {...this.props.option}
                        onChange={this.date}
                    >
                        {data.data ? data.data.map((obj, key) => {
                            obj.temp = this.getValueTypeObject(obj.value)
                            return <Radio value={obj.temp.value} key={key}>{obj.title}</Radio>
                        }) : null}
                    </RadioGroup> : <div>{data.option && data.option.defaultValue}</div>
                }

            </div>
        )
    }

}


export default  Index;