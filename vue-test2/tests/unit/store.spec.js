import {shallowMount,createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import Store from '@/components/Store.vue'
let localVue=createLocalVue();
localVue.use(Vuex)//防止用例之间的污染
let state;
let store;
let actions;
let callback=jest.fn()
describe('测试vuex 能否在页面中使用',()=>{
    state={username:'jw'}
    actions={
        set_username:callback
    }
    beforeEach(()=>{
        state={username:'jw'}
        store=new Vuex.Store({
            state,
            actions
        })
    })
    it('state能否正常显示到页面中',()=>{
        let wrapper=shallowMount(Store,{
            localVue,
            store
        })
        expect(wrapper.text()).toContain('jw')
    })
    it('点击按钮时action能否正常触发',()=>{
        let wrapper=shallowMount(Store,{
            localVue,//提供测试的构造函数vue
            store
        })
        wrapper.find('button').trigger('click')
        expect(callback).toHaveBeenCalled()
    })
})