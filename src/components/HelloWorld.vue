<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <span id="count">{{count}}</span>
      <button @click="increment">点击</button>
    </div>
    <div>
      <Child @show="show"></Child>
      <p id="content" v-if="flag">{{name}}</p>
    </div>
  </div>
</template>

<script>
import Child from "./Child.vue";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return { count: 10, name: "姜文", flag: false };
  },
  methods: {
    show() {
      this.flag = true;
    },
    increment() {
      this.count++;
    }
  },
   components: {
      Child
    }
};
</script>