<template>
    <div class="panel panel-widget-composer">
        
        <settings></settings>
        <metadata class="panel-metadata"></metadata>        
        <accessibility class="panel-accessibility"></accessibility>
        <comments v-bind:widget="widget" class="panel-comments"></comments>
        <help class="panel-help"></help>
    </div>
</template>
<script>

    import Settings from './Settings'
    import Metadata from './Metadata'
    import Accessibility from './Accessibility'
    import Comments from './Comments'
    import Help from './Help'


    export default {
        name: 'widgetEditorPanels',
        components: {
            Settings,
            Metadata,
            Accessibility,
            Comments,
            Help
        },
        props:['widget']
    }
</script>