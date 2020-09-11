import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import plupload from 'plupload';
import browserMD5File from 'browser-md5-file';
import BrowseButton from './BrowseButton';
import UploadButton from './UploadButton';
import { Icon } from 'antd';
import './PLupload.less';

const EVENTS = [
    'PostInit', 'Browse', 'Refresh', 'StateChanged', 'QueueChanged', 'OptionChanged',
    'BeforeUpload', 'UploadProgress', 'FileFiltered', 'FilesAdded', 'FilesRemoved', 'FileUploaded', 'ChunkUploaded',
    'UploadComplete', 'Destroy', 'Error'
];

class Plupload extends React.Component {
    constructor() {
        super();
        this.id = new Date().valueOf();
        this.state = { files: [], uploadState: false, progress: {}, fileMd5: '', chunk_size: '' };
        this.runUploader = this.runUploader.bind(this);
        this.getComponentId = this.getComponentId.bind(this);
        this.refresh = this.refresh.bind(this);
        this.initUploader = this.initUploader.bind(this);
        this.list = this.list.bind(this);
        this.clearAllFiles = this.clearAllFiles.bind(this);
        this.clearFailedFiles = this.clearFailedFiles.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.doUpload = this.doUpload.bind(this);
        this.container = null;
        window.plupload = plupload;
        console.log('browserMD5File', browserMD5File);
    }

    checkUploader() {
        return window.plupload !== undefined;
    }

    runUploader() {
        const self = this;
        this.initUploader();
        this.uploader.init();

        EVENTS.forEach(function(event) {
            const handler = self.props['on' + event];
            if (typeof handler === 'function') {
                self.uploader.bind(event, handler);
            }
        });

        this.uploader.bind('BeforeUpload', (up, file) => {
            // TODO 这个地方要添加文件的md5和分片文件的md5值
            this.uploader.setOption('multipart_params', {
                'fileMd5': this.state.fileMd5,
                'chunkSize': 1048576
            });
        });

        this.uploader.bind('ChunkUploaded', (up, file, info) => {
            console.log('[ChunkUploaded] File:', file, 'Info:', info);
        });

        // Put the selected files into the current state
        this.uploader.bind('FilesAdded', (up, files) => {
            console.log('files', files);
            browserMD5File(files[0].getNative(), (err, md5) => {
                console.log('err', err);
                if (!err) {
                    this.setState({ fileMd5: md5 });
                }
            });
            if (_.get(self.props, 'multi_selection') === false) {
                self.clearAllFiles();
            } else {
                self.clearFailedFiles();
            }

            const f = self.state.files;
            _.map(files, (file) => {
                f.push(file);
            });
            self.setState({ files: f }, () => {
                if (self.props.autoUpload === true) {
                    self.uploader.start();
                }
            });
        });

        this.uploader.bind('FilesRemoved', (up, rmFiles) => {
            const stateFiles = self.state.files;
            const files = _.filter(stateFiles, (file) => {
                // console.log(rmFiles, file);
                let flag = _.find(rmFiles, { id: file.id });
                return flag !== -1;
            });
            self.setState({ files: files });
        });

        this.uploader.bind('StateChanged', (up) => {
            if (up.state === window.plupload.STARTED && self.state.uploadState === false) {
                self.setState({ uploadState: true });
            }
            if (up.state !== window.plupload.STARTED && self.state.uploadState === true) {
                self.setState({ uploadState: false });
            }
        });

        this.uploader.bind('FileUploaded', (up, file) => {
            alert('fileUploaded');
            const stateFiles = self.state.files;
            _.map(stateFiles, (val, key) => {
                if (val.id === file.id) {
                    val.uploaded = true;
                    stateFiles[key] = val;
                }
            });
            self.setState({ files: stateFiles }, () => {
                self.removeFile(file.id);
            });
        });

        this.uploader.bind('Error', (up, err) => {
            if (_.isUndefined(err.file) !== true) {
                const stateFiles = self.state.files;
                _.map(stateFiles, (val, key) => {
                    if (val.id === err.file.id) {
                        val.error = err;
                        stateFiles[key] = val;
                    }
                });
                self.setState({ files: stateFiles });
            }
        });

        this.uploader.bind('UploadProgress', (up, file) => {
            const stateProgress = self.state.progress;
            stateProgress[file.id] = file.percent;
            self.setState({ progress: stateProgress });
        });
    }

    componentDidMount() {
        const self = this;
        if (this.checkUploader()) {
            this.runUploader();
        } else {
            setTimeout(function() {
                if (self.checkUploader()) {
                    self.runUploader();
                } else {
                    console.warn('Plupload has not initialized');
                }
            }, 500);
        }
    }

