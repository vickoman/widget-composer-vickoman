<template>
    <div class="modal-mask">
    <div class="modal-wrapper">
        <div class="modal-container">
            <div class="media-modal">
                <div class="media-modal__header">
                    <div class="title-container">
                        <div v-if="templateName" class="title">{{templateName}}</div>
                        <div v-else class="title">Widget Templates</div>                        
                        <a v-on:click="closeModal">
                            <svg >
                                <use xlink:href="#close-x"></use>
                            </svg>
                        </a>
                    </div>
                    <ul class="media-modal__nav" v-if="widgetCatalog">
                        <li  v-on:click="updateFilter" class="selected">All Widgets</li>
                        <li v-on:click="updateFilter">Assessment</li>
                        <li v-on:click="updateFilter">Presentation</li>
                        <li v-on:click="updateFilter">Media</li>
                    </ul>
                </div>
                <div class="media-modal__canvas">
                    <keep-alive>
                        <WidgetCatalog 
                            v-if="widgetCatalog"
                            v-bind:filter="selectedFilter"
                            v-on:templateSelected="showNameWidget"
                            v-on:showInfoForSelected="showInfo">                            
                        </WidgetCatalog>
                        <NameWidget
                            v-if="nameWidget"
                            v-bind:templateId="templateId"
                            v-bind:templateName="templateName"
                            v-on:backToTemplates="showCatalog">
                        </NameWidget>
                        <TemplateInfo
                            v-if="templateInfo"
                            v-bind:templateId="templateId"
                            v-bind:templateName="templateName"
                            v-on:templateSelected="showNameWidget"
                            v-on:backToTemplates="showCatalog">
                        </TemplateInfo>
                    </keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import WidgetCatalog from './WidgetCatalog'
    import NameWidget from './NameWidget'
    import TemplateInfo from './TemplateInfo'
    export default {
        name: 'Modal',
        components: {
            WidgetCatalog,
            NameWidget,
            TemplateInfo
        },
        data (){
            return {
                widgetCatalog: true,
                nameWidget: false,
                templateInfo: false,

                selectedFilter: 'All Widgets',
                templateId: 0,
                templateName: ''

            }
        },        
        methods: {
            closeModal: function(){
                this.$emit('close')
            },
            updateFilter: function(event){
                $('.media-modal__nav li').removeClass("selected")
                $(event.target).addClass("selected")
                this.selectedFilter = $(event.target).text()                
            },
            showNameWidget: function(templateId, templateName){
                this.templateId = templateId;
                this.templateName = templateName;
                this.widgetCatalog = false;
                this.templateInfo = false;
                this.nameWidget = true;                
            },
            showCatalog: function(){
                this.widgetCatalog = true;
                this.nameWidget = false;
                this.templateName  = '';
                this.templateId = 0;   
            },
            showInfo: function(templateId, templateName){
                this.templateId = templateId;
                this.templateName = templateName;
                this.widgetCatalog = false;
                this.templateInfo = true;
                this.nameWidget = false;                
            },
        },
        mounted : function(){
            
        }
    }
</script>