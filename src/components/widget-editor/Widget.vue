<template>
    <div id="widget">
        <!-- Widget Title Field -->
        <WidgetRichTextField
            className="title"
            placeholder="Title"
            :widgetMode="widgetMode"
            :content="widgetData.title"
            :widgetData="widgetData"
            v-on:richTextChanged="richTextChanged">
        </WidgetRichTextField>

        <!-- Widget Introduction Field -->
        <WidgetRichTextField
            className="introduction"
            placeholder="Introduction"
            :widgetMode="widgetMode"
            :content="widgetData.introduction"
            :widgetData="widgetData"
            v-on:richTextChanged="richTextChanged">
        </WidgetRichTextField>

        <!-- Widget Component dinamically loaded -->
        <component
            :is="widgetContentComponent"
            :widgetMode="widgetMode">
        </component>

        <!-- Widget Caption Field -->
        <WidgetRichTextField
            className="caption"
            placeholder="Caption"
            :widgetMode="widgetMode"
            :content="widgetData.caption"
            :widgetData="widgetData"
            v-on:richTextChanged="richTextChanged">
        </WidgetRichTextField>

        <!-- Widget Credit Field -->
        <WidgetRichTextField
            className="credit"
            placeholder="Credit"
            :widgetMode="widgetMode"
            :content="widgetData.credit"
            :widgetData="widgetData"
            v-on:richTextChanged="richTextChanged">
        </WidgetRichTextField>

    </div>
</template>

<script>
import WidgetRichTextField from './WidgetRichTextField'
import Flashcards from '../widgets/Flashcards'
import MediaGallery from '../widgets/MediaGallery'

export default {
    name: 'widget',
    components: {
        WidgetRichTextField,
        Flashcards,
        MediaGallery
    },
    // data (){
    //     return {
    //         data: {}
    //     }
    // },
    props:['widgetMode'],
    created: function () {

        // this.$store.dispatch('getWidgetData', this.$route.params.id);

        // this.$on('froalachanged', function (editor, group) {
        //     console.log('froalachanged', editor, group)
        // })
        // this.$on('changed', function (editor, group) {
        //     console.log('froalachanged', editor, group)
        // })
    },
    computed: {


        widgetData:  {
            get:  function (){
                return this.$store.state.widget.widget.data? this.$store.state.widget.widget.data : ''
            } ,
            set: function (newValue) {
                this.widgetData = newValue;
            }

        },

        widgetType:  {
            get:  function (){
                return this.$store.state.widget.widget.widgetType? this.$store.state.widget.widget.widgetType.name : ''
            } ,

        },


        widgetContentComponent(){
            // TODO: use regex and also replace & characters
            return this.widgetType.replace(" ", "");
        },
        // widgetHeaderComponent(){
        //     if (this.$store.state.widget.widget.widgetTypeId == 1){
        //         return null;
        //     }
        // },
        // widgetFooterComponent(){
        //     if (this.$store.state.widget.widget.widgetTypeId == 1){
        //         return null;
        //     }
        // }
    },
    methods:{
        richTextChanged: function(newContent, className){
// _({pepe:1, pepe2:undefined}).each((item, i, p)=>{})
            var newData = _.clone(this.widgetData);
            // console.log('0)
            newData[className] = newContent

            //console.log('newData1', newContent, className, JSON.stringify(newData), newData)

            this.$store.dispatch('setWidgetData', {
                id: this.$route.params.id,
                data: newData
            });
        }
    }
}
</script>