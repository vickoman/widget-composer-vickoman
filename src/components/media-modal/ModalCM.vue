<template>
    <div>
        <div class="media-modal__content-manager">
            <div class="search-container">
                <div class="search">
                    <svg>
                        <use xlink:href="#search"></use>
                    </svg>
                    <div class="input-text">
                        <label class="u-hidden" for="txt-input"></label>
                        <input type="text" name="" class="txt-input" placeholder="" v-model="searchMedia" value="" />
                    </div>
                </div>
                <div class="dropdown-container">
                    <div class="dropdown-container__label">Filter by:</div>
                    <div class="dropdown">
                        <div class="dropdown__button" @click="showSelection ? showSelection = false : showSelection = true">
                            <div class="dropdown__title">{{ dropFilter }}</div>
                            <svg class="dropdown__arrow">
                                <use xlink:href="#arrow-down"></use>
                            </svg>
                        </div>
                        <ul class="dropdown__content" v-if="showSelection">
                            <li @click="filterBy('All')">All</li>
                            <li @click="filterBy('Image')" v-if="allowedFilters.image">Image</li>
                            <li @click="filterBy('Video')" v-if="allowedFilters.video">Video</li>
                            <li @click="filterBy('Audio')" v-if="allowedFilters.audio">Audio</li>
                        </ul>
                    </div>
                </div>
            </div>
            <ul class="media-container">
                <li v-for="item in clientItems" class="media-shell" @click="selectItem(item)" :id="item.id">
                    <div class="selection"></div>
                    <div class="media-shell__thumb_container">
                        <img class="media-shell__thumb" :src="item.url" alt="" v-if="item.type.split('/')[0] =='image'"/>
                        <video class="media-shell__thumb" :src="item.url" alt="" v-if="item.type.split('/')[0] =='video'"/>
                        <div class="media-shell__thumb media-shell__thumb__audio" v-if="item.type.split('/')[0] =='audio'">
                            <svg>
                              <use xlink:href="#audio-media"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="media-shell__description" >
                        <div class="icon" v-if="item.type.split('/')[0] =='image'">
                            <svg>
                                <use xlink:href="#image-media"></use>
                            </svg>
                        </div>
                        <div class="icon" v-if="item.type.split('/')[0] =='video'">
                            <svg>
                                <use xlink:href="#video-media"></use>
                            </svg>
                        </div>
                        <div class="icon" v-if="item.type.split('/')[0] =='audio'">
                            <svg>
                                <use xlink:href="#audio-media"></use>
                            </svg>
                        </div>
                        <div class="description" @mouseover="hoverShow(item.name)" @mouseleave="hoverHide">{{ item.name }}</div>
                    </div>
                </li>
            </ul>
            <div class="hover-name">
                {{ hoverName }}
            </div>
        </div>
        <ul class="bottom-nav">
            <li>
                <button class="button-standard-gray" @click="cancel">Cancel</button>
            </li>
            <li>
                <button class="button-standard-green" @click="addItems" :disabled="disableButton" v-bind:class="{ disabled: disableButton }">Add</button>
            </li>
        </ul>
    </div>
</template>

<script>
    var timer = null;
    export default {
        name: 'modalcm',
        data () {
            return {
               url: "",
               audio: false,
               image: false,
               video: false,
               searchMedia : "",
               showSelection: false,
               disableButton: true,
               dropFilter : "All",
               hoverName: "",
               selectedArray: []
            }
        },
        props: {
            allowedFormats: Array
        },
        computed: {
            clientItems() {

                var searchMedia = this.searchMedia;
                var that = this;
                let client = this.$store.state.containers.media.medias;
                console.log('projeeee', this.$store.state.containers)
                if (client && client.length > 0){
                    let items = client
                    if(!searchMedia && that.dropFilter == "All"){
                          items.filter(function(item){
                              if(that.$options.filters.isValidExtension(item.name, that.allowedFormats)){
                                  return item;
                              }
                        })
                        return items;
                    }
                    searchMedia = searchMedia.trim().toLowerCase();
                    items = items.filter(function(item){
                        var fileType = item.type.split('/')[0];
                        if(item.name.toLowerCase().indexOf(searchMedia) !== -1){
                            if(that.$options.filters.isValidExtension(item.name, that.allowedFormats)){
                                if (that.dropFilter == "All"){
                                    return item;
                                }else if (that.dropFilter == "Image" && fileType == "image" ){
                                    return item;
                                }else if (that.dropFilter == "Video" && fileType == "video" ){
                                    return item;
                                }else if (that.dropFilter == "Audio" && fileType == "audio" ){
                                    return item;
                                }
                            }
                        }
                    })
                    return items
                }
            },
            allowedFilters() {
                return this.$options.filters.mediaTypeAllowed(this.allowedFormats);
            },
        },
        created() {
          // this.$store.dispatch('getContainers')
          this.$store.dispatch('getClientMedia')
        },
        methods: {
            filterBy: function (selection) {
                this.dropFilter = selection;
                this.showSelection = false;
            },
            hoverShow: function (selection) {
              var that = this;
              var ev = event;
              that.hoverName = selection;
              timer = setTimeout(function(event){
                $(".hover-name").css({top: ev.pageY + 8, left: ev.pageX - 40 });
                $(".hover-name").addClass("show-hover");
              }, 1000);
            },
            hoverHide: function () {
                this.hoverName = "";
                clearTimeout(timer);
                $(".hover-name").removeClass("show-hover");
            },
            selectItem: function (item) {
                if($("#"+item.id+" .selection").hasClass("selected")){
                    $("#"+item.id+" .selection").removeClass("selected");
                    this.deleteSelection(item);
                }else{
                    $("#"+item.id+" .selection").addClass("selected");
                    this.addSelection(item);
                }
                if($(".media-shell .selected").length > 0){
                    this.disableButton = false;
                }else{
                    this.disableButton = true;
                }
            },
            addSelection: function (selection) {
                this.selectedArray.push(selection);
            },
            deleteSelection: function (selection) {
                var that = this;
                var selectedIndex = null;
                $.each(this.selectedArray, function( index, item ) {
                    if(item.id == selection.id){
                        selectedIndex = index;
                    }
                });
                that.selectedArray.splice(selectedIndex, 1);
            },
            addItems: function () {
                this.$parent.addItems(this.selectedArray);
                this.closeModal();
            },
            cancel: function () {
                this.selectedArray = [];
                $(".media-shell .selected").removeClass("selected");
                this.closeModal();
            },
            closeModal: function () {
                  this.$parent.closeModal();
            }
        }
    }
</script>
