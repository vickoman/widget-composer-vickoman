<template>
    <div class="panel-content">
        <div class="panel-header">Metadata</div>
        <template v-if="metadata">
            <!-- <pre>{{metadata}}</pre> -->
            <template v-for="(metadataSection, sectionIndex) in metadata.content">
                <!-- <pre>{{metadataSection}}</pre> -->
                <div class="description-container accordian">
                    <a @click="toggleAccordion(metadataSection.sectionTitle)">
                        <div class="accordian__btn" v-bind:class="{ open: (activeAccordion == $options.filters.hashCode(metadataSection.sectionTitle)) }">
                                <svg>
                                    <use xlink:href="#arrow-down"  v-if="activeAccordion == $options.filters.hashCode(metadataSection.sectionTitle)"></use>
                                    <use xlink:href="#arrow-right" v-else></use>
                                </svg>
                            
                            <div class="accordian__title">{{metadataSection.sectionTitle}}</div>
                        </div>
                    </a>
                    <div class="accordian__container" v-if="activeAccordion == $options.filters.hashCode(metadataSection.sectionTitle)"><!-- panel-closed -->
                        <ul class="accordian__content">
                            <li class="kds-mb-16">
                                <template v-for="(metadataItem, itemIndex) in metadataSection.sectionItems">
                                    <!-- Text Input component -->
                                    <template v-if="metadataItem.type == 'text-input'">
                                        <textinput 
                                            :label="metadataItem.label"
                                            :value="metadataItem.value"
                                            :sectionId="sectionIndex"
                                            :itemId="itemIndex"
                                            v-on:textinputChanged="simpleMetadataChanged">
                                        </textinput>                                   
                                    </template>
                                    <!-- Textarea component -->
                                    <template v-if="metadataItem.type == 'textarea'">
                                        <textareainput 
                                            :label="metadataItem.label"
                                            :value="metadataItem.value"
                                            :sectionId="sectionIndex"
                                            :itemId="itemIndex"
                                            v-on:textareainputChanged="simpleMetadataChanged">
                                        </textareainput>                                                                    
                                    </template>
                                    <!-- Dropdown component -->
                                    <template v-if="metadataItem.type == 'language-dropdown'">
                                        <languagedropdown 
                                            :label="metadataItem.label"
                                            :value="metadataItem.value"
                                            :valueName="metadataItem.valueName"
                                            :sectionId="sectionIndex"
                                            :itemId="itemIndex"
                                            v-on:languageinputChanged="simpleMetadataChanged">
                                        </languagedropdown>                                    
                                    </template>
                                    <!-- Time component -->
                                    <template v-if="metadataItem.type == 'time'">
                                        <timerange 
                                            :label="metadataItem.label"
                                            :value="metadataItem.value"
                                            :valueName="metadataItem.valueName"
                                            :sectionId="sectionIndex"
                                            :itemId="itemIndex"
                                            v-on:timerangeChanged="simpleMetadataChanged">
                                        </timerange>                                    
                                    </template> 
                                    <!-- Age Range component -->
                                    <template v-if="metadataItem.type == 'age-range'">
                                        <agerange 
                                            :label="metadataItem.label"
                                            :fromValue="metadataItem.from"
                                            :toValue="metadataItem.to"
                                            :valueName="metadataItem.valueName"
                                            :sectionId="sectionIndex"
                                            :itemId="itemIndex"
                                            v-on:timerangeChanged="ageMetadataChanged">
                                        </agerange>                                    
                                    </template>                                    

                                </template>                            
                            </li>
                            
                        </ul>
                </div>
            </template>

        </template>
    </div>

</template>
<script>
import Textinput from './metadata/Textinput'
import Textareainput from './metadata/Textareainput'
import Languagedropdown from './metadata/Languagedropdown'
import Timerange from './metadata/Timerange'
import Agerange from './metadata/Agerange'

export default {
    name: 'metadata',
    components:{
        Textinput,
        Textareainput,
        Languagedropdown,
        Timerange,
        Agerange
    },
    data () {
        return {
            accordion : {
                description:true,
                sources:true,
                profile:true
            },
            metadatas: null,
            activeAccordion: false
        }
    },
    computed: {
        metadata() {
            return this.$store.getters.getWidgetMetadata
        }
    },
    created () {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData()        
    },
    watch: {
        // call again the method if the route changes
        '$route': 'fetchData'
    },
    methods: {

        fetchData () {
            this.metadata = this.$store.getters.getWidgetMetadata
        },
        
        simpleMetadataChanged: function (sectionId, itemId, newValue) {

            var newMetadata = JSON.parse(JSON.stringify(this.metadata.content));

            newMetadata[sectionId].sectionItems[itemId].value = newValue;

            this.metadata = newMetadata;

            this.$store.dispatch('setWidgetMetadata', newMetadata);
        },
        ageMetadataChanged: function (sectionId, itemId, value1, value2) {

            var newMetadata = JSON.parse(JSON.stringify(this.metadata.content));

            newMetadata[sectionId].sectionItems[itemId].from = value1;
            newMetadata[sectionId].sectionItems[itemId].to = value2;

            this.metadata = newMetadata;
            
            this.$store.dispatch('setWidgetMetadata', newMetadata);
        },
        toggleAccordion: function (accordion) {
            if(this.activeAccordion == this.$options.filters.hashCode(accordion))
            {
                this.activeAccordion = false;
            }else{
                this.activeAccordion = this.$options.filters.hashCode(accordion);
            }
        },
    }
}
</script>