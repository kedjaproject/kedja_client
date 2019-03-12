<script>

export default {
  name: 'WrapperComponent',
  render(createElement) {
    return createElement(
      this.tag,   // tag name
      this.$slots.default // array of children
    );
  },
  props:{
    tag: {type: String, required: true,},
  },
}
</script>
