/*
 * @Author:
 * @Date: 2018-08-02 11:59:07
 * @Description: 'iframe'
 * @Last Modified by: za-yanqing
 * @Last Modified time: 2018-12-17 15:26:09
 * @ToDo: ''
 */
import React, { Component } from 'react';
import { mapPropTypes } from './mapProps';

class Search extends Component {
    componentWillReceiveProps(nextProp) {
        if (this.props.src !== nextProp.src) {
            // 兼容ie11
            document.getElementById('topFrame').src = nextProp.src;
        }
    }
    render() {
        const { src } = this.props;
        return (
            <iframe
                src={src}
                id='topFrame'
                name='topFrame'
                ref={(frame) => { this.ifr = frame; }}
                frameBorder='0'
                style={{background: '#FFFFFF'}}
                width='100%'
            />
        );
    }
}
Search.propTypes = mapPropTypes;
export default Search;
