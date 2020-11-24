import axios from "axios";
import _ from "lodash";
import Safe from "./Safe.js";
import CookieHelp from "./CookieHelp";

let localSafe = null;
let spEvtCb = null;
let un_id = "";
let os = "web_0.0.1";
let authCookieName = "_at"; // default Authorize Cookie Name
let authHeader = JSON.parse(CookieHelp.getCookieInfo(authCookieName) || "{}");

let typeEnum = {
    POST: "post",
    GET: "get",
    PUT: "put",
    DELETE: "delete"
};

let HttpTool = {
    timeout:11000,
    authCookieName:"_at",
    setOS(val) {
        os = val;
    },

    /**
     * set auth header
     * @param val authorize header object
     * @param cookieName(optional) storage cookie name
     */
    setAuthHeader(val, cookieName) {
        let authCookie = null;
        if (cookieName) {
            CookieHelp.saveCookieInfo(cookieName, val);
        } else {
            CookieHelp.saveCookieInfo(HttpTool.authCookieName, val);
        }
        authHeader = val;
    },

    setEncrypt(key) {
        localSafe = new Safe(key);
    },

    setSpecialCodeEvent(cb) {
        spEvtCb = code => {
            if (typeof cb === "function") {
                return cb(code);
            } else {
                return true; // true means continue to normal steps;
            }
        };
    },

    clearOS() {
        os = "web_0.0.1";
    },

    clearAuthHeader(cookieName) {
        let authCookie = null;
        if (cookieName) {
            CookieHelp.saveCookieInfo(cookieName, CookieHelp.clearFlag, 0);
        } else {
            CookieHelp.saveCookieInfo(HttpTool.authCookieName, CookieHelp.clearFlag, 0);
        }
        authHeader = null;
    },

    clearEncrypt() {
        localSafe = null;
    },

    clearSpecialCodeEvent() {
        spEvtCb = null;
    },

    /**
     *
     * @param key
     * @param param _开始参数,为不用参数
     * @returns {{key: (string|*|WordArray), data: *}}
     */
    formatBody(key, param = {}) {
        //localSafe.AESDecrypt(key,a)

        //如何参数中存在token参数,参数中的token提取,并优先于用户缓存

        // let token = "";
        // if (param && param._token) {
        // 	//清除缓用参数
        // 	token = param._token;
        // 	delete param._token;
        // } else {
        // 	let user = Storage.getUserInfo() || {};
        // 	token = user.token ? user.token.accessToken || "" : "";
        // }

        return {
            key: localSafe.encryptForRSA(key),
            data: localSafe.AESEncryption(
                key,
                JSON.stringify({
                    os: os + un_id,
                    param: param
                })
            )
        };
    },

    formatParamsTools(params) {
        let paramsBody = "";
        let i = 0;
        for (let key in params) {
            let v = params[key];
            if (v === undefined) {
                continue;
            }
            paramsBody += (i === 0 ? "" : "&") + (key + "=" + encodeURIComponent(v));
            ++i;
        }
        return paramsBody;
    },

    clearParam(param = {}) {
        if (param) {
            delete param.navigator;
            delete param.callBack;
            //POST请求,用来跨域
        }
    },
    removeEmpty(obj) {
        if (typeof obj === "object") {
            for (let key in obj) {
                //判断是否为NULL
                // log("obj"+key+":"+obj[key])
                if (obj[key] === undefined || obj[key] === null) {
                    obj[key] = "";
                    // log("修改"+key+":"+obj[key])
                } else {
                    HttpTool.removeEmpty(obj[key]);
                }
            }
        } else if (HttpTool.isArray(obj)) {
            for (let v of obj) {
                HttpTool.removeEmpty(v);
            }
        } else {
            //其他类型
        }
        return obj;
    },
    isArray(object) {
        return object && typeof object === "object" && Array == object.constructor;
    },
    randomString(len) {
        len = len || 32;
        var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = "";
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    changeEncryptOpt(url, other, noEncryptArr) {
        if (!url) {
            return other;
        }
        // url is a String
        if (noEncryptArr instanceof Array) {
            for (let value of noEncryptArr) {
                if (url.slice(0, value.length) === value) {
                    other["safe"] = false;
                    break;
                }
            }
        }
        return other;
    },
    getRequestHeader(other) {
        let authHeader = JSON.parse(CookieHelp.getCookieInfo(HttpTool.authCookieName) || "{}");
        return _.merge({}, authHeader, {
            "Content-Type": other.contentType,
            "TimeStrForEachRequest":Date.now(),
            os
        });
        // return authHeader
        //     ? _.merge({}, authHeader, {
        //         "Content-Type": other.contentType,
        //         os
        //     })
        //     : {
        //         "Content-Type": other.contentType,
        //         os
        //     };
    }
};

// post: (url, successCallback, failCallback, param, other) => {
// 	request('post', url, successCallback, failCallback, param, other)
// },
HttpTool["init"] = function init(options) {
    if (options) {
        Object.keys(options).forEach(val => {
            switch (val) {
                case "authCookieName":
                    let cookieVal = JSON.parse(
                        CookieHelp.getCookieInfo(options[val]) || "{}"
                    );
                    HttpTool.setAuthHeader(cookieVal, options[val]);
                    break;
                case "os":
                    HttpTool.setOS(options[val]);
                    break;
                case "safeKey":
                    HttpTool.setEncrypt(options[val]);
                    break;
            }
        });
    }
};

/**
 *
 * @param reqType 请求类型 put/get/post/delete
 * @param url 请求URL
 * @param successCallback 成功返回:包含 code, message, json, option
 * @param failCallback 失败返回:code, message, option
 * @param param 请求参数 例:{id:1}
 * @param other 其他参数  {safa:booble类型 true/加密(默认) false/不加密}
 */
function mainReq(reqType, url, successCallback, failCallback, param, other) {
    //option 参数必须是对象,里面包括 (type 请求方式,url 请求路径,param 请求参数)

    // if (process.env.NODE_ENV === 'development') {
    // 	console.warn('You are in Development Mode');
    // }

    // if (!other) {
        other = !!other?_.merge({
            safe: true,
            // contentType: "application/x-www-form-urlencoded;charset=utf-8"
            contentType: "application/json;charset=utf-8"
        },other):{
            safe: true,
            // contentType: "application/x-www-form-urlencoded;charset=utf-8"
            contentType: "application/json;charset=utf-8"
        };
    // }
    HttpTool.clearParam(param);
    other = HttpTool.changeEncryptOpt(url, other, _NOENCRYPT);

    log("请求param: ", param);
    let host = _CONCAT_API + url;
    let headers = HttpTool.getRequestHeader(other);
    log("请求host: ", host);
    let key = (localSafe && localSafe.getRandomStr(16)) || "";
    let body =
        localSafe && other.safe
            ? HttpTool.formatBody(key, param)
            : JSON.stringify(param);
    body =
        other.contentType.indexOf("json") === -1
            ? HttpTool.formatParamsTools(body)
            : body;
    log("请求body: ", param);

    let options = {
        url: host,
        method: reqType.toLowerCase(),
        headers,
        timeout: other['timeout']!=0&&other['timeout']?parseInt(other.timeout)*1000:HttpTool.timeout
    };
    reqType === "get" ? (options["params"] = param) : (options["data"] = body);
    axios(options)
        .then(({status, data}) => {
            let json = data,
                code = status;
            //解密
            if (other.safe && json.isSafe && localSafe) {
                json = localSafe.AESDecrypt(key, json.data);
                if (!json) {
                    let option = {
                        code: -998,
                        message: "系统繁忙,请稍候再试",
                        host: host,
                        option: {}
                    };
                    failCallback(option.code, option.message, option);
                    return;
                } else {
                    try {
                        json = JSON.parse(json);
                    } catch (e) {
                        let option = {
                            code: -997,
                            message: "返回数据格式化失败",
                            host: host,
                            option: {}
                        };
                        failCallback(option.code, option.message, option);
                        return;
                    }
                }
            }

            // json = HttpTool.removeEmpty();
            var option = {
                code: json.code === 1 || (200 <= json.code && json.code < 300) ? 1 : -json.code,
                message: json.message,
                host: host,
                option: json.option ? json.option : {}
            };
            log("------success--------");
            log(option);
            log(json);
            if (option.code > 0) {
                if (!spEvtCb) {
                    successCallback(option.code, option.message, json.data, option);
                } else {
                    if (spEvtCb(option.code)) {
                        successCallback(option.code, option.message, json.data, option);
                    }
                }
            } else {
                if (!spEvtCb) {
                    failCallback(option.code, option.message, option);
                } else {
                    if (spEvtCb(option.code)) {
                        failCallback(option.code, option.message, option);
                    }
                }
            }
        })
        .catch(error => {
            log("-----error---------");
            console.error(error);
            try {
                if (error.response) {
                    let option = {
                        code: error.response.status,
                        message: error.message,
                        host: host,
                        option: {}
                    };
                    log(option);

                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    log(error.response.data);
                    log(error.response.headers);
                    failCallback(error.response.status, error.message, option);
                } else if (error.request) {
                    let option = {
                        code: error.request.status,
                        message: "请检查网络连接",
                        host: host,
                        option: {}
                    };
                    log(option);
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    failCallback(error.request.status, option.message, option);
                } else {
                    failCallback(-999, "请求未知错误", {});
                }
            } catch (err) {
                failCallback(-999, err.message, {});
            }
            // console.log(error.config);
        });
}

Object.keys(typeEnum).forEach(val => {
    HttpTool[val.toLowerCase()] = function (
        url,
        successCallback,
        failCallback,
        param,
        reqOptions
    ) {
        mainReq(
            val.toLowerCase(),
            url,
            successCallback,
            failCallback,
            param,
            reqOptions
        );
    };
});

export default  HttpTool;
