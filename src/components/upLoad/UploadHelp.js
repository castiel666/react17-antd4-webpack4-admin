import APILXD from '../../http/APILXD';
// const OSS = require('ali-oss');
// const qiniu = require("qiniu-js");
import HttpTool from "../../tool/HttpTool";

class UploadHelp {
    constructor() {
        this.putExtra = {};
        this.config = {
            useCdnDomain: true,              //是否使用cnd加速
            disableStatisticsReport: false,  //是否禁用日志报告
            // region: qiniu.region.z0,        //选择上传域名区域(华东)
            retryCount: 3,                   //上传自动重试次数
            concurrentRequestLimit: 3,       //分片上传的并发请求量
            checkByMD5: false,               //是否开启 MD5 校验
        };
    }

    /**
     * 被外调用的上传方法
     * @param file  文件实例
     * @param suffix  文件类型 后缀
     * @param successCB     成功的回调
     * @param failureCB     失败的回调
     * @param loadingCB     上传过程中的回调(留坑待开发)
     */
    upload(file, suffix, successCB, failureCB, loadingCB) {
        this.getUploadToken(file, suffix, successCB, failureCB, loadingCB);
    }

    /**
     * 获取凭证
     * @param suffix 后缀
     */
    getUploadToken(file, suffix, successCB, failureCB, loadingCB) {
        let param = {
            suffix: suffix
        };
        let succCB = (code, msg, json, option) => {
            if (json && json.type === 2) {
                //执行上传（阿里云）
                this.doAliUpload(file, json, successCB, failureCB, loadingCB);
            }else{
                //获取凭证成功，执行上传（七牛）
                // this.doQiniuUpload(file, json, successCB, failureCB, loadingCB);
            }
        };
        let failCB = (code, msg) => {
            failureCB(code, msg);
        };

        HttpTool.post(APILXD.getUploadToken, succCB, failCB, param);
    }

    /**
     * 使用七牛上传
     * @param file
     * @param json     请求后台得到的凭证内容{key:'文件名',host:'文件域名',token:'上传token'}
     * @param successCB
     * @param failureCB
     */
    // doQiniuUpload(file, json, successCB, failureCB, loadingCB) {
    //     //实例化上传对象
    //     let observable = qiniu.upload(file, json.key, json.token, this.putExtra, this.config);
    //     log(observable);
    //
    //     let observer = {
    //         next(res) {
    //             // 上传进度信息
    //             log(res);
    //             loadingCB && loadingCB(res);
    //         },
    //         error(err) {
    //             // 上传错误后触发
    //             log(err);
    //             //捕获异常，统一报错为上传失败
    //             failureCB(err.code, err.message);
    //         },
    //         complete(res) {
    //             // 接收上传完成后的后端返回信息
    //             log(res);
    //             res.url = json.host + '/' + json.key;
    //             successCB(200, '上传成功', res, {});
    //         }
    //     };
    //
    //     let subscription = observable.subscribe(observer);
    // }


    /**
     * 使用阿里云上传
     * @param file
     * @param json     请求后台得到的凭证内容{key:'文件名',host:'文件域名',token:'上传token'}
     * @param successCB
     * @param failureCB
     */
    doAliUpload(file, json, successCB, failureCB, loadingCB){
        let client = new OSS({
            accessKeyId: json.AccessKeyId,
            accessKeySecret: json.AccessKeySecret,
            bucket: json.Bucket,
            stsToken:json.SecurityToken,
            region:json.region || json.Region ,
            endpoint:json.endpoint,
        });

        let tempCheckpoint = null;

        client.multipartUpload(json.key, (new Blob([file])), {
            progress: (p, checkpoint) => {
                log(p);
                log(checkpoint);
                // 记录断点
                let loadMsg = null;
                if(checkpoint){
                    tempCheckpoint = checkpoint;
                    loadMsg = {
                        size:checkpoint.fileSize,
                        loaded:Math.floor(checkpoint.fileSize * p),
                        percent:p*100,
                    };
                }else{
                    loadMsg = {
                        size:100,
                        loaded:100,
                        percent:100,
                    };
                }
                loadingCB && loadingCB({total:loadMsg});
            },
            mime: 'application/*',
        })
            .then((result)=>{
                log(result);
                let res = result.res;
                res.url = json.host + '/' + json.key;
                successCB(200, '上传成功', res, {});
            })
            .catch((err)=>{
                log("上传错误：");
                log(err);
                failureCB(err.code, err.message);
            })

        // 暂停分片上传方法
//         client.cancel();

        // 恢复上传
//         let resumeclient = new OSS(ossConfig);
//         async function resumeUpload () {
//             try {
//                 let result = await resumeclient.multipartUpload('object-key', 'local-file', {
//                     progress: async function (p, checkpoint) {
//                         tempCheckpoint = checkpoint;
//                     },
//                     checkpoint: tempCheckpoint
//                     meta: { year: 2017, people: 'test' },
//                     mime: 'image/jpeg'
//                 })
//             } catch (e) {
//                 console.log(e);
//             }
//         }
//
//         resumeUpload();
    }
}

export default UploadHelp;