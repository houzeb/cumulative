import React from 'react'
import ReactDOM from 'react-dom'
import SelectDom from '../../component/SelectDom';
import mirror, {actions, connect} from 'mirrorx'
import {Row,Col,Button,Input,Form,Select,Table,Icon,Tabs} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

mirror.model({
    name: 'systemPersonLanguage',
    initialState: {

    },
    reducers: {

    },
    effects: {

    }
})
class PersonLanguage extends React.Component {
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
          const userId=this.props.userDetail.userId
          
          const langMessage = window.LangMessage;
          const saveSuccessText = langMessage.save_success || '保存成功';
          T.fetch({
              url: '/user/saveUser',
              data: {
                  userId: userId,
                  defaultLanguage:values.defaultLanguage
              }
          }).then(res => {
              
              if(res.success){
                  T.showSuccess(saveSuccessText);
                  this.changeLang(values.defaultLanguage);
              }
          });
        }
      });
    }
    changeLang = (lang) => {
        let langCookie;
        
         if(lang === 'zh-cn'){
            langCookie = 'zh-CN';
        }
        else if (lang === 'zh-tw') {
            langCookie = 'zh-TW';
        }
        else if(lang === 'en-us'){
            langCookie = 'en-US';
        }else{
            langCookie = 'ja-JP';
        }
        if (lang) {
            T.cookie.set('lang', langCookie);
        }
        setTimeout(() => {
            location.reload();
        }, 0);
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      const userDetail = this.props.userDetail;
      const langMessage = window.LangMessage;
      const languageText = langMessage.language || '语言';
      const btnSaveText = langMessage.btn_save || '保存';

      const list=[
        {id:"zh-cn",value: '中文简体'},
        {id:"zh-tw",value: '中文繁体'},
        {id:"en-us",value: 'English'},
        {id:"ja-jp",value: '日本語'},
      ]
      return (
        <div>          
          <div className="pb30">
            <Form className="person-form" onSubmit={this.handleSubmit}>
              <Row className="mt15" type="flex" >
                  <Col span={12}>
                      <FormItem
                          label={languageText}
                          labelCol={{ span: 9 }}
                          wrapperCol={{ span: 13 }}
                      >
                          {getFieldDecorator('defaultLanguage', {
                            initialValue:userDetail.defaultLanguage
                          })(
                              <SelectDom list={list} className="system-input "/>
                          )}
                      </FormItem>
                      <Row className="mt25" type="flex" justify="center">
                          <Col>
                               <Button htmlType="submit" type="primary" className="system-btn product-save-btn">{btnSaveText}</Button> 
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
const WrappedPersonLanguage = Form.create()(PersonLanguage);

export default connect(state => { 
    return {
        ...{userDetail: state.mainPage.userDetail},
    }
})(WrappedPersonLanguage)