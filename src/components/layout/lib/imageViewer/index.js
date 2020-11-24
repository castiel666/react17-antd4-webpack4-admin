import React, {Component} from 'react';
import ImgViewer from './viewer/index.js';

/**
 * 图片预览
 */
class Index extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <ImgViewer
                data={this.props.data.option.fileList}
            />
        );
    }


}


export default  Index;