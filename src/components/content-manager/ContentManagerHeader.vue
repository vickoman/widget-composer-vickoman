<template>
    <header>
        <div class="content-manager-header">
            <router-link to="/home" class="logo">
                <svg class="logo-mark">
                    <use xlink:href="#logo-mark"></use>
                </svg>
                <svg class="logo-letters">
                    <use xlink:href="#logo-letters"></use>
                </svg>
            </router-link>
            <div class="search-container">                
                <div class="search-bar-container">                    
                    <input type="text" class="search-input"
                        v-model="query"
                        v-on:keyup.188="converToPill"
                        v-on:focus="activeBar = !activeBar "
                        v-on:blur="activeBar = !activeBar "
                        @keyup.enter="search()">
                    <svg class="search-icon">
                        <use xlink:href="#search"></use>
                    </svg>

                </div>
                <div class="search-filters">
                    <a @click="showFilters = !showFilters">Filters
                        <svg>
                            <use xlink:href="#arrow-down" v-if="!showFilters"></use>
                            <use xlink:href="#arrow-up" v-if="showFilters"></use>
                        </svg>
                    </a>
                    <a @click="clearAll()">Clear All</a>
                </div>                
            </div>
            <a class="user-menu">
                <div class="avatar"
                     v-bind:style="'background-image:url('+ this.$store.state.auth.user.profilePicture +')'">
                </div>
                <svg>
                    <use xlink:href="#caret-down"></use>
                </svg>
            </a>
        </div>
        <div class="filters__container" v-bind:class="{'top--slide' :showFilters}" v-if="showFilters">
            <div class="filters__container__terms" v-if="selectedFilters.length">
                <p class="font-sm type">FILTERS :</p>
                <ul class="filters__container__list width-95">
                    <li class="filters__container__list__item" v-for="filter in selectedFilters">
                        <span>{{filter.name}}</span>
                        <button class="btn btn--rounded--small" @click="unSelectFilter(filter)">
                            <svg>
                                <use xlink:href="#close-x"></use>
                            </svg>
                        </button>
                    </li>
                </ul>
                <button class="btn kds-float-r kds-align-start" @click="clearFilters()">
                    <svg>
                        <use xlink:href="#close-x"></use>
                    </svg>
                </button>
            </div>
            <div class="kds-clear kds-mb-8"></div>
            <div class="filters__category kds-mb-8">
                <div class="filter__category__list kds-mt-8">
                    <strong class="font-sm type">Projects</strong>
                    <ul class="kds-mt-16 kds--br kds--b--gray">
                        <checkbox v-for="project in clientFilters.projects"
                                  class="filter__category__item content-manager-filter"
                                  :label="project.name"
                                  :defaultValue="project.name"
                                  :renderedId="'project-' + project.id"
                                  v-on:checkboxChanged="toggleFilter">
                        </checkbox>
                    </ul>
                </div>
                <div class="filter__category__list kds-mt-8">
                    <strong class="font-sm type kds-ml-16">Tag</strong>
                    <ul class="kds-mt-16 kds-ml-16 kds--br kds--b--gray">
                        <checkbox v-for="tag in clientFilters.tags"
                                  class="content-manager-filter width-10"
                                  :label="tag.name"
                                  :defaultValue="tag.id"
                                  :renderedId="'tag-' + tag.id"
                                  v-on:checkboxChanged="toggleFilter">
                        </checkbox>
                    </ul>
                </div>
                <div class="filter__category__list kds-mt-8">
                    <strong class="font-sm type kds-ml-16">Creator</strong>
                    <ul class="kds-mt-16 kds-ml-16 ">
                        <checkbox v-for="creator in clientFilters.users"
                                  class="content-manager-filter width-10"
                                  :label="creator.firstName +' ' + creator.lastName"
                                  :defaultValue="creator.id"
                                  :renderedId="'creator-' + creator.id"
                                  v-on:checkboxChanged="toggleFilter">
                        </checkbox>
                    </ul>
                </div>
            </div>
        </div>
        <div class="content-manager__toolbar">
            <div class="toolbar-buttons width-70">
                <div class="toolbar--button font-md type kds-ml-64">
                    <button v-on:click="showSelection = !showSelection; addButtonOnly = true"
                            class="btn btn--rounded btn--green">
                        <svg>
                            <use xlink:href="#add"></use>
                        </svg>
                    </button>
                    <div class="kds--absolute" v-if="showSelection">
                        <div class="dropdown">
                            <ul class="dropdown__content">
                                <li v-on:click="openModal">Upload Media</li>
                                <li v-on:click="openWidgetCreateModal">New Widget</li>
                                <li class="disabled">New Slate</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="toolbar--button toolbar--tab font-md type"><a class="toolbar--button--current"
                                                                          @click="filter()">All</a></div>
                <div class="toolbar--button toolbar--tab font-md type"><a @click="filter()">Slates</a></div>
                <!--<div class="toolbar&#45;&#45;button font-md type"><a @click="filter()">Cards</a></div>-->
                <div class="toolbar--button toolbar--tab font-md type"><a @click="filter()">Widgets</a></div>
                <div class="toolbar--button toolbar--tab font-md type"><a @click="filter()">Media</a></div>
                <div class="toolbar--button toolbar--tab font-md type"><a @click="filter()">Favorites</a></div>
            </div>
            <div class="toolbar-buttons width-15 kds-ml-16">
                <div class="toolbar--button--filter" @click="showTag = !showTag"
                     v-bind:class="{'kds--disabled-icon':!hasSelected}">
                    <svg>
                        <use xlink:href="#tag"></use>
                    </svg>
                </div>
                <Tagger v-if="showTag || hideTag" :tags="null" :label="'Tags'" v-on:selectedTag="selectedTag"
                        v-on:queryTag="tagQuery" :isPreview="false"/>
                <div class="toolbar--button--filter" v-bind:class="{'kds--disabled-icon':!hasSelected}"
                     @click="!allFavorites ? setFavorites() : unsetFavorites()">
                    <svg>
                        <use xlink:href="#favorite-outlined" v-if="!$store.state.containers.favorites"></use>
                        <use xlink:href="#favorite-solid" v-if="$store.state.containers.favorites"></use>
                    </svg>
                </div>
                <div class="toolbar--button--filter" v-bind:class="{'kds--disabled-icon':!hasSelected}">
                    <svg>
                        <use xlink:href="#copy"></use>
                    </svg>
                </div>
                <div class="toolbar--button--filter toolbar--button-filter-border"
                     v-bind:class="{'kds--disabled-icon':!hasSelected}">
                    <svg>
                        <use xlink:href="#bin"></use>
                    </svg>
                </div>
            </div>
            <div class="toolbar-buttons width-10 kds-ml-16">
                <div class="toolbar--button--filter">
                    <Dropdown :label="''" :value="sortItems" :list="sortList" v-on:inputChanged="dropDownChanged"/>
                </div>
                <div class="toolbar--button--filter" @click="itemsList()">
                    <svg>
                        <use xlink:href="#list-view" v-if="isGrid"></use>
                        <use xlink:href="#thumbnail-view" v-if="!isGrid"></use>
                    </svg>
                </div>
                <div class="toolbar--button--filter" v-bind:class="{'kds--disabled-icon':!hasSelected}"
                     @click="openInfo();">
                    <svg>
                        <use xlink:href="#metadata"></use>
                    </svg>
                </div>
            </div>
        </div>
    </header>

