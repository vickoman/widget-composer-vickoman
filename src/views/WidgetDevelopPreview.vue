<template>
    <div class="widget-container">
        <Widget widgetMode="preview"></Widget>
    </div>

</template>
<script>
import Widget from '../components/widget-editor/Widget'

export default {
    name: 'widget-develop-preview',
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
            widget:null
        }
    },
    created () {
        this.fetchData()
    },
    methods:{
        fetchData: function(){
          this.widget =  this.$store.dispatch('getWidget', this.$route.params.id);
        }
    }
}
</script>

<style type="text/css" scoped>
    .widget-container {
        height: 100vh;
        padding: 40px;
    }
</style>