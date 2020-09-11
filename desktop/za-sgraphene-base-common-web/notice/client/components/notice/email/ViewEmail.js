import React, { Component } from 'react';
import { Form, Input, Modal, Tag } from 'antd';
import { mapPropTypes } from '../../mapProps';
import LzEditor from 'react-lz-editor';
import PropTypes from 'prop-types';
import mime from 'mime-types';
import { request } from '../../../request';
const FormItem = Form.Item;
class App extends Component {
    // 预览或下载附件
    save = (data, type) => {
        const b64toBlob = (b64Data, contentType, sliceSize) => {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            let byteCharacters = atob(b64Data);
            let byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                let slice = byteCharacters.slice(offset, offset + sliceSize);
                let byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                let byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            let blob = new Blob(byteArrays, { type: contentType });
            return blob;
        };
        // mime.lookup  根据后缀转换为 MIME contentType
        let blob = b64toBlob(data, mime.lookup(type));
        let blobUrl = URL.createObjectURL(blob);
        window.location.href = blobUrl;
    }
    download = (id) => {
        request.download(id).then(res => {
            if (res.success && res.value) {
                this.save(res.value.content, res.value.fileFormat);
            }
        });
    }

    render() {
        const { LANG } = this.props.state;
        const { content, showTemp } = this.props;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 7 },
        };
        // 邮件附件
        let mailCon;
        if (content.attachmentResponseDTOList) {
            let mailList = content.attachmentResponseDTOList;
            mailCon = mailList && mailList.map((item, index) => {
                return <Tag key={index} onClick={() => { if (item.attachmentValue) this.download(item.attachmentValue); }}>{item.name}</Tag>;
            });
        } else {
            if (content.mail) {
                mailCon = <Tag key={content.mail.mailAttachment}>{content.mail.mailAttachment}</Tag>;
            }
        }
        return (
            <div>
                {
                    showTemp
                        ? <FormItem
                            label={LANG.temp_name || '模板名称'}
                            {...formItemLayout}>
                            <Input disabled value={content.templateName} />
                        </FormItem> : <FormItem
                            label={LANG.notify_recipient || '收件人'}
                            {...formItemLayout} >
                            <Input disabled value={content.receiver} />
                        </FormItem>
                }
                <FormItem
                    label={LANG.notify_email_subject || '邮件主题'}
                    {...formItemLayout}
                >
                    <Input disabled value={content.mail ? content.mail.title : content.title} />
                </FormItem>
                <FormItem
                    label={LANG.notify_email_attachment || '邮件附件'}
                    {...formItemLayout}
                    wrapperCol={{ span: 19 }}
                >
                    {mailCon}
                </FormItem>
                <FormItem
                    label={LANG.notify_email_content || '邮件内容'}
                    {...formItemLayout}
                    wrapperCol={{ span: 19 }}
                >
                    <LzEditor
                        active
                        color={false}
                        undoRedo={false}
                        removeStyle={false}
                        pasteNoStyle={false}
                        blockStyle={false}
                        alignment={false}
                        inlineStyle={false}
                        image={false}
                        video={false}
                        audio={false}
                        urls={false}
                        autoSave={false}
                        fullScreen={false}
                        cbReceiver={() => { }}
                        disabled
                        importContent={content.mail ? content.mail.content : content.content}
                    />
                </FormItem>
            </div >
        );
    }
}

App.propTypes = mapPropTypes;
App.propTypes = {
    showTemp: PropTypes.bool
};
export default App;
