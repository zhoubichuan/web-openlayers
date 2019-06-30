<template>
  <div>
    <Child @show="show"></Child>
    <p id="content" v-if="flag">{{name}}</p>
  </div>
</template>
<script>
import Child from "./Child.vue";
export default {
  data() {
    return {name: "javascript", flag: false };
  },
  methods: {
    show() {
      this.flag = true;
    }
  },
   components: {
      Child
    }
};
</script>