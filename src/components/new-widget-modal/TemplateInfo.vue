<template>
    <div class="template-info-component">
        
        <template v-if="templateId" v-for="template in templates">

            <div class="template-info-content">
                <h3>When to use the <br/>{{template.name}} Widget</h3>
                <div v-html="template.info"></div>
            </div>

            <div class="template-info-sample">
                <!-- <iframe width="565" height="409" v-bind:src="'../../../'+template.sampleLink" frameborder="0">
                
            </iframe> -->
                <iframe width="565" height="409" src="/widget-editor/1/preview/develop" frameborder="0"></iframe>
            </div>


            

            
            <a class="media-modal-nav-link left-link" v-on:click="backToTemplates">
                <svg>
                    <use xlink:href="#navigation-previous"></use>
                </svg> Back to templates 
            </a>
            <a class="media-modal-nav-link right-link"
                v-bind:id="templateId"
                v-bind:data-name="templateName"
                v-on:click="selectTemplate">
                Start Building
                <svg>
                    <use xlink:href="#navigation-next"></use>
                </svg>
            </a>
        </template>
        <template v-else>
            <knowbly-loader></knowbly-loader>
        </template>
    </div>
</template>

<script>

    import KnowblyLoader from './../KnowblyLoader'
    export default {
        name: 'TemplateInfo',
        components:{
            KnowblyLoader
        },
        data (){
            return {
                widgetName: ''
            }
        },
        props:['templateId', 'templateName'],
        computed: {
            templates() {
                var templateId = this.templateId;
                return _.filter(this.$store.getters.getWidgetTypes, function(template) {
                    return template.id ==  templateId;
                });
            }
        },
        methods:{
            backToTemplates: function(){
                this.$emit('backToTemplates')
            },
            selectTemplate: function(e){
                var selectedTemplateEl = $(e.target).closest('a')[0];
                this.$emit('templateSelected', selectedTemplateEl.id, $(selectedTemplateEl).data("name"))
            },
        }
    }
</script>
