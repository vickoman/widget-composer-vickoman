<template>
    <div>
        <NewWidgetModal v-if="showModal" v-on:close="showModal = false"/>
        <MediaModal v-if="showMediaModal" @close="showMediaModal = false" :tabSelected="tabSelected" :dataTransfer="dataTransfer" :cmTab="false"/>
        <ContentManagerHeader id="content-manager-header" v-bind:hasSelected="hasSelectedItem" v-bind:class="{'kds--sticky-header':stickyHeader}" />
        <!-- ALL ITEMS: <pre>{{allItems}}</pre>
        STORE STATE: <pre>{{$store.state.containers.clientWithItems}}</pre> -->
        <ContentManagerItems v-bind:items="allItems" v-bind:isReadyPreview="isInfoPreview" class="content-manager" :filterItems="tabFilter" v-bind:isGrid="isGrid"/>
        <mugen-scroll :handler="loadData" :should-handle="!loading">
            <div class="center-div" v-if="loading">
                <knowbly-loader/>
            </div>
        </mugen-scroll>
    </div>
</template>
<script>
    import NewWidgetModal from '../new-widget-modal/NewWidgetModal'
    import ContentManagerHeader from './ContentManagerHeader'
    import ContentManagerItems from './ContentManagerItems'
    import KnowblyLoader from './../KnowblyLoader'
    import MediaModal from '../media-modal/Modal'
    import MugenScroll from 'vue-mugen-scroll'
    import utils from '../../utils/index'
    import _ from 'lodash'

    export default {
        name: 'contentManager',
        computed: {
            allItems() {
                return this.$store.getters.getClients;
            }
        },
        data (){
            return {
                dataTransfer: {on: false, index:null},
                showMediaModal: false,
                hasSelectedItem:false,
                isInfoPreview:false,
                showFilters : false,
                isSelected : false,
                stickyHeader:false,
                selectedItems: [],
                showModal: false,
                activeBar:false,
                tabFilter:'All',
                isGrid: true,
                loading:false,
                creator:null,
                tabSelected: "",
                params : {
                    limit:20,
                    skip:0
                },
                tag : null,
                query:''
            }
        },
        methods:{
            checkboxChanged : function(){
                console.log(this.creator)
            },
            loadData : function(){
                var self = this;
                this.loading = true;
                //          this.$store.state.auth.user.clientId;
                this.params.skip === 0 ? this.params.skip += this.params.limit : this.params.skip;
                this.$store.dispatch('loadClientItems',{id:1,params:this.params}).then(function(response){
                    self.loading = false;
                    self.params.skip += self.params.limit;
                });
            },
            changeGrid : function(){
                this.isGrid = !this.isGrid;
                this.deselectAll();
            },
            openInfo : function(){
                this.isInfoPreview = !this.isInfoPreview;
            },
            selectItem : function(item){
                var self = this;
                let index = _.indexOf(this.allItems,item);
                $('.content__manager__item').on('click',function(event) {
                    if(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
                        $(this).addClass('item--selected');
                        self.$store.commit('SELECT_PROJECT_ITEM',{index:index});
                    } else {
//                        self.$store.commit('DESELECT_PROJECT_ITEMS',{true});
                        self.deselectAll();
                        $('.content__manager__item').removeClass('item--selected');
                        $(this).addClass('item--selected');
                        self.$store.commit('SELECT_PROJECT_ITEM',{index:index});
                    }
                });
                setTimeout(function(){
                    self.getSelected()
                },600);

            },
            getSelected : function(){
                this.hasSelectedItem = _.size(_.filter(this.$store.state.containers.clientWithItems, item => item.selected))>0;
                this.$store.commit('GET_FAVORITES')
            },
            deselectAll : function(){
                $('.content__manager__item').each(function(){
                    this.classList.remove('item--selected')
                });
                this.$store.commit('DESELECT_PROJECT_ITEMS',{true})
            },
            selectAll: function(isSelecting){
                $('.content__manager__item').each(function(){
                    isSelecting ? this.classList.add('item--selected') : this.classList.remove('item--selected');
                });
                isSelecting ?  this.$store.commit('SELECT_PROJECT_ITEMS',{true}) : this.deselectAll();

            },
            openWidgetCreateModal : function(){
                this.showModal = true
            },
            clearAll : function(){
                this.tabFilter = 'All';
                this.filters = [];
                this.query = '';
                this.sort(true);
            },
            search : function(params){
                var searchParams = utils.buildSearch(params);
                console.log(searchParams);
                //search endpoint
            },
            converToPill : function(){
                var self = this;
                var pillQuery = this.query.replace(/[^\w\s]/gi, '');
                this.selectThis(_.random(0,999999),pillQuery,pillQuery);
                setTimeout(function(){ self.query = '';},450)
            },
            sort: function (sortParams) {
                return this.$store.commit('SORT_PROJECTS', {sort: sortParams});
            },
            filter: function (event) {
                $('.toolbar--tab a').each(function () {
                    this.classList.remove('toolbar--button--current');
                });
                $(event.target).addClass('toolbar--button--current');
                this.tabFilter = $(event.target).text();
            },
            openModal: function (selection) {
                this.tabSelected = selection;
                this.showMediaModal = true
            },
            markFavorites: function (favoriteValue) {
                return this.$store.dispatch('setFavorites', {
                    data: {
                        favorite: favoriteValue,
                        userId: this.$store.state.auth.user.id
                    }
                })
            },
            selectedTag : function(item){
                this.$store.dispatch('setItemTags',{data:{tags:item}})
            },
            tagQuery : function(query){
                this.$store.dispatch('queryTag',{query});
            },
            checkHeader : function(isSticky){
                this.stickyHeader = isSticky
            }
        },
        components:{
            ContentManagerHeader,
            ContentManagerItems,
            NewWidgetModal,
            KnowblyLoader,
            MugenScroll,
            MediaModal
        },
        created() {
            this.showGrid=true;
            this.$store.dispatch('getContainers');
//          this.$store.state.auth.user.clientId;
        },
        mounted: function() {
            var self = this;
            this.$bus.$on('addMediaItems', function(e){
                self.loadData();
            });
            this.$store.dispatch('getClientItems', {id:1,params:{skip:0,limit:20}});
//            var bodyHeight = $(document).height();
//            var headerHeight = $('#content-manager-header').height();
//            console.log(headerHeight);
//            var contentManagerHeight = bodyHeight-headerHeight;
//            console.log(contentManagerHeight);
//            $('.content-manager').height(contentManagerHeight);
        },
    }
</script>
<style>
    body {
        background: #f5f5f5 !important;
        overflow: hidden;
    }
</style>