import React, {Component} from "react";
import ReactDom from 'react-dom';
import Viewer from 'viewerjs';
import less from "./style/index.less";
//文档 http://www.dowebok.com/192.html
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        setTimeout(() => {
            let galley = ReactDom.findDOMNode(this.imgView);
            this.viewer = new Viewer(galley,this.props.config);
        }, 0);
    }

    getImages(data){
        if(!data){
            return null;
        }

        if(Array.isArray(data)){
            let view = [];
            for(let key in data){
                view.push(<img key={'img'+key} data-original={data[key]} src={data[key]}/>);
            }
            return view;
        }else{
            return <img data-original={data} src={data}/>
        }
    }

    render() {
        return (
            <div className={less.imgBox}>
                <div ref={(ref)=>{this.imgView = ref;}}>
                    <div className={less.imgContainer}>
                        {this.getImages(this.props.data)}
                    </div>
                </div>
            </div>
        );

    }
}

Index.defaultProps = {
    data:[],
    config:{
        scalable:false,
        fullscreen:false,
        title:false,
        zoomRatio:0.3,
        minZoomRatio:0.1,
        maxZoomRatio:10,
    },
};

export default  Index;