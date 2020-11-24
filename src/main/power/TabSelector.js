import React, { Component } from 'react';
import css from './TabSelector.less';

export default class TabSelector extends Component{
	constructor(props) {
		super(props);
		this.state = {
			showList: false // collapse state
		};
	}

	_showList(val) {
		let { panes } = this.props;
		panes.length > 0 ? this.setState({
			showList: val
		}) : void 0;
	}
	render() {
		let { panes,changePane,closePane,closeAllPane,closeOtherPane,activeKey,refresh } = this.props, { showList } = this.state,
			paneList = showList && panes.length > 0 ? (
				panes.map((val, key) => {
					return (
						<TabItem activeKey={activeKey} pane={val} key={val.key} changePane={changePane} closePane={closePane}/>
					)
				 })
			) : null,
			closeChoices = panes.length>0?(
						<div className={css.tabList_header_btn} onClick={()=>closeAllPane()}>关闭所有标签</div>
					):null,
			mainStyle = showList ?
				css.tabSelector_content :
				css.tabSelector_content_hide;
		return (
			<div className={css.tabSelector}
                 onMouseLeave={() => setTimeout(() => this._showList(false), 100)}
			>
				<div
					className={css.tabSelector_label}
				>
					<span
						className={css.refreshBtn}
						onClick={()=>{refresh(activeKey)}}
                        onMouseEnter={() => this._showList(false)}
					>刷新页面</span>
					<span
                        className={showList?css.closeBtnActive:css.closeBtn}
                        onMouseEnter={() => this._showList(true)}
					>关闭标签</span>

				</div>
				<div className={mainStyle} >
					{closeChoices}
					{paneList}
				</div>
			</div>
		)
	}
}

TabSelector.defaultProps = {
	panes: [],
	activeKey: '',
	closePane: () => { },
	closeAllPane: () => { alert(2) },
	changePane: () => { }
}

class TabItem extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { pane, closePane, changePane, activeKey } = this.props, isActive = pane.key === activeKey,
			mainStyle = isActive ? `${css.tabItem_title} ${css.tabItem_active}` : css.tabItem_title;
		let dot = isActive ? (<div className={css.tabItem_info_dot}></div>) : null;
		
		return (
			<div className={`${css.tabItem} ${isActive?css.tabItem_active_bg:null}`}>
				<div className={css.tabItem_info}>
					{dot}
				</div>
				<div className={mainStyle}>
					<div style={css.tabItem_info_title} onClick={()=>changePane(pane.key)}>{pane.title}</div>
				</div>
				<div className={css.tabItem_icon} onClick={() => closePane(pane.key)}>
					<div className={[css.tabItem_close_left]}></div>
					<div className={[css.tabItem_close_right]}></div>
				</div>
			</div>
		);
	}
}

TabItem.defaultProps = {
	pane: {},
	activeKey: '',
	closePane: () => { },
	changePane: () => { }
};