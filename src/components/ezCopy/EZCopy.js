import React from "react";
export default class EZCopy extends React.Component {
    getTarget(ev) {
        let { getTarget } = this.props;
        if (getTarget) {
            return getTarget();
        } else {
            return ev;
        }
    }
    render() {
        return (
            <span
                onMouseEnter={ev => this.select(this.getTarget(ev))}
                onMouseLeave={() => this.deselect()}
                onClick={ev => this.copy(this.getTarget(ev))}
            >
        {this.props.children}
      </span>
        );
    }

    select(ev) {
        const range = global.document.createRange();
        range.selectNode(ev);
        global.getSelection().removeAllRanges();
        global.getSelection().addRange(range);
    }

    deselect() {
        global.getSelection().removeAllRanges();
    }

    copy(ev) {
        this.select(ev);
        const success = global.document.execCommand("copy");
        if (success) {
            this.props.successCB && this.props.successCB({
                type: "NOTIFICATION_SHOW",
                message: "Copied to clipboard!",
                level: "success",
                duration: 2000
            });
            this.deselect();
        }else{
            alert('复制失败')
        }
    }
}
