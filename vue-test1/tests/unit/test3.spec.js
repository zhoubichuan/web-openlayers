import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Test3 from "@/components/Test3.vue";
import Child from "@/components/Child.vue";

describe("Test3.vue", () => {
  it("测试自定义show方法", () => {
    let wrapper = shallowMount(Test3);
    expect(wrapper.find("#content").exists()).to.be.false;
    wrapper.find(Child).vm.$emit("show");
    expect(wrapper.find("#content").exists()).to.be.true;
  });
});