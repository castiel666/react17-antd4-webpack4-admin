import './___.js'
import React, {Component} from "react";
import ReactDOM from "react-dom";

import {BrowserRouter} from "react-router-dom";

import {message, ConfigProvider} from "antd";
import CookieHelp from "./tool/CookieHelp";
import HttpTool from "./tool/HttpTool";
import Config from './config/config';

import moment from 'moment';
import 'moment/locale/zh-cn';
import zhCN from 'antd/lib/locale/zh_CN';
import LXDHelp from "./main/help/LXDHelp";
import routes from "./routes.js";

moment.locale('zh-cn');

CookieHelp.userCookieKey = "TEST_ADMIN";

//修改此处，同时修改demon.config.js
HttpTool.authCookieName = "TEST_ADMIN_AUTH";
HttpTool.timeout = 60000;
HttpTool.setEncrypt(Config.publicKey);

message.config({
    top: window.screen.height / 3,
});

window["_NOENCRYPT"] = JSON.stringify(['/base-usercenter/']);
window["_CONCAT_API"] = '/api';

//加载alioss-sdk
LXDHelp.loadScript("/js/aliyun-oss-sdk-6.1.0.min.js");
// LXDHelp.loadScript("/js/jquery.min.js");

ReactDOM.render(
    <ConfigProvider
        locale={zhCN}
    >
        <BrowserRouter>
            {routes}
        </BrowserRouter>
    </ConfigProvider>,
    document.getElementById("root")
);
