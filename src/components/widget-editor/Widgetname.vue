<template>
    <div>
        <input type="text"
            v-model="widgetName"
            v-on:keydown="limitInput"
            v-on:keyup="saveWidgetName">
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    name: 'widgetname',
    computed: {
        widgetName: {
            get: function () {
                return this.$store.state.widget.widget.name || ''
            },
            set: function (newValue){
                return newValue;
            }
        }
    },
    props:['name'],
    methods:{
        limitInput: function(e){
            
            // replaces spaces with hyphens
            if(e.key == ' '){
                e.target.value = e.target.value + '-'
            }
            // accepts letters, numbers, and dashes.
            // ignores all other characters.
            if(!/^([A-Za-z0-9\-\_]+)$/.test(e.key)){
                e.preventDefault()
                e.stopPropagation()
            }

        },
        saveWidgetName: _.debounce(function(e){

            this.$store.dispatch('setWidgetName', {
                id: this.$route.params.id,
                name: e.target.value
            });
            
        }, 1000)
    },
}
</script>