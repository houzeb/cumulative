import React, { Component } from 'react';
import { Upload, Modal, Icon } from 'antd';
import request from '../../../request';
import PropTypes from 'prop-types';
import _ from 'lodash';

class UploadPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileTypes: []
        };
    }

    componentDidMount() {
        this.getImageType();
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }, index) => {
        const { fileTypes } = this.state;
        fileTypes[index].fileList = fileList;
        this.setState({ fileTypes });

        this.props.imageChange(fileTypes);
    }

    translatFileType = (type) => {
        switch (parseInt(type)) {
        case 1: return 'ID_CARD';
        case 2: return 'CLINICAL_HISTORY';
        case 3: return 'MEDICAL_INVOICE';
        case 4: return 'DIAGNOSIS_CERTIFICATE_REPORT';
        case 5: return 'ADMISSIONS_RECORD';
        case 6: return 'DISCHARGE_SUMMARY';
        case 7: return 'OPERATION_RECORD';
        case 8: return 'TRAFFIC_ACCIDENTS_REPORT';
        case 9: return 'POLICE_CALL_REPORT';
        case 10: return 'POLICE_SETTLE_REPORT';
        case 11: return 'DEATH_ID_CARD';
        case 12: return 'DEATH_CERTIFICATE';
        case 13: return 'HOUSEHOLD_REGISTRATION_CANCELLATION';
        case 14: return 'CREMATION_CERTIFICATE';
        case 15: return 'OPERATION_RECORD_PROCESS';
        case 16: return 'INSPECTION_REPORT';
        case 17: return 'COST_DETAIL';
        case 18: return 'OTHER_SUPPORT_FILE';
        case 19: return 'ACCIDENTAL_DEATH';
        case 20: return 'DISEASE_DIAGNOSIS_BOOK';
        case 21: return 'BENEFICIARY_RELATIONSHIP_INSURED';
        case 22: return 'CERTIFICATE_DISABILITY';
        case 23: return 'OUTPATIENT_RECORDS';
        case 24: return 'HOSPITALIZATION_RECORDS';
        }
    }
    getImageType = () => {
        request.getEnum({
            categoryCode: 'claim.GraClaimsImageTypeEnum',
        }).then(res => {
            const { fileList } = this.props;
            if (res.success && res.value) {
                let fileTypes = [];
                res.value.map((item, idx) => {
                    let tempObj = {
                        id: item.itemCode,
                        title: item.itemName,
                        code: this.translatFileType(item.itemCode),
                        fileList: []
                    };
                    let existImage = _.find(fileList, {
                        imageType: tempObj.code
                    });
                    if (existImage && existImage.imageUrl && existImage.imageUrl.length > 0) {
                        existImage.imageUrl.map((img, idx) => {
                            tempObj.fileList.push({
                                uid: idx,
                                status: 'done',
                                url: img
                            });
                        });
                    }
                    fileTypes.push(tempObj);
                });
                this.setState({ fileTypes });
            }
        });
    }

    render() {
        const { previewVisible, previewImage, fileTypes } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        const uploadPanel = (item, index) => {
            return (<div key={index}>
                <div style={{padding: '12px 0px 0px 18px', color: '#54636F', fontSize: '15px'}}>{item.title}</div>
                <div className="block block-default photo-upload">
                    <Upload
                        action="/api/claim/common/uploadImage"
                        listType="picture-card"
                        fileList={item.fileList}
                        onPreview={this.handlePreview}
                        onChange={(fileList) => this.handleChange(fileList, index)}
                        data={(file) => {
                            return {
                                imageType: item.code,
                                imageFiles: file
                            };
                        }}
                    >
                        {uploadButton}
                    </Upload>
                </div>
            </div>);
        };
        return (
            <div>
                <div className="block">
                    {
                        fileTypes.map((item, index) => {
                            return uploadPanel(item, index);
                        })
                    }
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="preview" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

UploadPanel.propTypes = {
    imageChange: PropTypes.func,
    fileList: PropTypes.array
};
export default UploadPanel;
