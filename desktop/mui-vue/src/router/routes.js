


export default [
  {
		path: '/',
    meta: {
      title: 'app',
    },
		redirect: '/form',
	},
  {
    path: '/form',
    meta: {
      title: 'form',
    },
    component: () => import('@/views/form.vue')
  },
  {
    path: '/display',
    meta: {
      title: 'display',
    },
    component: () => import('@/views/display.vue')
  },
  {
    path: '/table-render',
    meta: {
      title: 'table-render',
    },
    component: () => import('@/views/table-render.vue')
  },
  {
    path: '/table-slot',
    meta: {
      title: 'table-slot',
    },
    component: () => import('@/views/table-slot.vue')
  },
];
