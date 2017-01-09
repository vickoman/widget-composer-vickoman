<template>
    <div class="panel-content">
        <div class="panel-header">{{panelTitle}}</div>
        <!-- alt text for screen readers -->
        <div class="alt-text-readers-container accordian">
            <a @click="toggleAccordion('Alt Text Screen Readers')">
                <div class="accordian__btn border-top" v-on:click="accordion.readers = !accordion.readers " v-bind:class="{ open: (activeAccordion == $options.filters.hashCode('Alt Text Screen Readers')) }">
                    <svg>
                        <use xlink:href="#arrow-down"  v-if="activeAccordion == $options.filters.hashCode('Alt Text Screen Readers')"></use>
                        <use xlink:href="#arrow-right" v-else></use>
                    </svg>
                    <div class="accordian__title">Alt Text Screen Readers</div>
                </div>
            </a>
            <div class="accordian__container"  v-bind:class="[accordion.readers ? 'panel-closed' : '']" v-if="activeAccordion == $options.filters.hashCode('Alt Text Screen Readers')">
                <ul class="accordian__content">
                    <li class="kds-mb-32">
                        <!-- Widget Short Description -->
                        <div class="input-text">
                            <label class="u-hidden" for="txt-input">Widget Short Description</label>
                            <input type="text" name="" class="txt-input"
                                   placeholder="Widget Short Description" value=""/>
                        </div>
                    </li>
                    <li>
                        <!-- Widget Long Description -->
                        <div class="textarea-line-container">
                            <label class="u-hidden" for="txtarea-line">Widget Long Description</label>
                        <textarea type="text" class="textarea-line" rows='1' placeholder="Widget Long Description"></textarea>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- alt text for assets -->
        <div class="alt-text-assets-container accordian">
            <a @click="toggleAccordion('Alt Text Assets')">
                <div class="accordian__btn" v-on:click="accordion.assets = !accordion.assets " v-bind:class="{ open: (activeAccordion == $options.filters.hashCode('Alt Text Assets')) }">
                    <svg>
                        <use xlink:href="#arrow-down"  v-if="activeAccordion == $options.filters.hashCode('Alt Text Assets')"></use>
                        <use xlink:href="#arrow-right" v-else></use>
                    </svg>
                    <div class="accordian__title">Alt Text Assets</div>
                </div>
            </a>
            <div class="accordian__container" v-bind:class="[accordion.assets ? 'panel-closed' : '']" v-if="activeAccordion == $options.filters.hashCode('Alt Text Assets')">
                <ul class="accordian__content">
                    <li v-for="(item, index) in widgetDataItems" class="kds-mb-40">
                        <div class="image-text-input">
                            <div class="image-lockup">
                                <div class="image-file-name">{{ item.name }}</div>
                                <img :src="item.url" alt="">
                                <div class="input-text">
                                    <label class="u-hidden" for="txt-input">Alt Text</label>
                                    <input type="text" name="" class="txt-input" placeholder="Alt Text"
                                           @input="addAltText(index, $event)" :value="item.alt" />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    export default {
        name: 'accesibility',
        data () {
            return {
                panelTitle: 'Accessibility',
                accordion : {
                    assets:true,
                    readers:true
                },
                activeAccordion: false
            }
        },
        computed: {
            widgetDataItems() {
                return this.$store.state.widget.widget.data.items;
            }
        },
        methods: {
            toggleAccordion: function (accordion) {
                console.log(this.$store.getters.getWidgetData);
                if(this.activeAccordion == this.$options.filters.hashCode(accordion))
                {
                    this.activeAccordion = false;
                }else{
                    this.activeAccordion = this.$options.filters.hashCode(accordion);
                }
            },
            setWidgetData: _.debounce(function(items){
                let data = _.clone(this.$store.state.widget.widget.data);
                data.items = items;
                this.$store.dispatch('setWidgetData', {
                    id: this.$route.params.id,
                    data: data
                });
            }, 1000),
            addAltText(index, event) {
                let items = _.map(this.widgetDataItems, _.clone);
                items[index]['alt'] =  event.target.value;
                this.setWidgetData(items);
            },
        }
    }
</script>