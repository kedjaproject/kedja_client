<template>
  <div class="editableInput">

    <wrapper-component :tag="tag" id="eiTemp" class="text">

      <div v-if="!inputVisible" class="textContainer">
        <span class="textSpan">
          {{value}}
        </span>
        <a class="edit" @click="openEdit();">
          Redigera
        </a>
      </div>

      <div v-if="inputVisible">

        <input ref="input" v-model="textTemp" v-if="type == 'input'" :style="{width: width + 'px', height: height + 'px'}" @keyup.esc="finishEdit(false)" @keyup.enter="finishEdit(true)" @blur="finishEdit(true)" :placeholder="placeholder" />

        <textarea ref="input" v-model="textTemp" v-if="type == 'textarea'" :style="{width: width + 'px', height: height + 'px'}" @keyup.esc="finishEdit(false)" @blur="finishEdit(true)" :placeholder="placeholder" ></textarea>

      </div>

    </wrapper-component>

  </div>
</template>

<script>

import Vue from 'vue'
import { store } from '@/store';
import WrapperComponent from './WrapperComponent';

export default {
  name: 'EditableInput',
  components: {
    WrapperComponent
  },
  props:{
    value: String,
    tag: "",
    placeholder: {default: "Enter text"},
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .textContainer{
    position: relative;
  }

  .textContainer:hover > .textSpan{
    filter: opacity(0.5);
  }

  .textContainer:hover > .edit{
    display: inline;
  }

  .textSpan:hover{

  }

  .edit{
    position: absolute;
    top: 1px;
    left: 1px;
    font-size: 10pt;
    font-weight: normal;
    cursor: pointer;
    background: rgb(240,240,240);
    color: black;
    padding: 4px;
    z-index: 1;
    display: none;
    border: 1px solid lightgray;
    box-shadow: 2px 2px 2px black;
    border-radius: 5px;
  }

  .edit:hover{
    text-decoration: underline;
  }

  input, textarea{
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    padding: 0;
    border: 0px solid black;
  }

  button {
    display: inline-block;
    height: 20px;
  }

</style>
