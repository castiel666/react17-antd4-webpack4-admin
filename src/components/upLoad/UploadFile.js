import React from 'react';
import less from './UploadFile.less';
import {message, Modal} from 'antd';
import UploadHelp from './UploadHelp';
import {PlusOutlined} from "@ant-design/icons";

class UploadFile extends React.Component {
    constructor(props) {
        super(props);

        //当实例多个的时候有用
        this.uploadId = "uploadBtn_" + Math.random();

        this.upload = new UploadHelp();
        this.defaultValue = (this.props.data && this.props.data.option && this.props.data.option.defaultValue) || this.props.value || [];
        this.accept = (this.props.data && this.props.data.option && this.props.data.option.accept) || this.props.accept || "*";
        this.size = (this.props.data && this.props.data.option && this.props.data.option.size) || this.props.size || 1;
        this.bigLabel = (this.props.data && this.props.data.option && this.props.data.option.bigLabel) || this.props.bigLabel || false;
        this.onlyShow = (this.props.data && this.props.data.option && this.props.data.option.onlyShow) || this.props.onlyShow || false;

        if (this.size !== 1) {
            //多张图类型，不能使用大图label
            this.bigLabel = false;
        }

        this.state = {
            value: this.defaultValue,
            loading: false,
            imageShow: {
                state: false,
                url: null,
            },
        }
    }

    _initDefaultValue(data) {
        return data.option.defaultValue || undefined;
    }

    render() {
        const value = this.state.value;
        return (
            <div className={less.upfileBox}>
                {this.getViewList(value)}
                {
                    value.length < this.size && !this.onlyShow
                        ? (this.state.loading
                        ? (<div
                            className={this.bigLabel?less.loadingBoxBig:less.loadingBox}
                            style={{
                                backgroundImage: `url(${require('./img/load.gif')})`
                            }}
                        >
                            上传中
                        </div>)
                        : (<div
                            className={this.bigLabel?less.addBtnBoxBig:less.addBtnBox}
                        >
                            <label htmlFor={this.uploadId} className={less.inputAdd}>
                                <PlusOutlined className={less.addBtn}/>
                            </label>
                            <input
                                className={less.addInput}
                                id={this.uploadId}
                                type="file"
                                accept={this.accept}
                                onChange={(e) => {
                                    let targetFile = e.target.files[0];
                                    log(targetFile);

                                    this.toUploadFile(targetFile);
                                }}
                            />
                        </div>))
                        : null
                }
                <Modal
                    visible={this.state.imageShow.state}
                    footer={null}
                    maskClosable={true}
                    width={"80%"}
                    style={{textAlign:"center"}}
                    onCancel={() => {
                        this.handleCancel()
                    }}
                >
                    <img alt="图片" style={{maxWidth: '100%'}} src={this.state.imageShow.url}/>
                </Modal>
            </div>
        )
    }

    //视图列表
    getViewList(valueList) {
        if (!valueList || !valueList.length || valueList.length <= 0) {
            return null;
        }

        let result = [];
        for (let key in valueList) {
            let obj = valueList[key];
            if (this.props.type == 1) {
                //图片
                result.push(<div
                    key={'imgView' + key}
                    className={this.bigLabel?less.imgStyleBig:less.imgStyle}
                    style={{
                        backgroundImage: `url(${obj.url})`
                    }}
                    {...this.props.style}
                    onClick={() => {
                        this.handlePreview(obj);
                    }}
                >
                    {
                        this.onlyShow
                            ? null
                            : (<div
                                style={{
                                    backgroundImage: `url(${require('./img/delImg.png')})`
                                }}
                                className={less.delIcon}
                                onClick={(e) => {
                                    this.deleteFile(key);
                                    e.stopPropagation();
                                }}
                            ></div>)
                    }
                </div>)
            } else if (this.props.type == 2) {
                //视频
                result.push(<div
                    key={'videoView' + key}
                    className={less.videoBox}
                    {...this.props.style}
                >
                    <video
                        src={obj.url}
                        className={less.videoStyle}
                        preload
                        controls="controls"
                    >
                        您的浏览器不支持 html5 播放器，请升级浏览器
                    </video>
                    {
                        this.onlyShow
                            ? null
                            : (<div
                                style={{
                                    backgroundImage: `url(${require('./img/delImg.png')})`
                                }}
                                className={less.delIconForVideo}
                                onClick={(e) => {
                                    this.deleteFile(key);
                                    e.stopPropagation();
                                }}
                            ></div>)
                    }
                </div>)
            }
        }

        return result;
    }

    toUploadFile(file) {
        let successCB = (code, msg, json, option) => {
            let file = {
                url: json.url,
                duration: json.duration,
            };
            this.addFile(file);
        };
        let failureCB = (code, msg) => {
            this.setState({
                loading: false,
            }, () => {
                message.error('上传失败')
            });
        };

        let suffixList = file && file.name && file.name.split('.');
        if (suffixList.length <= 1) {
            message.warning('文件选择出错');
            return;
        }
        let suffix = suffixList[suffixList.length - 1];
        if (!suffix) {
            message.warning('文件选择出错');
            return;
        }

        this.setState({
            loading: true,
        }, () => {
            this.upload.upload(file, suffix, successCB, failureCB);
        });
    }

    addFile(file) {
        let list = this.state.value;
        list.push(file);
        this.setState({
            loading: false,
            value: list
        }, () => {
            this.props.verification && this.props.verification(this.props.data, this.state.value);
            this.props.onChange(this.state.value);
        })
    }

    deleteFile(index) {
        let list = this.state.value;
        list.splice(index, 1);

        this.setState({
            value: list
        }, () => {
            this.props.verification && this.props.verification(this.props.data, this.state.value);
            this.props.onChange(this.state.value);
        })
    }

    //预览
    handlePreview(file) {
        log(file);
        this.setState({
            imageShow: {
                url: file.url,
                state: true,
            }
        })
    }

    //取消
    handleCancel() {
        this.setState({
            imageShow: {
                url: this.state.imageShow.url,
                state: false,
            }
        })
    }

    resetValue(value) {
        this.setState({
            value: value,
        })
    }
}

UploadFile.defaultProps = {
    type: 1,
    style: {},
    onChange: (fileList) => {
    },
};

export default UploadFile;