<template>
 <div>
    <span id="count">{{count}}</span>
    <button @click="increment">点击</button>
  </div>
</template>
<script>
export default {
  data() {
    return { count: 10};
  },
  methods: {
    increment() {
      this.count++;
    }
  }
};
</script>