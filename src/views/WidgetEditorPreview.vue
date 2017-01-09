<template>

    <div class="widget-preview">
        <ul class="widget-preview-sidebar">
            <template v-for="device in devices">
                <li>
                    <a @click="setDevice(device)" v-bind:class="[deviceClass == device ? 'active' : '', device]">
                        <svg>
                            <use v-bind:xlink:href="'#device-' + device"></use>
                        </svg>
                    </a>
                </li>                
            </template>
        </ul>

        <a v-if="deviceClass != 'computer'"
            v-bind:class="['rotate-device', deviceClass, orientation]"
            v-on:click="toggleOrientation">
            <svg v-if="orientation == 'portrait'">
                <use xlink:href="#flip-down"></use>
            </svg>
            <svg v-else>
                <use xlink:href="#flip-up"></use>
            </svg>
        </a>             

        <div v-bind:class="['widget-wrapper', deviceClass, orientation]">
            <div v-bind:class="['widget-container', deviceClass, orientation]">
                <Widget :widgetMode="widgetMode"></Widget>
            </div>
        </div>

        <a class="close-preview" @click="stepBack()">
            <svg>
               <use xlink:href="#close-x"></use>
            </svg>
        </a>
    </div>
    
</template>
<script>
import Widget from '../components/widget-editor/Widget'

export default {
    name: 'widget-editor',
    components: {
        Widget
    },
    computed: {
        widget() {
            return this.$store.state.widget
        }
    },
    data () {
        return {
            widgetId: this.$route.params.id,
            widgetMode: this.$route.name,
            widget:null,
            deviceClass : 'computer',
            orientation : 'portrait',
            devices: ['computer', 'tablet', 'phone']
        }
    },
    created () {
        this.fetchData()
    },
    methods:{
        fetchData: function(){
          this.widget =  this.$store.dispatch('getWidget', this.$route.params.id);
        },
        setDevice: function(device){
            this.deviceClass = device;
        },
        toggleOrientation : function(){
            if(this.orientation==='portrait'){
                this.orientation = 'landscape'
            }else if(this.orientation === 'landscape'){
                this.orientation='portrait'
            }
        },
        stepBack : function(){
            if(history.length>2){
                this.$router.back()
            }else{
                return false;
            }
        }

    }
}
</script>