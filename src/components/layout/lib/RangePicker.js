import React, {Component} from 'react';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style';
import moment from "moment"
import ReactDOM from "react-dom";

let RangePicker = DatePicker.RangePicker;

/**
 * 日期选择模板
 */
class Index extends Component {
    constructor(props) {
        super(props);
    }

    date = (value, dateString) => {
        this.props.verification(this.props.data, dateString)
    }

    render() {
        let {data} = this.props;

        return (
            <div ref={(ref)=>{this.RangePickerBox = ref;}}>
                {(data.purpose == "edit" || !data.purpose) ?
                    <RangePicker
                        size={"middle"}
                        getCalendarContainer={()=>{
                            return ReactDOM.findDOMNode(this.RangePickerBox);
                        }
                        }
                        {...this.props.option}
                        onChange={this.date}
                    /> :
                    <div>{data.option && data.option.defaultValue && moment(data.option.defaultValue[0]).format("YYYY-MM-DD") + "~" + moment(data.option.defaultValue[1]).format("YYYY-MM-DD")}</div>
                }

            </div>
        )
    }


}


export default  Index;