import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Test2 from "@/components/Test2.vue";

describe("Test2.vue", () => {
  it("测试点击事件", () => {
    let wrapper = shallowMount(Test2);
    wrapper.setData({ count: 10 });
    expect(wrapper.find("span").text()).to.be.equal("10");
    wrapper.find("button").trigger("click");
    expect(wrapper.find("span").text()).to.be.equal("11");
  });
});
