import xminder from "./xmind.vue";
import copy from "./copy";
import config from "@/config";
import ui from "@/ui";

export default ({ Vue }) => {
  Vue.component("xminder", xminder);
  setTimeout(() => {
    try {
      document &&
        (() => {
          //对document的判断是防止编译的时候报错
          // copy()
        })();
    } catch (e) {
      console.error(e.message);
    }
  }, 500);
  Vue.use(ui);
  Vue.use(config);
};