</template>
<script>
    import Checkbox from '../widget-editor/settings/Checkbox'
    import Dropdown from '../common/Dropdown'
    import Tagger from '../common/Tag'


    export default {
        name: 'ContentManagerHeader',
        props: ['hasSelected'],
        data(){
            return {
                query: null,
                isGrid: true,
                hideTag: false,
                showTag: false,
                filters: {
                    tag: [],
                    creator: [],
                    custom: [],
                    project: []
                },
                activeBar: false,
                showPanel: false,
                showFilters: false,
                selectedFilters:[],
                allFavorites: false,
                showSelection: false,
                addButtonOnly: false,
                hasSelectedItems: false,
                sortList: [
                    {property: 'name', label: 'A to Z', value: 'asc'},
                    {property: 'name', label: 'Z to A', value: 'desc'},
                    {property: 'lastUpdated', label: 'Last Updated', value: 'desc'},
                    {property: 'created', label: 'Created Date', value: 'asc'}
                ]
            }
        },
        computed: {
            clientFilters(){
                return this.$store.getters.getFilterClients;
            }
        },
        methods: {
            converToPill: function () {
                var self = this;
                var pillQuery = this.query.replace(/[^\w\s]/gi, '');
                this.selectFilter({filter:'custom', name:pillQuery, type:'text',id: _.random(0,9999)});
                setTimeout(function () {
//                    self.query = '';
                }, 450)
            },
            itemsList: function () {
                this.isGrid = !this.isGrid;
                this.$parent.changeGrid()
            },
            openInfo: function () {
                this.$parent.openInfo()
            },
            clearAll: function () {
                this.clearFilters();
                this.query = null;
            },
            search: function () {
                !_.isNull(this.query) ? this.converToPill() : '';
                var searchObject = {
                    query: this.query,
                    filters: this.filters
                };
                this.$parent.search(searchObject)
            },
            checkboxChanged: function () {
                this.$parent.checkboxChanged()
            },
            selectFilter: function (item) {
                if(!_.isUndefined(this.filters[item.filter])){
                    this.filters[item.filter].push({
                        id : item.id,
                        name : item.name,
                        type: item.type,
                        filter: item.filter
                    });
                    this.selectedFilters = this.$options.filters.mergeList(this.filters) || this.selectedFilters ;
                }
            },
            unSelectFilter: function (item) {
                this.selectedFilters = _.remove(this.selectedFilters,function(term){
                    return term.name != item.name
                });
                if(!_.isUndefined(this.filters[item.filter])){
                    this.filters[item.filter] = _.remove(this.filters[item.filter],function(term){
                        return term.name != item.name
                    });
                }
                $('.filters__category label:contains("' + item.name + '")').prev('input').prop("checked", false);
            },
            filter: function () {
                this.$parent.filter(event)
            },
            dropDownChanged: function (value) {
                this.$parent.sort(value);
            },
            toggleFilter: function (id, defaultValue, label) {
                var filter = {
                    filter: id.replace(/\b[^a-z]/g, ''),
                    name: label,
                    id: id.replace(/[^0-9]/g, '')
                };
                if (defaultValue) {
                    this.selectFilter(filter);
                } else {
                    this.unSelectFilter(filter);
                }
            },
            clearFilters: function () {
                this.filters = {
                    tag: [],
                    creator: [],
                    custom: [],
                    project: []
                };
                this.selectedFilters = [];
                $('.filters__category input').prop("checked", false);
            },
            openModal: function (e) {
                this.$parent.openModal('upload');
            },
            openWidgetCreateModal: function () {
                this.$parent.openWidgetCreateModal();
            },
            hasSelectedAssets: function () {
                this.hasSelectedItems = _.size(_.filter(this.$store.state.containers.clientWithItems, item => item.selected)) > 0;
            },
            selectedTag: function (item) {
                this.hasSelectedAssets();
                this.$parent.selectedTag(item);
            },
            tagQuery: function (query) {
                this.$parent.tagQuery(query)
            },
            setFavorites: function () {
                var self = this;
                this.$parent.markFavorites(true).then(function (data) {
                    self.allFavorites = data.status;
                    self.$store.commit('UPDATE_FAVORITE_ITEMS', {list: data.data});
                })
            },
            unsetFavorites: function () {
                var self = this;
                this.allFavorites = true;
                this.$parent.markFavorites(false).then(function (data) {
                    self.allFavorites = data.status;
                    self.$store.commit('UPDATE_FAVORITE_ITEMS', {list: data.data});
                })
            }
        },
        created() {
            this.$store.dispatch('getFilters', this.$store.state.auth.user);
        },
        watch : {
            selectedFilters : function(val){
//                console.log(val)
            }
        },
        mounted: function () {
            var that = this;
            $(".view").on("click", function (e) {
                if (!that.addButtonOnly) {
                    if (that.showSelection) {
                        that.showSelection = false;
                    }
                }
                that.addButtonOnly = false;
            });
            $('.content-manager').on('click',function(e){
                if(that.showTag){
                    that.showTag = !that.showTag
                }
            })
        },
        components: {
            Checkbox,
            Dropdown,
            Tagger
        }
    }
</script>