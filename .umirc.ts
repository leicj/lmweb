import { defineConfig } from '@umijs/max';

export default defineConfig({
  dva: {},
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  headScripts: ['//cdn.jsdelivr.net/npm/jsmind@0.6.4/es6/jsmind.js'],
  styles: ['//cdn.jsdelivr.net/npm/jsmind@0.6.4/style/jsmind.css'],
  layout: {
    title: '路面智能决策系统',
  },
  routes: [
    // {
    //   path: '/smart',
    //   name: '养护智能决策',
    //   routes: [
    //     {
    //       path: '/smart/cost',
    //       name: '养护费用模型',
    //       component: './smart/cost',
    //     },
    //     {
    //       path: '/smart/guess',
    //       name: '性能预测模型',
    //     },
    //     {
    //       path: '/smart/sort',
    //       name: '优先排序模型',
    //     },
    //     {
    //       path: '/smart/category',
    //       name: '养护决策模型',
    //       component: './smart/categoryMix',
    //     },
    //     {
    //       path: '/smart/solution',
    //       name: '养护需求分析',
    //     }
    //   ]
    // }, {
    //   path: '/pqi',
    //   name: '路面技术状况评定',
    //   routes: [
    //     {
    //       path: '/',
    //       name: '项目管理',
    //       component: './',
    //     },
    //     {
    //       path: '/',
    //       name: '检测数据管理',
    //       component: './',
    //     },
    //     {
    //       path: '/',
    //       name: '技术状况评定',
    //       component: './',
    //     },
    //   ]
    // }, 
    {
      path: '/base',
      name: '工程档案',
      routes: [
        {
          path: '/base/company',
          name: '运营公司',
          component: './base/company',
        },
        {
          path: '/base/road',
          name: '路线档案',
          component: './base/road',
        },
        // {
        //   path: '/base/road',
        //   name: '路线档案',
        //   component: './base/road',
        // },{
        //   path: '/base/roadsection',
        //   name: '路段档案',
        //   component: './base/roadsection',
        // }
      ]
    }
  ],
  npmClient: 'pnpm',
});

