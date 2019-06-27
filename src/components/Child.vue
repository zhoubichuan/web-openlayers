<template>
  <div>
    点我显示标签
    <button @click="clickMe">click</button>
  </div>
</template>
<script>
export default {
  props:{
    fn:{}
  },
  methods:{
    clickMe(){
      this.fn('123')
      this.fn('456')
    }
  }
}
</script>



