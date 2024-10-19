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
    {
      path: '/manage',
      name: '路面技术状况评定',
      routes: [
        {
          path: '/manage/project',
          name: '项目管理',
          component: './manage/project',
        },
        {
          path: '/manage/checkdata',
          name: '检测数据管理',
          component: './manage/checkdata',
        },
        {
          path: '/manage/pqi',
          name: '技术状况评定',
          component: './manage/pqi',
        }
      ]
    },
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
        {
          path: '/base/roadsection',
          name: '路段档案',
          component: './base/roadsection',
        }
      ]
    }
  ],
  npmClient: 'pnpm',
});

