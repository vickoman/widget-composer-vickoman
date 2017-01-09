<template>
    <div class="media-modal__upload_container"  @dragover="onDragOver">
        <div class="video-message" v-if="videoMessage">
            Video uploads are not allowed, please add video via the by URL tab.
        </div>
        <div class="media-modal__upload" v-bind:class="{ modal__upload__files: allowUploads }">
            <div class="upload-lockup" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onFileChange">
                <div class="upload-icon">
                    <svg>
                        <use xlink:href="#upload"></use>
                    </svg>
                </div>
                <div class="instruction">
                    {{ dragText }}
                </div>
                <div>
                    <button class="button-standard-green">Locate Files</button>
                    <input id="files" class="u-hide" type="file" @change="onFileChange" :accept="$options.filters.arrayToString(allowedFormats)" multiple></input>
                </div>
            </div>
            <div class="list-container" v-show="!allowUploads">
                <ul class="media-container">
                    <li v-for="item in mediaFile" class="media-shell"  @click="selectItem(item)" :id="$options.filters.removeSpecialChars(item.lastModified+''+item.name)">
                            <div class="selection"></div>
                            <div class="delete-media">
                                <div class="trash-icon" @click="deleteMediaItem(item)">
                                    <svg>
                                        <use xlink:href="#trash"></use>
                                    </svg>
                                </div>
                            </div>
                            <div class="media-shell__thumb_container" v-if="$options.filters.getType(item.name) =='image'">
                                <img class="media-shell__thumb" :src="item.preview" alt="" />
                                <upload-progress :value="loaders"></upload-progress>
                            </div>
                            <div class="media-shell__thumb media-shell__thumb__audio" v-if="$options.filters.getType(item.name) =='audio'">
                                <svg>
                                    <use xlink:href="#audio-media"></use>
                                </svg>
                                <upload-progress :value="loaders"></upload-progress>
                            </div>
                            <div class="media-shell__description" >
                                <div class="icon" v-if="$options.filters.getType(item.name) =='image'">
                                    <svg>
                                        <use xlink:href="#image-media"></use>
                                    </svg>
                                </div>
                                <div class="icon" v-if="$options.filters.getType(item.name) =='video'">
                                    <svg>
                                        <use xlink:href="#video-media"></use>
                                    </svg>
                                </div>
                                <div class="icon" v-if="$options.filters.getType(item.name) =='audio'">
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
    import Vue from 'vue'
    import UploadProgress from './UploadProgress'
    var timer = null;
    export default {
        name: 'modalupload',
        components:{
            UploadProgress
        },
        data () {
            return {
                mediaFile: [],
                videoMessage: false,
                allowUploads: true,
                disableButton: true,
                hoverName: "",
                selectedArray: [],
                storedArray:[],
                dragText: "Drag and drop files to upload or",
                refreshDom: {name:'dom'},
                loaders: 1,
            }
        },
        props: {
            allowedFormats: Array,
            contentManager: Boolean
        },
        watch:{
            storedArray(old,newF, pepe){
                // console.log('old', old, newF, pepe)
            }
        },
        computed: {
                clientItems() {
                    let client = this.$store.state.containers.clientWithItems.client
                    let items = [
                        ...client.media,
                    ]
                    return items
                },
        },
        created() {
//            this.$store.state.auth.user.clientId;
            this.getClientItems();
//            this.$store.dispatch('getClientItems',{id:1,params:{skip:0,limit:0}})
        },
        beforeMount(){
        },
        methods: {
            onFileChange(e) {
                var that = this;
                var files = e.target.files || e.dataTransfer.files;
                var allowedFiles = 0;
                this.allowUploads = false;
                this.disableButton = false;
                $(".upload-lockup").removeClass("show-upload");
                $(".media-modal__upload").removeClass("show-dotted");
                if (!files.length)
                    return;
                for (var i = 0; i < files.length; i++)
                {
                    if(this.$options.filters.getType(files[i].name) != "video"){
                        if(this.$options.filters.isValidExtension(files[i].name, this.allowedFormats)){
                            this.createMedia(files[i]);
                            that.selectedArray.push(files[i]);
                            allowedFiles++;
                        }
                    }else{
                        this.videoMessage = true
                    }
                }
                this.addFiles();
                if(this.mediaFile.length <= 0 && allowedFiles == 0){
                    this.allowUploads = true;
                    this.disableButton = true;
                }
                if(this.videoMessage){
                    setTimeout(function(event){
                        that.videoMessage = false;
                    }, 3000);
                }
            },
            addFiles(e) {
                 var that = this;
                 let arr = [];
                 that.loaders = 1;
                 $(this.selectedArray).each((index, item)=>{
                     var itemId = this.$options.filters.removeSpecialChars(item.lastModified+''+item.name);
                     var promise = this.$store.dispatch('addMedia', {container: this.$store.state.containers.container.name, file: item})
                        .then(function (respItem, e){
                            // console.log('promise', respItem, item, e)
                            Vue.set(item, 'progress', 100);
                            return respItem
                        })
                     arr.push(promise);
                     //itemID, isinwidget, index
                     that.storedArray.push(new Array(itemId, true , index));
                 });
                 Promise.all(arr)
                 .then((itemsArray) => {
                    that.selectedArray = [];
                    setTimeout(function(event){
                        that.loaders = 100;
                    }, 1200);
                    console.log("arrayItems: ",itemsArray);
                    $.each(itemsArray, function( index, item ) {
                        $.each(that.storedArray, function( indexStored, itemStored ) {
                            if(index == itemStored[2]){
                                item.progress = 100;
                                itemStored[2] = item.media;
                                setTimeout(function(event){
                                    $("#"+itemStored[0]+" .selection").addClass("selected");
                                }, 2200);
                            }
                        });
                    });
                    if(this.contentManager){
                        this.getClientItems();
//                        this.$store.dispatch('getClientItems',{id:1,params:{skip:0,limit:0}})
                    }
                 })
            },
            cancel(e) {
                var that = this;
                this.mediaFile = [];
                $.each(that.storedArray, function( indexStored, itemStored ) {
                    that.deleteMedia(itemStored);
                });
                this.storedArray = [];
                this.allowUploads = true;
                this.disableButton = true;
                if(!this.contentManager){
                    this.getClientItems();
//                    this.$store.dispatch('getClientItems',{id:1,params:{skip:0,limit:0}})
                }
                this.closeModal();
            },
            deleteMediaItem(item) {
                var that = this;
                var selectedIndex = null;
                var itemId = this.$options.filters.removeSpecialChars(item.lastModified+''+item.name);
                $.each(that.storedArray, function( indexStored, itemStored ) {
                    if( itemStored[0] == itemId){
                        that.deleteMedia(itemStored);
                    }
                });
                $.each(this.mediaFile, function( index, item ) {
                    if(that.$options.filters.removeSpecialChars(item.lastModified+''+item.name) == itemId){
                        selectedIndex = index;
                    }
                });
                that.mediaFile.splice(selectedIndex, 1);
                if(this.mediaFile.length <= 0){
                    this.allowUploads = true;
                    this.disableButton = true;
                }
            },
            createMedia(file) {
                var that = this;
                if(that.$options.filters.getType(file.name) == "image"){
                    var mediaFile = new Image();
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        file.preview = e.target.result;
                        file.progress = 0;
                        that.mediaFile.push(file)
                    };
                    reader.readAsDataURL(file);
                }else{
                    file.preview = "";
                    that.mediaFile.push(file)
                }
            },
            hoverShow(selection) {
                var that = this;
                var ev = event;
                that.hoverName = selection;
                timer = setTimeout(function(event){
                    $(".hover-name").css({top: ev.pageY + 8, left: ev.pageX - 40 });
                    $(".hover-name").addClass("show-hover");
                }, 1000);
            },
            hoverHide(e) {
                this.hoverName = "";
                clearTimeout(timer);
                $(".hover-name").removeClass("show-hover");
            },
            onDragOver(e) {
                $(".upload-lockup").addClass("show-upload");
                $(".media-modal__upload").addClass("show-dotted");
                this.dragText = "Drop your files here";
            },
            onDragLeave(e) {
                $(".upload-lockup").removeClass("show-upload");
                $(".media-modal__upload").removeClass("show-dotted");
                this.dragText = "Drag and drop files to upload or";
            },
            selectItem(item) {
                if(this.contentManager){
                    var itemId = this.$options.filters.removeSpecialChars(item.lastModified+''+item.name);
                    if($("#"+itemId+" .selection").hasClass("selected")){
                        $("#"+itemId+" .selection").removeClass("selected");
                        this.deleteSelection(item);
                    }else{
                        $("#"+itemId+" .selection").addClass("selected");
                        this.addSelection(item);
                    }
                    if($(".media-shell .selected").length > 0){
                        this.disableButton = false;
                    }else{
                        this.disableButton = true;
                    }
                }
            },
            addSelection(selection) {
                var itemId = this.$options.filters.removeSpecialChars(selection.lastModified+''+selection.name);
                $.each(this.storedArray, function( index, item ) {
                    if( item[0] == itemId){
                        item[1] = true;
                    }
                });
            },
            deleteSelection(selection) {
                var that = this;
                var selectedIndex = null;
                var itemId = this.$options.filters.removeSpecialChars(selection.lastModified+''+selection.name);
                $.each(this.storedArray, function( index, item ) {
                    if( item[0] == itemId){
                        item[1] = false;
                    }
                });
            },
            addItems(e) {
                let finalArray = []
                $.each(this.storedArray, function( index, item ) {
                    if(item[1]){
                        finalArray.push(item[2]);
                    }
                });
                if(!this.contentManager){
                    this.getClientItems();
//                    this.$store.dispatch('getClientItems',{skip:0,limit:0})
                }
                this.$parent.addItems(finalArray);
                this.closeModal();
            },
            closeModal(e) {
                this.$parent.closeModal();
            },
            deleteMedia(item) {
                let id = item[2].id;
                let fileName = item[2].name;
                console.log("DELETE: ",this.$store.state.containers.container, id, fileName )
                this.$store.dispatch('deleteMedia', {container: this.$store.state.containers.container, id, fileName});
                if(this.contentManager){
                    this.getClientItems();
//                    this.$store.dispatch('getClientItems',{id:1,params:{skip:0,limit:0}});
                }
            },
            getClientItems : function(){
                this.$store.dispatch('getClientItems',{id:1,params:{skip:0,limit:0}});
            }
        },
        mounted : function(){
            var that = this;
            var obj = $(".upload-lockup");
            $(".button-standard-green").unbind("click").bind("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
               $("#files").click();
            });
            obj.on('dragenter, dragover', function (e)
            {
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).on('dragenter, dragover, drop', function (e)
            {
                e.stopPropagation();
                e.preventDefault();
            });
        }
    }
</script>