<template>

    <div class="widget-editor">
        <!--Header -->
        
        <WidgetComposerHeader/>
        <!-- Widget Editor Workspace -->
        <div class="workspace">
            <!-- Widget Canvas -->
            <div class="canvas">

                <Modal v-if="showModal" @close="showModal = false" :tabSelected="tabSelected" :dataTransfer="dataTransfer" :cmTab="true"></Modal>
                <!--toolbar -->
                <WidgetToolbar/>
                <!--toolbar -->
                <div class="artboard-container">
                    <WidgetTools :tools="tools"/>
                    <div class="artboard">
                        <Widget :widgetMode="widgetMode"/>
                    </div>
                </div>
            </div>
            <!-- Panels -->
            <Panels v-bind:widget="$store.state.widget"/>
            <!-- Sidebar -->
            <Sidebar v-bind:widget="$store.state.widget"/>
        </div>
    </div>



</template>

<script>
    import Widget from '../components/widget-editor/Widget'
    import Panels from '../components/widget-editor/WidgetEditorPanels'
    import WidgetComposerHeader from '../components/widget-editor/WidgetComposerHeader'
    import Sidebar from '../components/widget-editor/Sidebar'
    import WidgetToolbar from '../components/widget-editor/WidgetToolbar'
    import WidgetTools from '../components/widget-editor/WidgetTools'
    import Modal from '../components/media-modal/Modal'

    export default {
        name: 'widget-editor',
        components: {
            Widget,
            Panels,
            WidgetComposerHeader,
            Sidebar,
            WidgetToolbar,
            WidgetTools,
            Modal
        },
        computed: {
            widget() {
                return this.$store.state.widget
            },

            tools:  {            
                get:  function (){
                    return this.$store.state.widget.widget.widgetType? this.$store.state.widget.widget.widgetType.widgetTools : []                 
                }                
            },

        },
        mounted: function() {
            var self = this;
            this.$bus.$on('data-transfer', function(i){
                self.dataTransfer = {on: true, index: i};
                self.openModal('upload');
            });
        },
        data () {
            return {
                widgetId: this.$route.params.id,
                showModal: false,
                tabSelected: "",
                widgetMode: this.$route.name,
                dataTransfer: {on: false, index:null}
            }
        },
        beforeCreate () {
            this.$store.dispatch('getWidget', this.$route.params.id)
            // this.$store.dispatch('setWidgetData', {
            //     id: this.$route.params.id,
            //     data: [
            //       {"datatype":"media", "id": 3},
            //       {"datatype":"media", "id": 4}
            // ]})
        },
        watch: {
            $route () {
                this.$store.dispatch('getWidget', this.$route.params.id)
            }
        },
        methods: {

            openModal: function (selection) {
                this.tabSelected = selection
                this.showModal = true
            }
        }
    }
</script>
