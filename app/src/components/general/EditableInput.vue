<template>
  <div class="EditableInput" :class="{'fullWidth': inputVisible, 'locked': locked}" @click="openEdit">

    <wrapper-component :tag="tag" id="eiTemp" class="text">

      <div v-if="!inputVisible" class="textContainer" @click="openEdit();">
        <span class="textSpan">
          {{value}}
        </span>
      </div>

      <div v-if="inputVisible">

        <input ref="input" v-model="textTemp" v-if="type == 'input'" :style="{height: height + 'px'}" @keyup.esc="cancel" @keyup.enter="finishEdit(true)" @blur="onBlur" @focus="onInitEdit()" :placeholder="placeholder"/>

        <textarea ref="input" v-model="textTemp" v-if="type == 'textarea'" :style="{width: '100%', height: height + 'px'}" @keyup.esc="finishEdit(false)" @blur="onBlur" @focus="onInitEdit()" :placeholder="placeholder" @change="calcWidth"></textarea>

      </div>

    </wrapper-component>

  </div>
</template>

<script>

// import Vue from 'vue'
import WrapperComponent from './WrapperComponent'

export default {
  name: 'EditableInput',
  components: {
    WrapperComponent
  },
  props: {
    value: '',
    tag: '',
    placeholder: {default: 'Ange text'},
    type: {default: 'input'},
    focus: false,
    locked: false
  },
  data () {
    return {
      editing: false,
      textTemp: '',
      width: '',
      height: ''
    }
  },
  computed: {
    inputVisible () {
      return this.editing || this.value === ''
      // return this.$refs.input.hasFocus();
    }
  },
  watch: {
  },
  methods: {
    openEdit () {
      if(!this.locked){
        console.log('Open edit')
        this.calcWidth()
        // this.initEdit();
        this.editing = true
        this.textTemp = this.value

        // Next tick: needs to be performed after re-rendering, due to hidden input field
        this.$nextTick(function (input) {
          this.$refs.input.focus()
          this.$refs.input.select()
        })
      }
    },
    initEdit () {

    },
    clearTemp () {
      this.textTemp = ''
    },
    onInitEdit () {
      this.$emit('init-edit')
    },
    cancel () {
      this.editing = false
      this.$emit('cancel')
    },
    onBlur () {
      if (this.editing) {
        this.finishEdit(true)
      }
    },
    finishEdit (emit) {
      console.log('Färdigskriven: ' + this.editing + ' ' + emit)
      if (this.editing && emit) {
        this.editing = false
        this.emitToParent()
      }
    },
    calcWidth () {
      this.$nextTick(function () {
        let el = this.$el.getElementsByClassName('textSpan')[0]
        if (el) {
          this.width = el.offsetWidth
          this.height = el.offsetHeight
        }
      })
    },
    emitToParent () {
      // var val = this.textTemp.trim() !== '' ? this.textTemp : this.placeholder
      this.$emit('input', this.textTemp)
      this.$emit('change', this.textTemp)
    }
  },
  mounted: function () {
    if (this.focus) {
      this.openEdit()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .EditableInput{
    display: inline-block;
    word-break: break-word;
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    hyphens: auto;
  }

  .EditableInput:not(.locked) .textSpan{
    cursor: text;
  }

  #eiTemp {
    margin: 0;
  }

  .textSpan{
  }

  .textSpan:hover{
    color: black;
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