    componentDidUpdate() {
        if (this.checkUploader()) {
            this.refresh();
        }
    }

    getComponentId() {
        return this.props.id || 'react_plupload_' + this.id;
    }

    refresh() {
        // Refresh to append events to buttons again.
        this.uploader.refresh();
    }

    initUploader() {
        this.uploader = new window.plupload.Uploader(_.extend({
            container: `plupload_${this.props.id}`,
            runtimes: 'html5',
            multipart: true,
            chunk_size: '1mb',
            browse_button: this.getComponentId(),
            url: '/upload',
        }, this.props));
    }

    // Display selected files
    list() {
        const self = this;
        return _.map(this.state.files, (val) => {
            const removeFile = (e) => {
                e.preventDefault();
                self.removeFile(val.id);
            };
            let delButton = '';
            if (self.state.uploadState === false && val.uploaded !== true) {
                // delButton = React.createElement('i', { onClick: removeFile, className: 'pull-right' }, 'X');
                delButton = <Icon type="close" onClick={removeFile} />;
            }

            let progressBar = '';
            if (self.state.uploadState === true && val.uploaded !== true && _.isUndefined(val.error)) {
                const percent = self.state.progress[val.id] || 0;
                progressBar = React.createElement('div', { className: 'progress' },
                    React.createElement('div', {
                        className: 'progress-bar',
                        role: 'progressbar',
                        'aria-valuenow': percent,
                        'aria-valuemin': 0,
                        'aria-valuemax': 100,
                        style: { width: percent + '%' }
                    }, React.createElement('span', { className: 'sr-only' }, percent + 'complete'))
                );
            }

            let errorDiv = '';
            if (!_.isUndefined(val.error)) {
                errorDiv = React.createElement('div', { className: 'alert alert-danger' }, 'Error: ' + val.error.code + ', Message: ' + val.error.message);
            }

            let bgSuccess = '';
            if (!_.isUndefined(val.uploaded)) {
                bgSuccess = 'bg-success';
            }

            return React.createElement('li', { key: val.id },
                React.createElement('p', { className: bgSuccess }, <Icon type="paper-clip" />, val.name, ' ', delButton), progressBar, errorDiv
            );
        });
    }

    clearAllFiles() {
        const state = _.filter(this.state.files, (file) => {
            this.uploader.removeFile(file.id);
        });
        this.setState({ files: state });
    }

    clearFailedFiles() {
        const state = _.filter(this.state.files, (file) => {
            if (file.error) {
                this.uploader.removeFile(file.id);
            }
            return !file.error;
        });
        this.setState({ files: state });
    }

    removeFile(id) {
        this.uploader.removeFile(id);
        const state = _.filter(this.state.files, (file) => {
            return file.id !== id;
        });
        this.setState({ files: state });
    }

    doUpload(e) {
        e.preventDefault();
        this.uploader.start();
    }

    render() {
        const propsSelect = {
            id: this.getComponentId(),
            type: 'button',
            content: this.props.buttonSelect || 'Browse',
            className: 'ant-btn ant-btn-default'
        };

        const propsUpload = {
            onClick: this.doUpload,
            type: 'button',
            content: this.props.buttonUpload || 'Upload',
            className: 'ant-btn ant-btn-default'
        };
        if (this.state.files.length === 0) propsUpload.disabled = 'disabled';

        const list = this.list();
        console.log('list', list);
        return (
            <div id={`plupload_${this.props.id}`} className={'pl_class'} ref={ref => (this.container = ref)}>
                <BrowseButton {...propsSelect} />
                <UploadButton {...propsUpload} />
                <ul className={'list-unstyled'}>
                    {list}
                </ul>
            </div>
        );
    }
}

Plupload.propTypes = {
    'onPostInit': PropTypes.func,
    'onBrowse': PropTypes.func,
    'onRefresh': PropTypes.func,
    'onStateChanged': PropTypes.func,
    'onQueueChanged': PropTypes.func,
    'onOptionChanged': PropTypes.func,
    'onBeforeUpload': PropTypes.func,
    'onUploadProgress': PropTypes.func,
    'onFileFiltered': PropTypes.func,
    'onFilesAdded': PropTypes.func,
    'onFilesRemoved': PropTypes.func,
    'onFileUploaded': PropTypes.func,
    'onChunkUploaded': PropTypes.func,
    'onUploadComplete': PropTypes.func,
    'onDestroy': PropTypes.func,
    'onError': PropTypes.func,
    'id': PropTypes.string.isRequired,
    'buttonSelect': PropTypes.string,
    'buttonUpload': PropTypes.string,
    'autoUpload': PropTypes.bool
};

export default Plupload;
