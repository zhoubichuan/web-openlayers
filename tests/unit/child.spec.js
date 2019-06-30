import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Child from "@/components/Child.vue";
import sinon from 'sinon'

describe('Child.vue',()=>{
  it("测试子组件触发父组件方法",()=>{
    let callback=sinon.spy()
    let wrapper=shallowMount(Child,{
      propsData:{fn:callback}
    })
    wrapper.find("button").trigger("click")
    expect(callback.getCall(0).args[0]).to.be.equal('123');
    expect(callback.getCall(1).args[0]).to.be.equal('456');
    expect(callback.callCount).to.be.equal(2)
  })
})