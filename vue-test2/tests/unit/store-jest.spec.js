import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import config from '@/store'
let localVue=createLocalVue();
localVue.use(Vuex)//防止用例之间的污染

describe('测试vuex 能否在页面中使用',()=>{
    let store;
    beforeEach(()=>{
        store=new Vuex.Store(config)
    })
    it('state能否正常显示到页面中',()=>{
        expect(store.state.username).toBe('zfpx')
        jest.useFakeTimers();//创建一个模拟的定时器，会把异步代码立刻返回
        store.dispatch('set_username','newName')
        jest.runAllTimers();//把timer执行
        expect(store.state.username).toBe('newName')
        jest.useRealTimers();
    })
})