import React, {Component} from 'react';

/** 输入框 **/
import Input from './lib/Input.js';
/**
 * 文本区域输入
 */
import TextArea from './lib/TextArea.js';
/**
 * 数字输入
 */
import InputNumber from './lib/InputNumber.js';
/**
 * 文本区域输入
 */
import Select from './lib/Select.js';
/**
 * 文本区域输入
 */
import SelectAll from './lib/SelectAll.js';
/**
 * 区域选择
 */
import AreaSelect from './lib/areaSelect/index.js';
/**
 * 文件选择
 */
import upFile from './lib/file/index.js';
/**
 * 时间区间选择
 */
import RangePicker from './lib/RangePicker.js';
/**
 * 时间选择
 */
import DatePicker from './lib/DatePicker.js';
/**
 * 单择
 */
import Radio from './lib/Radio.js';
/**
 * 多择
 */
import Checkbox from './lib/Checkbox.js';


export default  {
    getViewArr() {
        return [
            {
                type: ["input", "Input"],
                component: Input
            },
            {
                type: "TextArea",
                component: TextArea
            },
            {
                type: ["InputNumber", "inputNumber", "inputnumber"],
                component: InputNumber
            },
            {
                type: ["select", "Select"],
                component: Select
            },{
                type: ["selectAll", "SelectAll"],
                component: SelectAll
            },
            {
                type: ["area", "areaselect", "AreaSelect"],
                component: AreaSelect
            },
            {
                type: ["file", "File"],
                component: upFile
            }, {
                type: ["rangePicker", "RangePicker"],
                component: RangePicker
            }, {
                type: ["datePicker", "DatePicker"],
                component: DatePicker
            }, {
                type: ["radio", "Radio"],
                component: Radio
            }, {
                type: ["checkbox", "Checkbox"],
                component: Checkbox
            }
        ]
    }
};
