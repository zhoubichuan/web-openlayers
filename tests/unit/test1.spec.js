import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Test1 from "@/components/Test1.vue";

describe("Test1.vue", () => {
  it("测试props传值", () => {
    const msg = "new message";
    const wrapper = shallowMount(Test1, {
      propsData: { msg }
    });
    expect(wrapper.text()).to.include(msg);
  });
});
