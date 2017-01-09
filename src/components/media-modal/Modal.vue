<template>
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="media-modal">
                    <div class="media-modal__header">
                        <div class="title-container">
                            <div class="title">Add Media</div>
                            <a @click="closeModal">
                                <svg>
                                    <use xlink:href="#close-x"></use>
                                </svg>
                            </a>
                        </div>
                        <ul class="media-modal__nav">
                            <li>
                                <div class="btn-title upload" @click="showTab">Upload</div>
                            </li>
                            <li>
                                <div class="btn-title url" @click="showTab">By URL</div>
                            </li>
                            <li v-if="cmTab">
                                <div class="btn-title content" @click="showTab">Content Manager</div>
                            </li>
                        </ul>
                    </div>
                    <div class="media-modal__canvas">
                        <ModalUpload v-show="uploadTab":allowedFormats="allowedFormats" :contentManager="contentManager"></ModalUpload>
                        <ModalUrl v-show="urlTab" :allowedFormats="allowedFormats" :contentManager="contentManager"></ModalUrl>
                        <ModalCM  :allowedFormats="allowedFormats" v-if="contentTab && cmTab"></ModalCM>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ModalUpload from './ModalUpload'
    import ModalUrl from './ModalUrl'
    import ModalCM from './ModalCM'
    export default {
        name: 'modal',
        components: {
            ModalUpload,
            ModalUrl,
            ModalCM
        },
        props: {
            tabSelected: String,
            dataTransfer: Object,
            cmTab: Boolean
        },
        data (){
            return {
                uploadTab: false,
                urlTab: false,
                contentTab: false,
                contentManager: this.cmTab,
                allowedFormats: this.$store.state.widget.widget.widgetType ? this.$store.state.widget.widget.widgetType.allowedMediaFormats: ['jpg','jpeg','png',"mp3","wav","mp4"]
            }
        },
        methods: {
                showTab: function (e) {
                    var tabs = this.$el.querySelectorAll('.media-modal__nav li');
                    tabs.forEach(function(btn) {
                        btn.classList.remove('selected');
                    });
                    this.uploadTab = false;
                    this.urlTab = false;
                    this.contentTab = false;

                    e.target.parentElement.classList.add('selected')
                    if (e.target.classList.contains('upload')) {
                        this.uploadTab = true
                    } else if (e.target.classList.contains('url')) {
                        this.urlTab = true
                    } else if (e.target.classList.contains('content')) {
                        this.contentTab = true
                    }
                },
                closeModal: function (e) {
                    this.$emit('close')
                },
                addItems: function(array) {
                    this.$bus.$emit('addMediaItems', array, this.dataTransfer);
                }
        },
        mounted : function(){
            var that = this;
            var tabs = this.$el.querySelectorAll('.media-modal__nav li');
            tabs.forEach(function(btn) {
                if (btn.children[0].classList.contains(that.tabSelected)) {
                    btn.classList.add('selected');
                }
            });
            if (this.tabSelected == "upload"){
                this.uploadTab = true
            } else if (this.tabSelected == "url"){
                this.urlTab = true
            } else if (this.tabSelected == "content"){
                this.contentTab = true
            }
        }
    }
</script>