<template>
  <div>
    <ClientOnly>
      <!-- <a href="/Example1.vue">下载</a> -->
      <div class="container">
        <slot>
          <iframe
            :src="url"
            width="100%"
            height="520"
            frameborder="no"
            border="0"
            scrolling="yes"
          ></iframe>
        </slot>
      </div>
      <div>
        <!-- <code>{{ require("./Example1.vue").default }}</code> -->
      </div>
    </ClientOnly>
  </div>
</template>
<script>
export default {
  name: "Container",
  props: {
    url: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  border: 1px solid lightcoral;
  border-radius: 5px;
  padding: 5px;
}
</style>
