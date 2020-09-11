/*
 * @Author: za-zhouchiye
 * @Date: 2018-07-04 12:19:24
 * @Description: ''
 * @Last Modified by: za-huoyanpenggg
 * @Last Modified time: 2019-03-13 15:25:30
 * @ToDo: ''
 */
import PropTypes from 'prop-types';
import req from '../request';
import { saveInfo, updatePath, updateLang, updateDomain } from '../action/action';

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
            req.queryUserPriviledges(data.userId).then(res => {
                // 添加用户含拥有的资源
                if (res.success && res.value && res.value.length) {
                    data.resources = res.value.map(item => item.resourceCode);
                }
                dispatch(saveInfo(data));
            });
        },
        updateCurrentPath: async(data) => {
            dispatch(updatePath(data));
        },
        updateLanguage: async(currentLang) => {
            const data = await req.getlLang(currentLang);
            dispatch(updateLang(data));
        },
        updateDomain: async(domain) => {
            dispatch(updateDomain(domain));
        },
    };
}

export const mapPropTypes = {
    state: PropTypes.object,
    updateUserInfo: PropTypes.func,
    updateCurrentPath: PropTypes.func,
    updateLanguage: PropTypes.func,
    updateDomain: PropTypes.func
};
