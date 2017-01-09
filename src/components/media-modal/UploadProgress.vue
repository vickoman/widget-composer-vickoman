<template>
  <progress :value="progress" max="100" v-if="show"></progress>
</template>

<script>
export default {
  props: ['value', 'completed'],
  watch: {
    value(value){
      var that = this;
      console.log('value changed', value)
      this.progress = value;
      if(value >= 100)
      {
        setTimeout(function(event){
            that.show = false;
        }, 1000);
      }
    },
    completed(completed){
      console.log('completed changed', completed)

    }
  },
  data(){
      return {
        interval: null,
        progress: 0,
        show: true
      }
  },
  beforeMount(){
    this.progress = 0
    this.interval = setInterval(()=>{
        this.updateInterval()
        // console.log('interval', this.progress)
    }, 2000)
  },
  methods:{
    updateInterval(){
      var that = this;
      var random = parseInt(Math.random() * 15)
      // console.log('interval1', this.progress, random)
      this.progress = parseInt(this.progress) + random

      if (this.progress >= 100){
        clearInterval(this.interval)
        setTimeout(function(event){
            that.show = false;
        }, 1000);
      }
    },
  }
}
</script>

<style lang="css">
</style>
