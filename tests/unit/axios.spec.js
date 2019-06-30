import {shallowMount} from '@vue/test-utils'
import Axios from '@/components/Axios.vue'
import {expect} from 'chai'
import moxios from 'moxios'

describe('测试Axios.vue组件',()=>{
    beforeEach(()=>{
        moxios.install()
    })
    afterEach(()=>{
        moxios.uninstall()
    })
    it('使用moxios模拟接口',(done)=>{
        let wrapper =shallowMount(Axios)
        moxios.stubRequest('/user',{
            status:200,
            response:{user:'jw'}
        })
        moxios.wait(()=>{
            expect(wrapper.text()).to.include('jw')
            done()
        })
    })
})