<template>
    <div class="toolbar-widget">
      <ul class="toolbar-widget__container">
        <li class="toolbar-widget__title">
          <div class="toolbar-widget__label">{{ widgetType }} WIDGET: </div>
          <div class="input-text">
            <widgetname :name="widgetName"></widgetname>
          </div>
        </li>
        <li class="btn-toolbar">
            <a v-on:click.stop.prevent="undo">
                <svg>
                    <use xlink:href="#undo"></use>
                </svg>
            </a>
        </li>
        <li class="btn-toolbar">
            <a v-on:click.stop.prevent="redo">
                <svg>
                    <use xlink:href="#redo"></use>
                </svg>
            </a>
        </li>
        <li class="btn-toolbar button-preview">
            <a v-on:click="showPreview">
                <svg>
                    <use xlink:href="#preview"></use>
                </svg>
            </a>
        </li>
      </ul>
    </div>   
</template>

<script>
    import Widgetname from './Widgetname'
    window.editorUndoOrder = window.editorUndoOrder || {widget: []};
    window.editorUndoCurrentPosition = window.editorUndoCurrentPosition || 0;

    export default {
        name: 'widgetToolbar',
        data () {
            return {
                isActive: false
            }
        },
        components: {
            Widgetname
        },
        props: {
            widgetId: String
        },
        computed: {
            widgetType() {                
                return this.$store.state.widget.widget.widgetType ? this.$store.state.widget.widget.widgetType.name : ''
            },
            widgetName (){
                return this.$store.state.widget.widget.name ? this.$store.state.widget.widget.name : ''
            }
        },
        methods: {
            showPreview: function () {             
                this.$router.push(this.$route.path + '/preview')
            },
            myFilter: function () {
                this.isActive = !this.isActive;
                // some code to filter users
            },
            undo: function () {
                window.undoPressed = true;
                if (editorUndoOrder.widget[editorUndoCurrentPosition].undo.canDo()) {
                    editorUndoOrder.widget[editorUndoCurrentPosition].undo.run()
                }
                if (editorUndoCurrentPosition) {
                    editorUndoCurrentPosition = editorUndoCurrentPosition - 1
                }
            },
            redo: function () {
                window.redoPressed = true;
                if (editorUndoOrder.widget[editorUndoCurrentPosition].undo.canRedo()) {
                    editorUndoOrder.widget[editorUndoCurrentPosition].undo.redo()
                }
                if (editorUndoCurrentPosition + 1 < editorUndoOrder.widget.length) {
                    editorUndoCurrentPosition = editorUndoCurrentPosition + 1
                }
            }
        },
        created (){
            
        }
    }
</script>