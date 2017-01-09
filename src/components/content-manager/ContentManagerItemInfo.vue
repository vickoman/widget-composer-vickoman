<template>
    <div class="content-manager--metadata  kds--medium" v-bind:class="{'kds--absolute':isGrid,'kds--fixed': !isGrid}">
            <KnowblyLoader v-if="loading"/>
            <!--<pre>{{data.id}}</pre>-->
            <div class="metadata--info" v-if="!loading">
                <ul class="top-nav kds-pb-16">
                    <li>
                        <button class="button-standard-gray" @click="goTo(data.id)">Edit</button>
                    </li>
                    <li class="kds-ml-8">
                        <button class="button-standard-gray kds--disabled-icon kds--cursor-notallowed">Publish</button>
                    </li>
                    <li class="width-70"></li>
                    <li>
                        <button class="btn" @click="close()">
                            <svg>
                                <use xlink:href="#close-x"></use>
                            </svg>
                        </button>
                    </li>
                </ul>
                <div class="metadata--thumb kds-pb-8">
                    <img v-if="data.selected.thumbnail && (data.selected.mediaType =='widget' || data.selected.mediaType =='image' )" :src="data.selected.thumbnail" width="385" height="285"/>
                    <img v-if="!data.selected.thumbnail && (data.selected.mediaType =='widget' || data.selected.mediaType =='image' )" src="../../assets/no-thumbnail-widget.png" width="386" height="285"/>
                    <div class="metadata--thumb-holder"  v-if="data.selected.mediaType=='audio'">
                        <div class="metadata--audio">
                            <VideoJS :id="'audio-'+data.selected.uuid" type="audio" controls="false" :src="data.selected.thumbnail"></VideoJS>
                        </div>
                    </div>
                    <div class="metadata--thumb-holder"  v-if="data.selected.mediaType=='video'">
                        <div class="metadata--video">
                            <VideoJS :id="'video-'+data.selected.uuid" type="video" :src="data.selected.thumbnail" controls="true" preload="auto"></VideoJS>
                        </div>
                    </div>
                </div>
                <div class="metadata--title kds-pb-16 kds--flex kds--row">
                    <svg>
                        <use :xlink:href="getIcon(data.selected.originalFilename)"></use>
                    </svg>
                    <p class="width-90">{{data.selected.name}}</p>
                    <svg v-if="data.selected.isFavorite" class="color--yellow">
                        <use xlink:href="#favorite-solid"></use>
                    </svg>
                </div>
            </div>
            <div class="description-container accordian kds--bt kds--b--gray">
                <a @click="closedDetails = !closedDetails">
                    <div class="accordian__btn" v-bind:class="{ open: closedDetails }">
                        <svg>
                            <use xlink:href="#caret-down" v-if="closedDetails"></use>
                            <use xlink:href="#caret-right" v-if="!closedDetails"></use>
                        </svg>
                        <div class="accordian__title">Details</div>
                    </div>
                </a>
                <div class="accordian__container kds--relative kds--high" v-if="closedDetails">
                    <div class="metadata--info--details kds--flex  kds--column" v-if="$store.state.widget.widget.widgetType">
                        <div class="kds--row kds--flex kds-pb-16">
                            <div class="width-25"><b>Asset Type:</b></div>
                            <div class="width-75">{{data.selected.originalFilename|getType}}</div>
                        </div>
                        <div class="kds--row kds--flex kds-pb-16">
                            <div class="width-25"><b>Widget Type:</b></div>
                            <div class="width-75">{{$store.state.widget.widget.widgetType.name}}</div>
                        </div>
                        <div class="kds--row kds--flex kds-pb-16">
                            <div class="width-25"><b>Format:</b></div>
                            <div class="width-75">{{data.selected.type|formatFile}}</div>
                        </div>
                        <div class="kds--row kds--flex kds-pb-16">
                            <div class="width-25"><b>Size:</b></div>
                            <div class="width-75">{{data.selected.size }}</div>
                        </div>
                        <div class="kds--row kds--flex kds-pb-16">
                            <div class="width-25"><b>Creator:</b></div>
                            <div class="width-75">{{data.selected.owner }}</div>
                        </div>
                        <div class="kds--row kds--flex kds-pb-16">
                            <div class="width-25"><b>Created:</b></div>
                            <div class="width-75">{{data.selected.created | filterDateHours }}</div>
                        </div>
                        <div class="kds--row kds--flex kds-pb-16">
                            <div class="width-25"><b>Modified:</b></div>
                            <div class="width-75">{{data.selected.lastUpdated | filterDateHours }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="description-container accordian" v-if="!loading">
                <a @click="closedPanel = !closedPanel">
                    <div class="accordian__btn" v-bind:class="{ open: closedPanel }">
                        <svg>
                            <use xlink:href="#caret-down" v-if="closedPanel"></use>
                            <use xlink:href="#caret-right" v-if="!closedPanel"></use>
                        </svg>
                        <div class="accordian__title">Tags</div>
                    </div>
                </a>
                <div class="accordian__container kds--relative kds--high" v-if="closedPanel">
                    <ul class="accordian__content">
                        <li class="kds-mb-16">
                            <Tagger :label="null" v-bind:tags="tags" v-on:selectedTag="selectedTag" :isPreview="true"
                                    v-on:queryTag="tagQuery" class="metadata--tagger" v-if="tagReady" />
                        </li>
                    </ul>
                </div>
            </div>
            <Metadata v-if="loadMetadata" v-bind:class="{'kds--hide-ip':!data.hasInteractiveProfile}" />
    </div>
</template>
<script>
    import Metadata from '../widget-editor/Metadata'
    import KnowblyLoader from './../KnowblyLoader'
    import Tagger from '../common/Tag'
    import VideoJS from '../VideoJS'

    export default {
        name: 'contentManagerItemInfo',
        props : ['data','isGrid'],
        components: {
            Tagger,
            VideoJS,
            Metadata,
            KnowblyLoader
        },
        data(){
            return {
                tags:[],
                hideTag:true,
                loading: true,
                tagReady: false,
                closedPanel: false,
                closedDetails:false,
                loadMetadata : false
            }
        },
        created: function () {
            this.getInfo();
        },
        mounted:function(){
            var bodyHeight = $(document).height();
            $('.content-manager--metadata').height(bodyHeight);
            setTimeout(function(){
                $('.content-manager').height(bodyHeight*2);
            },350)
        },
        watch : {
            tags: function(val){
                this.updateTags(val)
            },
            data:function(val){
                var self = this;
                if(val.id){
                    self.getInfo();
                }
            }
        },
        methods: {
            close: function () {
                this.$parent.close()
            },
            goTo: function (id) {
                this.$router.push({name: 'editor', params: {id: id}})
            },
            getIcon: function (filename) {
                return this.$parent.getIcon(filename);
            },
            getInfo: function () {
                var self = this;
                this.tags = [];
                this.tagReady = false;
                //TODO CONNECT TO API FOR ASSET DETAILED INFO
                console.log(this.data.selected);
                this.$store.dispatch('getWidget',this.$options.propsData.data.id).then(function(data){
                    setTimeout(function(){
                        self.loadMetadata = !_.isEmpty(self.$store.state.widget.widget.metadata);
                        self.tags = self.$store.state.widget ? self.$store.state.widget.widget.tags : [];
                        self.data.loading = false;
                        self.data.selected.mediaType = self.$options.filters.getType(self.data.selected.originalFilename);
                        self.data.hasInteractiveProfile = self.data.selected.mediaType ==='widget';
                        self.loader();
                    },1100)
                });
            },
            updateTags : function(tagList){
//                this.tags = tagList;
            },
            deleteTag:function(item){
                this.tags = _.remove(this.tags,function(tag){
                    if(item.id){
                        return tag.id !== item.id
                    }else{
                        return tag.name !== item.name
                    }
                });
                if(_.size(this.tags)===1){
                    this.tags = []
                }
                this.getInfo();
            },
            loader : function(){
                this.tagReady = true;
                this.loading = false;
            },
            selectedTag: function (item) {
                this.$store.dispatch('setItemTags',{data:{tags:item}})
            },
            tagQuery: function (query) {
                this.$store.dispatch('queryTag', {query});
            }
        }
    }
</script>