<template>
  <img :src="src" :alt="alt" :style="{ height, width }" class="avatar" />
</template>

<script>
export default {
  name: "AvatarComponent",
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: "32px"
    },
    width: {
      type: String,
      default: "32px"
    }
  }
};
</script>

<style scoped lang="scss">
.avatar {
  margin: 0 6px 0 0;
  max-width: 36px;
  max-width: 36px;
  border-radius: 50%;
}
</style>
