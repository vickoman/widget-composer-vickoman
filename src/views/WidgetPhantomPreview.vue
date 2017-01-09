<template>

    <div class="widget-preview">
        <div class="widget-wrapper">
            <div class="widget-container phantom-container">
                <Widget :widgetMode="widgetMode"></Widget>
            </div>
        </div>
    </div>

</template>
<script>
import Widget from '../components/widget-editor/Widget'

export default {
    name: 'widget-phantom-preview',
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
<style lang="scss" scoped>
    $width:  776px!important;
    $height:  548px!important;

    .widget-preview{
        padding: 0!important;
        .widget-wrapper{
            margin: 0!important;
            padding: 0!important;
            left: 0px!important;
            width: $width;
            height: $height;
            .phantom-container{
                overflow: hidden;
                left: 0px!important;
                width: $width;
                height: $height;
                border: none!important;
                #widget{
                    width: $width;
                    height: 523px!important;
                }
            }

        }
    }
    
    
    body{
        overflow: hidden !important
    }
    .__cov-progress{
        display: none
    }

</style>
