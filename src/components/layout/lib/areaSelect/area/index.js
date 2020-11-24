import React, {Component} from 'react';
import Select from 'antd/lib/select';
import 'antd/lib/select/style';
import message from 'antd/lib/message';
import 'antd/lib/message/style';
import HttpTool from "../../../../../tool/HttpTool";
import less from "./style/index.less";
const Option = Select.Option;
class Index extends Component {
    constructor(props) {
        super(props);


        //获取默认值
        this.initData = this.props.defaultValue;
        let countryValue = this.initData.countryId ? {
                id: this.initData.countryId,
                name: this.initData.country
            } : undefined;
        let provinceValue = countryValue&&(this.initData.provinceId ? {
                id: this.initData.provinceId,
                name: this.initData.province
            } : undefined);
        let cityValue = countryValue&&provinceValue&&(this.initData.cityId ? {id: this.initData.cityId, name: this.initData.city} : undefined);
        let countyValue = countryValue&&provinceValue&&cityValue&&(this.initData.countyId ? {id: this.initData.countyId, name: this.initData.county} : undefined);


        //配置状态机
        this.state = {
            countrySel: true,        //国家选框是否可选
            provinceSel: provinceValue ? true : false,      //省/区
            citySel: cityValue ? true : false,          //城市
            countySel: countyValue ? true : false,      //区县

            countryData: [],        //国家下拉数据
            provinceData: [],
            cityData: [],
            countyData: [],

            //已经选择的数据
            countryValue: countryValue,
            provinceValue: provinceValue,
            cityValue: cityValue,
            countyValue: countyValue,

            upDate: 0,
            lv: parseInt(this.props.lv),      //层级

            countryDisable: this.props.countryDisable,   //设置某一栏目禁用
            provinceDisable: this.props.provinceDisable,
            cityDisable: this.props.cityDisable,
            countyDisable: this.props.countyDisable,
        };

        //记录每次编辑的数据
        this.param = {
            countryId: this.initData.countryId ? this.initData.countryId : undefined,
            country: this.initData.country ? this.initData.country : undefined,
            provinceId: this.initData.provinceId ? this.initData.provinceId : undefined,
            province: this.initData.province ? this.initData.province : undefined,
            cityId: this.initData.cityId ? this.initData.cityId : undefined,
            city: this.initData.city ? this.initData.city : undefined,
            countyId: this.initData.countyId ? this.initData.countyId : undefined,
            county: this.initData.county ? this.initData.county : undefined,
        };

        //默认排序和字段名
        this.itemList = ['country', 'province', 'city', 'county'];

        this.configList = [
            {
                typeName:'country',
                placeholder:'国家',
            },
            {
                typeName:'province',
                placeholder:'省/州',
            },
            {
                typeName:'city',
                placeholder:'城市',
            },
            {
                typeName:'county',
                placeholder:'区/县',
            },
        ]

    }

    componentDidMount() {
        this.getSelectOptionData('country');

        //如果有默认值，是编辑，则加载所有下拉
        this.initData.countryId && this.getSelectOptionData('province', this.initData.countryId);
        this.initData.provinceId && this.getSelectOptionData('city', this.initData.provinceId);
        this.initData.cityId && this.getSelectOptionData('county', this.initData.cityId);
    }

    //改变某个选框的可选状态
    changeSelectState(type, state) {
        this.setState({
            [type + 'Sel']: state || false,
        })
    }

    //改变某个选框的值
    changeValue(type, obj) {
        let index = this.itemList.indexOf(type);
        let nearType = this.itemList[index + 1];
        let middleType = this.itemList[index + 2];
        let farType = this.itemList[index + 3];

        this.setState({
            [type + 'Value']: obj || undefined,
            [nearType + 'Value']: undefined,
            [middleType + 'Value']: undefined,
            [farType + 'Value']: undefined,

            [nearType + 'Sel']: true,
            [middleType + 'Sel']: false,
            [farType + 'Sel']: false,
        }, () => {
            this.valueChangeCB();
        })
    }

