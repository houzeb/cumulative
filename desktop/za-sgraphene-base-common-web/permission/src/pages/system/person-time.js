import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, {actions, connect} from 'mirrorx'
import moment from 'moment';
import {Row,Col,Button,Input,Form,Select,Table,Icon,Tabs,DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
//const { MonthPicker, RangePicker } = DatePicker;

mirror.model({
    name: 'systemPersonTime',
    initialState: {

    },
    reducers: {

    },
    effects: {

    }
})
class PersonTime extends React.Component {
    super(props) {
        this.props = props;
    } 
    state = { 
        userDetail: {}
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const langMessage = window.LangMessage;
          const saveSuccessText = langMessage.save_success || '保存成功';
          const form = this.props.form;
          const offsetDateValue = form.getFieldValue('offsetDate')
          let offsetDate = null
          
          if (offsetDateValue == null) {
              offsetDate = offsetDateValue
          }else{
              offsetDate = offsetDateValue.format('YYYY-MM-DD HH:mm:ss')

          }

          const userId=this.props.userDetail.userId
          T.fetch({
              url: '/user/saveUser',
              data: {
                  userId: userId,
                  offsetDate: offsetDate
              }
          }).then(res => {
              if(res.success){
                  T.showSuccess(saveSuccessText);
                  this.changeTime(values.offsetDate);
              }
          });
        }
      });
    }
    changeTime = (lang) => {
        setTimeout(() => {
            location.reload();
        }, 0);
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      const userDetail = this.props.userDetail;

      const langMessage = window.LangMessage;
      const timeText = langMessage.time || '时间';
      const btnSaveText = langMessage.btn_save || '保存';
      return (
        <div>          
          <div className="pb30">
            <Form className="person-form" onSubmit={this.handleSubmit}>
              <Row className="mt15" type="flex" justify="start">
                  <Col span={12}>
                      <FormItem
                          label={timeText}
                          labelCol={{ span: 9 }}
                      >
                          {getFieldDecorator('offsetDate', {
                              initialValue: userDetail.offsetDate && moment(userDetail.offsetDate, 'YYYY-MM-DD HH:mm:ss') || undefined                            
                          })(
                              <DatePicker 
                                  format="YYYY-MM-DD HH:mm:ss"
                                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                  className="system-input " 
                              />
                          )}
                      </FormItem>
                      <Row className="mt25" type="flex" justify="center">
                          <Col>
                              { <Button htmlType="submit" type="primary" className="system-btn product-save-btn">{btnSaveText}</Button> }
                          </Col>
                      </Row>
                  </Col>
              </Row>
            </Form>
          </div>
        </div>
      );
    }
}
const WrappedPersonTime = Form.create()(PersonTime);

export default connect(state => {
    return {
        ...{userDetail: state.mainPage.userDetail},
    }
})(WrappedPersonTime)