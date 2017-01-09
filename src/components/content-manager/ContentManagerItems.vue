<template>
    <div>
        <div v-if="showPanel">
            <Info v-bind:class="{'kds-mt-0':resetTop,'kds-mt--8':!resetTop,'u-panel-open-left':showPanel}" :data="infoSelected" :isGrid="isGrid" />
        </div>
        <div class="content__manager__items" v-bind:class="{'--grid':isGrid,'--list':!isGrid}">
            <div class="content__manager__filters" v-if="!isGrid">
                <checkbox
                        id="selectAll"
                        class="content__manager__filter width-10"
                        :label="'Select All'"
                        v-bind:defaultValue="isSelected"
                        :renderedId="90"
                        v-on:checkboxChanged="selectAll">
                </checkbox>
                <div class="content__manager__filter width-40 font-md type">Name</div>
                <div class="content__manager__filter width-15 font-md type">Type</div>
                <div class="content__manager__filter width-15 font-md type">Owner</div>
                <div class="content__manager__filter width-10 font-md type"><strong>Last Modified</strong></div>
                <div class="content__manager__filter width-10 font-md type">Output Type</div>
            </div>
            <div class="content__manager__item" v-for="item in items" v-if="filterItems == item.model || filterItems == 'All' || (filterItems ==='Favorites' && item.isFavorite) " >
                <div class="selection" v-if="isGrid"></div>
                <div class="item-thumb" v-if="item.thumbnail" @click="selectItem(item)" v-bind:class="getClass(item.originalFilename)">
                    <div class="selection" v-if="!isGrid"></div>
                    <div class="item-favorite" v-if="item.isFavorite">
                        <svg>
                            <use xlink:href="#favorite-solid"></use>
                        </svg>
                    </div>
                    <div v-html="getElement(getClass(item.thumbnail),item.thumbnail)"></div>
                </div>
                <div class="item-thumb thumb-unavailable" v-else @click="selectItem(item)" v-bind:class="getClass(item.originalFilename)">
                    <div class="selection" v-if="!isGrid"></div>
                    <div class="item-favorite" v-if="item.isFavorite">
                        <svg>
                            <use xlink:href="#favorite-solid"></use>
                        </svg>
                    </div>
                    <img src="../../assets/no-thumbnail-widget.png" alt="" class="item-thumb-unavailable" width="194" height="198">
                </div>
                <div class="item-title">
                    <div class="item-type">
                        <svg>
                            <use :xlink:href="getIcon(item.originalFilename)"></use>
                        </svg>
                    </div>
                    <div class="item-name type" @mouseover="hoverShow(item.name)" @mouseleave="hoverHide">
                        {{item.name}}
                    </div>
                </div>
                <div class="item-type">
                    <svg>
                        <use :xlink:href="getIcon(item.originalFilename)"></use>
                    </svg>
                    <span>{{item.originalFilename|getType}}</span>
                </div>
                <div class="item-owner">
                    {{item.owner}}
                </div>
                <div class="item-date">
                    {{item.created | filterDate}}
                </div>
                <div class="item-output-type">
                    {{item.type | formatFile}}
                </div>
            </div>
            <div class="hover-name">
                {{ hoverName }}
            </div>
        </div>

        <!--<pre>{{$store.state}}</pre>-->
    </div>
