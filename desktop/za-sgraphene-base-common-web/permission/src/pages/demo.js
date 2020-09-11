import React, { Component } from 'react';
import mirror, { actions, connect } from 'mirrorx';
import DTable from '../component/DTable';
import { Button } from 'antd';

mirror.model({
    name: 'Demo',
    initialState: {

    },
    reducers: {

    },
    effects: {

    }
});

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: window.LangMessage.text_index || '序号',
                    dataIndex: 'Id',
                    key: 'Id',
                    message: '',
                    error: false,
                    class: '',
                    type: 'Number'  // Number/Text/Interval
                }
            ],
            data: []
        }
        this.showData = this.showData.bind(this);
        this.resetValidator = this.resetValidator.bind(this);
        this.resetData = this.resetData.bind(this);
    }
    // 取数据
    showData() {
        let data = this.refs.dtable.validatorData();
        console.log('editable data....',data);
    }
    resetValidator() {
        this.refs.dtable.resetValidator();
    }
    resetData() {
        this.setState({
            columns: [
                {
                    title: window.LangMessage.text_index || '序号',
                    dataIndex: 'Id',
                    key: 'Id',
                    message: '',
                    error: false,
                    class: '',
                    type: 'Number'  // Number/Text/Interval
                }
            ],
            data: []
        })
    }
    render() {
        const columns = [
            {
                title: window.LangMessage.text_index || '序号',
                dataIndex: 'Id',
                key: 'Id',
                message: '',
                error: false,
                class: '',
                type: 'Number'  // Number/Text/Interval
            }
        ];

        // const data = [
        //     {
        //         key: '1',
        //         Id: '1',
        //         Name: '严卿'
        //     }, {
        //         key: '2',
        //         Id: '2',
        //         Name: '谢玲娟'
        //     }
        // ];
        const data = [];
        // const columns = [];
        return (
            <div>
                <DTable ref="dtable" columns={this.state.columns} tableData={this.state.data} />
                <Button type="primary" onClick={this.showData} style={{ marginTop: '20px' }}>{window.LangMessage.take_content || '取内容'}</Button>
                <Button type="primary" onClick={this.resetValidator} style={{ marginTop: '20px', marginLeft: '10px' }}>{window.LangMessage.restore_form_validation || '还原表单验证'}</Button>
                <Button type="primary" onClick={this.resetData} style={{ marginTop: '20px', marginLeft: '10px' }}>{window.LangMessage.restore_default_value || '还原默认值'}</Button>
            </div>
        )
    }
}

export default connect(state => {
    return state.Demo
})(Demo)