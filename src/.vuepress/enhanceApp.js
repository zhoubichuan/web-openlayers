import utils from '../base/engine/1.utils.vue';
import project from '../base/engine/2.project.vue';
import vuecli from '../base/engine/3.vuecli.vue';
import env from '../base/engine/4.env.vue';
import ui from '../base/engine/5.ui.vue';

export default ({
    Vue
}) => {
    Vue.component('engineutils', utils);
    Vue.component('engineproject', project);
    Vue.component('enginevuecli', vuecli);
    Vue.component('engineenv', env);
    Vue.component('engineui', ui);
}