</template>
<script>
    import Checkbox from '../widget-editor/settings/Checkbox'
    import Info from './ContentManagerItemInfo'
    var timer = null;
    export default {
        name: 'contentManagerItems',
        props: ['items', 'filterItems','isGrid','isReadyPreview'],

        methods: {
            selectItem: function (item) {
                var self = this;
                this.$parent.selectItem(item);
                this.allFavorites = item.isFavorite;
//                this.$parent.deselectAll();
                $('#checkbox-90').prop( "checked", false );
                setTimeout(function () {
                    self.getSelectedFavorites();
                }, 1600);
                if(this.showPanel){
                    setTimeout(function () {
                        var filtered = _.filter(self.$store.state.containers.clientWithItems, item => item.selected);
                        var type = _.map(filtered, item => item.originalModel);
                        var id = _.map(filtered, item => item.id);
                        self.infoSelected = {
                            id : _.first(id),
                            selected : _.first(filtered),
                            loading:true
                        };
                    },800)
                }
                this.isSelected = false;
            },
            getSelectedFavorites : function(){
                var selected = _.filter(this.$store.state.containers.clientWithItems, n => n.selected);
                var favorites = _.map(selected,item=>item.isFavorite);
                this.allFavorites = _.every(favorites,Boolean);
                this.hasSelectedItems = _.size(selected)>=0;
            },
            hasSelected : function(){
                this.hasSelectedItems =  _.size(_.filter(this.$store.state.containers.clientWithItems, item => item.selected))>0
            },
            selectAll: function (id, defaultValue) {
                this.$parent.selectAll(defaultValue);
                this.hasSelected();
            },

            filter: function () {
                this.$parent.filter(event)
            },
            getIcon: function (type) {
                let icons = {
                    image: '#image-media',
                    audio: '#audio-media',
                    video: '#video-media',
                    widget: '#widget'
                };
                return icons[this.$options.filters.getType(type)];
            },
            getClass: function (type) {
                return this.$options.filters.getType(type);
            },
            dropDownChanged: function (value) {
                this.$parent.sort(value);
            },
            hoverShow: function (selection) {
                var that = this;
                var ev = event;
                that.hoverName = selection;
                timer = setTimeout(function (event) {
                    $('.hover-name').css({top: ev.pageY + 8, left: ev.pageX - 40});
                    $('.hover-name').addClass('show-hover');
                }, 1000);
            },
            loadData : function(){
                this.$parent.loadData();
            },
            hoverHide: function () {
                this.hoverName = '';
                clearTimeout(timer);
                $(".hover-name").removeClass('show-hover');
            },
            openInfo: function () {
                this.showPanel = !this.showPanel;
                var filtered = _.filter(this.$store.state.containers.clientWithItems, item => item.selected);
                var type = _.map(filtered, item => item.originalModel);
                var id = _.map(filtered, item => item.id);
                var lastIndex = _.size(filtered) > 1 ? _.map(filtered,asset => _.indexOf(filtered,asset)) : 0;
                this.infoSelected = {
                    id : _.size(filtered)>1 ? _.last(id) : _.first(id),
                    selected : _.size(filtered)>1 ? filtered[_.max(lastIndex)] : _.first(filtered),
                    loading:true
                };
            },
            close: function () {
                this.showPanel = !this.showPanel;
            },
            getElement: function (element, item) {
                var elements = {
                    video: {
                        element: '<video width="200" height="200"> <source src="' + item + '"></video>'
                    },
                    image: {
                        element: '<div style="background: url(' + "'" + item + "'" + ')"></div>'
                    },
                    audio: {
                        element: '<div><svg><use xlink:href="#audio-media"></use></svg></div>'
                    }
                };
                return elements[element].element
            }
        },
        components: {
            Checkbox,
            Info
        },
        data (){
            return {
                asc: true,
                hoverName: "",
                sortItems: 'Asc',
                resetTop: false,
                showPanel: false,
                isSelected: false,
                stickyHeader:false,
                infoSelected : null
            }
        },
        created: function () {
            var self = this;

            function whichDirection(event) {
                var scrollDirection = event.deltaY;
                if (scrollDirection === 1 && self.isGrid) {
                    setTimeout(function(){
                        self.$parent.loadData()
                    },250);
                }
            }
            $(window).on('wheel', function(){
                var scrollTop = event.deltaY;
                var bodyHeight = $(document).height();
                scrollTop >= 1  ? self.$parent.checkHeader(true) : self.$parent.checkHeader(false);

                $('.content-manager--metadata').height(bodyHeight );
//                $('.content--manager').height(bodyHeight);
                whichDirection(event);
                if (self.showPanel && scrollTop <= 127) {
                    self.resetTop = false;
                } else if (self.showPanel) {
                    self.resetTop = true;
                }
            });
        },
        watch : {
            isReadyPreview : function(val){
                if(val===true){
                    this.openInfo();
                }
            }
        }
    }
</script>