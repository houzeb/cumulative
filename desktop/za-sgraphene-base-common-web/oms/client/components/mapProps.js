/*
 * @Author: za-zhouchiye
 * @Date: 2018-07-04 12:19:24
 * @Description: ''
 * @Last Modified by: za-yanqing
 * @Last Modified time: 2018-12-10 17:00:13
 * @ToDo: ''
 */
import PropTypes from 'prop-types';
import req from '../request';
import { saveInfo, updatePath, updateLang, updateFrameLoadingStatus } from '../action/action';

/*
 * Redux
 */
// 哪些 Redux 全局的 state 是我们组件想要通过 props 获取的？
export function mapStateToProps(state) {
    return {
        state: state
    };
}

// 获取 action 创建函数
export function mapDispatchToProps(dispatch) {
    return {
        updateUserInfo: async() => {
            const data = await req.getUser();
            dispatch(saveInfo(data));
        },
        updateCurrentPath: async(data) => {
            dispatch(updatePath(data));
        },
        updateLanguage: async(currentLang) => {
            const data = await req.getlLang(currentLang);
            dispatch(updateLang(data));
        },
        updateFrameLoading: async(status) => {
            dispatch(updateFrameLoadingStatus(status));
        }
    };
}

export const mapPropTypes = {
    state: PropTypes.object,
    updateUserInfo: PropTypes.func,
    updateCurrentPath: PropTypes.func,
    updateLanguage: PropTypes.func,
    updateFrameLoading: PropTypes.func,
};
