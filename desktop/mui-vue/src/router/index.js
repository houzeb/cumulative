import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import routes from "./routes";

export default new Router({
	mode: "history",
	routes,
	/**
	 * 模拟浏览器 回退/前进 时 定位scroll
	 * @param {*} to
	 * @param {*} from
	 * @param {*} savedPosition
	 */
	scrollBehavior(to, from, savedPosition)
	{
		if (savedPosition)
		{
			return savedPosition;
		} else
		{
			return { x: 0, y: 0 };
		}
	}
});
