import React from 'react';
import { Select } from 'antd';
const Option = Select.Option;

class SelectDom extends React.Component {

	constructor(props) {
		super(props);
		// this.state = {
		//   	value: '',
		// };
	}

	componentWillReceiveProps(nextProps) {
		//console.log("【nextProps...】",nextProps.defaultId)
		// if ('defaultId' in nextProps && nextProps.defaultId && nextProps.defaultId != this.props.defaultId) {
		// 	this.setState({
		// 		value: nextProps.defaultId + ''
		// 	})
		// }
	}

	render() {
		let { list, idKey, valueKey, defaultId, selectChange, width, className, disabled} = this.props;
		idKey = idKey || "id";
		valueKey = valueKey || "value";
		width = width || 140;
		list = list || [];
		let defaultValue = null
		let optList = list.map((item, index) =>
			<Option value={item[idKey] + ""} key={item[idKey] + ""} title={item[valueKey]}>{item[valueKey] || ""}</Option>
		);
		// console.log(this.state.value)
		return (
			<Select style={{ width: width }}  className={className} disabled={disabled} placeholder="请选择" {...this.props}>
				{optList}
			</Select>
		);
	}
}

export default SelectDom;