import utils from '../base/engine/utils.vue';
import project from '../base/engine/project.vue';
import vuecli from '../base/engine/vuecli.vue';
import env from '../base/engine/env.vue';
import ui from '../base/engine/ui.vue';

export default ({
    Vue
}) => {
    Vue.component('engineutils', utils);
    Vue.component('engineproject', project);
    Vue.component('enginevuecli', vuecli);
    Vue.component('engineenv', env);
    Vue.component('engineui', ui);
}