    //值改变的回调，参数为选择的数据 obj
    valueChangeCB() {
        let {countryValue, provinceValue, cityValue, countyValue} = this.state;
        this.param = {
            countryId: countryValue ? countryValue.id : undefined,
            country: countryValue ? countryValue.name : undefined,
            provinceId: provinceValue ? provinceValue.id : undefined,
            province: provinceValue ? provinceValue.name : undefined,
            cityId: cityValue ? cityValue.id : undefined,
            city: cityValue ? cityValue.name : undefined,
            countyId: countyValue ? countyValue.id : undefined,
            county: countyValue ? countyValue.name : undefined,
        };

        this.props.onChange && this.props.onChange(this.param);
    }

    //验证输入
    verValue(config) {
        // log(config);
        // log(!config||!config.required);
        if(!config||!config.required){
            //如果是非必填的，直接返回true,验证通过
            return true;
        }
        let {countryValue, provinceValue, cityValue, countyValue, lv} = this.state;

        let country = countryValue ? true : false;
        let province = provinceValue ? true : false;
        let city = cityValue ? true : false;
        let county = countyValue ? true : false;

        let state = false;
        switch (lv) {
            case 1:
                state = country;
                break;
            case 2:
                state = country && province;
                break;
            case 3:
                state = country && province && city;
                break;
            case 4:
                state = country && province && city && county;
                break;
            default:
                break;
        }

        return state;
    }

    //配置某个选框的下拉数据
    initSelectOptions(type, data) {
        this.setState({
            [type + 'Data']: data || [],
            [type + 'Sel']: true,
        })
    }

    render() {
        return (
            <div className={less.container}>
                {this.getItem(this.configList[0])}
                <span>-</span>
                {this.getItem(this.configList[1])}
                <span>-</span>
                {this.getItem(this.configList[2])}
                <div
                    className={
                        (this.props.lv >= 4 && this.state.countyData.length > 0)
                            ? less.inlineBlock
                            : less.hidden
                    }
                >
                    <span>-</span>
                    {this.getItem(this.configList[3])}
                </div>
            </div>
        );
    }

    //渲染下拉选项
    getOptions(items) {
        let view = [];
        for (let key in items) {
            view.push(
                <Option
                    key={'key' + key}
                    value={items[key].id}
                >
                    {items[key].name}
                </Option>
            );
        }

        return view;
    }


    /**
     *  请求数据
     */
    getSelectOptionData(type, id) {
        //传入id,查子节点；不传id,查最顶层数据
        if (!type) {
            return;
        }

        let param = {};
        if (id) {
            param.id = id;
        }

        let successCB = (code, msg, json, option) => {
            this.initSelectOptions(type, json);
        };
        let failureCB = (code, msg, option) => {
            message.warning(msg);
        };

        let apiUrl = id ? "/base-basedata/dataapi/areas/get/children" : "/base-basedata/dataapi/areas/query";

        HttpTool.post(apiUrl, successCB, failureCB, param)
    }

    /**
     * 解析配置返回选框
     * @param config
     */
    getItem(config) {
        let typeName = config.typeName;
        let index = this.itemList.indexOf(typeName);
        let nextTypeName = this.itemList[index + 1];

        return (
            <Select
                value={this.state[typeName+'Value'] ? this.state[typeName+'Value'].id : undefined}
                disabled={this.props.disabled || !this.state[typeName+'Sel']}
                showSearch
                style={{width: 70}}
                placeholder={config.placeholder}
                optionFilterProp="children"
                onSelect={(value, obj) => {
                    if (this.state[typeName+'Value'] && value == this.state[typeName+'Value'].id) {
                        return;
                    }
                    let item = {
                        id: value,
                        name: obj.props.children,
                    };
                    this.changeValue(typeName, item);
                    this.getSelectOptionData(nextTypeName, value);
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {this.getOptions(this.state[typeName+'Data'])}
            </Select>
        );
    }
}


Index.defaultProps = {
    lv: 4,
    disabled:false,
    countryDisable: false,
    provinceDisable: false,
    cityDisable: false,
    countyDisable: false,
    defaultValue: {},
};

export default  Index;