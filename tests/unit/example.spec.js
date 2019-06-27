import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";
import Child from "@/components/Child.vue";
import sinon from 'sinon'

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).to.include(msg);
  });
  it("点击按钮是否可以加1", () => {
    // 挂载counter组件
    let wrapper = shallowMount(HelloWorld);
    wrapper.setData({ count: 10 }); // 设置状态
    // mock状态
    expect(wrapper.find("span").text()).to.be.equal("10");
    wrapper.find("button").trigger("click");
    expect(wrapper.find("span").text()).to.be.equal("11");
  });
  it("触发show方f法", () => {
    let wrapper = shallowMount(HelloWorld);
    expect(wrapper.find("#content").exists()).to.be.false;
    wrapper.find(Child).vm.$emit("show");
    expect(wrapper.find("#content").exists()).to.be.true;
  });
});
describe('测试子组件接受一个函数，点击按钮是调用这个函数',()=>{
  it("点击按钮触发函数",()=>{
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