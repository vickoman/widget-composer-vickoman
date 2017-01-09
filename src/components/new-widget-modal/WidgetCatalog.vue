<template>
    <div>
        <template v-if="widgetTypes.length">

            <ul class="widget-templates-grid">
                <template v-for="template in widgetTypes">
                    <li v-if="filter == template.category || filter == 'All Widgets'">
                        <template v-if="template.status == 'enabled'">                            
                            <div class="widget-template-box active">
                                <div class="widget-template-link-container">
                                    <svg>
                                        <use v-bind:xlink:href="'#'+template.icon"></use>
                                    </svg>
                                    <button class="button-standard-green"
                                        v-bind:id="template.id"
                                        v-bind:data-name="template.name"
                                        v-on:click="selectTemplate">
                                        Start
                                    </button>
                                </div>
                                <div class="widget-template-name-container">
                                    <h4>{{template.name}}
                                        <a class="template-info-link"
                                            v-bind:id="template.id"
                                            v-bind:data-name="template.name"
                                            v-on:click="viewInfo">                                            
                                            <svg>
                                                <use xlink:href="#info-solid"></use>
                                            </svg>                                        
                                        </a>
                                    </h4>
                                </div>
                            </div>
                            
                        </template>
                        <template v-else>
                            <div class="widget-template-box">
                                <div class="widget-template-link-container">
                                    <svg>
                                        <use v-bind:xlink:href="'#'+template.icon"></use>
                                    </svg>                                    
                                </div>
                                <div class="widget-template-name-container">
                                    <h4>{{template.name}}
                                        <a class="template-info-link">                                            
                                            <svg>
                                                <use xlink:href="#info-solid"></use>
                                            </svg>                                        
                                        </a>
                                    </h4>
                                </div>
                            </div>
                        </template>                        
                    </li>
                </template>
            </ul>
        </template>
        <template v-else>
            <knowbly-loader></knowbly-loader>
        </template>
    </div>
</template>

<script>

    import KnowblyLoader from './../KnowblyLoader'
    export default {
        name: 'WidgetCatalog',
        components:{
            KnowblyLoader
        },
        props:['filter'],
        computed: {
            widgetTypes() {
                return _.sortBy(this.$store.getters.getWidgetTypes, 'name' )
            }
        },
        created () {
            this.fetchData();     
        },
        methods: {
            fetchData () {
                this.widgetTypes = this.$store.dispatch('getTemplateTypes');
            },
            selectTemplate: function(e){
                var selectedTemplateEl = $(e.target).closest('button')[0];
                this.$emit('templateSelected', selectedTemplateEl.id, $(selectedTemplateEl).data("name"))
            },
            viewInfo: function(e){
                e.preventDefault();
                e.stopPropagation();
                var selectedTemplateEl = $(e.target).closest('a')[0];
                this.$emit('showInfoForSelected', selectedTemplateEl.id, $(selectedTemplateEl).data("name"))
            }

        }
    }
</script>
