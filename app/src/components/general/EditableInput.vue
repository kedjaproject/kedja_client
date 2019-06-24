<template>
  <div class="EditableInput" :class="{'fullWidth': inputVisible}">

    <wrapper-component :tag="tag" id="eiTemp" class="text">

      <div v-if="!inputVisible" class="textContainer" @click="openEdit();">
        <span class="textSpan">
          {{value}}
        </span>
      </div>

      <div v-if="inputVisible">

        <input ref="input" v-model="textTemp" v-if="type == 'input'" :style="{height: height + 'px'}" @keyup.esc="finishEdit(false)" @keyup.enter="finishEdit(true)" @blur="finishEdit(true)" :placeholder="placeholder" />

        <textarea ref="input" v-model="textTemp" v-if="type == 'textarea'" :style="{width: width + 'px', height: height + 'px'}" @keyup.esc="finishEdit(false)" @blur="finishEdit(true)" :placeholder="placeholder" @change="calcWidth"></textarea>

      </div>

    </wrapper-component>

  </div>
</template>

<script>

import Vue from 'vue'
import WrapperComponent from './WrapperComponent';

export default {
  name: 'EditableInput',
  components: {
    WrapperComponent
  },
  props:{
    value: String,
    tag: "",
    placeholder: {default: "Ange text"},
    type: {default: "input"}
  },
  data () {
    return {
      editing: false,
      textTemp: String,
      width: "",
      height: ""
    }
  },
  computed:{
    inputVisible: function () {
      return this.editing || this.value == "";
    }
  },
  watch: {
  },
  methods: {
    openEdit: function (){
      this.calcWidth();
      this.editing = true;
      this.textTemp = this.value;

      //Next tick: needs to be performed after re-rendering, due to hidden input field
      this.$nextTick(function (input) {
        this.$refs.input.focus();
        this.$refs.input.select();
      })

    },
    finishEdit(emit){
      if(this.editing && emit){
        this.emitToParent();
      }
      this.editing = false;
    },
    calcWidth: function () {
      this.$nextTick(function () {
        let el = this.$el.getElementsByClassName("textSpan")[0];
        if(el){
          this.width = el.offsetWidth;
          this.height = el.offsetHeight;
        }
      })
    },
    emitToParent: function () {
      var val = this.textTemp.trim() !== "" ? this.textTemp : this.placeholder;
      this.$emit('input',val);
      this.$emit('change',val);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .EditableInput{
    cursor: text;
    display: inline-block;
  }

  .textSpan{
  }

  .textSpan:hover{
    color: #ACCECC
  }

  input, textarea{
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    padding: 0;
    border: 0px solid black;
    width: 100%;
  }

</style>
