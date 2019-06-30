import {shallowMount} from '@vue/test-utils'
import Test4 from '@/components/Test4.vue'
import {expect} from 'chai'
import moxios from 'moxios'

describe('Test4.vue组件',()=>{
    beforeEach(()=>{
        moxios.install()
    })
    afterEach(()=>{
        moxios.uninstall()
    })
    it('测试axios',(done)=>{
        let wrapper =shallowMount(Test4)
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