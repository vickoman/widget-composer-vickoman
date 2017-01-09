<template>
    <div class="panel-content">
        <div class="help-content" v-html="this.$store.state.widget.widget.widgetType?this.$store.state.widget.widget.widgetType.help:''"></div>
    </div>
</template>
<script>
    export default {
        name: 'help',
        data () {
            return {
                panelTitle: 'Help',
            }
        },
    }
</script>