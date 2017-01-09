<template>
    <section class="widgetcontent">
        <!-- EditorMode Start -->
        <div v-if="editorMode" :class="'media-gallery '+(thumbnailsVertical ? 'verticalThumb' : '') + ' editor-mode'">

            <div class="active-content">
                <div v-if="medias.length > 0" v-for="(media, k) in medias" :class="'item item-'+k">
                    <froala :class="'widget-instructions'" 
                        @froalachanged="updateWidgetData(k, 'instructions')" 
                        :content="media.instructions" 
                        placeholder="Widget Instructions..." 
                        editor-type="mediaOneLine" group="widget">
                    </froala>
                    <div class="columns column1">

                        <div v-if="media.type && media.type.slice(0,5) == 'image'" class="media galleryimage">
                            <article data-type="galleryimage">
                                <figure class="media-content">
                                    <span class="helper"></span><img :src="media.url" :alt="media.alt?media.alt:''" />
                                </figure>
                            </article>
                        </div>

                        <div v-if="media.type && media.type.slice(0,5) == 'video'" class="media galleryvideo">
                            <article data-type="galleryvideo">
                                <section class="media-content">
                                    <VideoJS :id="'video-'+k" type="video" :src="media.url" controls="true" preload="auto"></VideoJS>
                                </section>
                            </article>
                        </div>

                        <div v-if="media.type && media.type.slice(0,5) == 'audio'" class="media galleryaudio">
                            <article data-type="galleryaudio">
                                <section class="media-content">
                                    <VideoJS :id="'audio-'+k" type="audio" :src="media.url"></VideoJS>
                                </section>
                            </article>
                        </div>

                        <div v-if="media.datatype && media.datatype == 'text'" class="media textdocument">
                            <article data-type="textdocument">
                                <figure class="media-content">
                                    <div class="textdocument__label"><froala @froalachanged="updateWidgetData(k, 'label')" :content="media.label" placeholder="Enter Label..." editor-type="mediaOneLine" group="widget"></froala></div>
                                    <div class="textdocument__textcontent"><froala @froalachanged="updateWidgetData(k, 'textcontent')" :content="media.textcontent" placeholder="Enter text..." editor-type="widget" group="widget"></froala></div>
                                </figure>
                            </article>
                        </div>

                    </div>
                    <div class="columns column2">
                        <div class="captions">
                            <div class="item-caption">
                                <article data-type="richtext">
                                    <froala @froalachanged="updateWidgetData(k, 'caption')" :content="media.caption" placeholder="Text Caption" editor-type="mediaOneLine" group="widget"></froala>
                                </article>
                            </div>
                            <div class="clear"></div>
                            <div class="item-credit">
                                <article data-type="richtext">
                                    <froala @froalachanged="updateWidgetData(k, 'credit')" :content="media.credit" placeholder="Text Credit" editor-type="mediaOneLine" group="widget"></froala>
                                </article>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div>
                </div>
                <div v-if="medias.length == 0" class="empty-gallery">
                    <svg><use xlink:href="#image-button"></use></svg>
                    <p>Add a media or text to begin.</p>
                </div>
            </div>
            <nav>
                <div class="thumbnails">
                    <div class="thumbnails-wrapper">
                        <div v-for="(media, k) in medias" 
                            :class="'thumbnail thumbnail-'+k+' '+(!media.type || media.type.slice(0,5) != 'image' && media.type.slice(0,5) != 'video' ? 'dark-bg' : '')" 
                            @click.prevent="changeContent(k)" 
                            @dragstart="dragStartThumb(k)" 
                            @dragenter="dragOverThumb(k)" 
                            @dragend="dragEndThumb()" 
                            @drop="dropOnThumb(k)" 
                            @mousedown.self="mouseDownThumb(k)" 
                            @mouseup.self="mouseDownThumb(k, true)" 
                            @mouseover="thumbnailHover(k)" 
                            @mouseout="thumbnailHover(k, true)" 
                            draggable="true">

                            <div class="img-wrapper" v-if="media.type && media.type.slice(0,5) == 'image'" :style="'background-image:url(' + media.url + ')'">
                                <img :src="media.url" alt="" draggable="false" />
                            </div>

                            <div v-if="media.type && media.type.slice(0,5) == 'video'" class="icon">
                                <!-- <i class="fa">
                                    <svg>
                                        <use xlink:href="#video-media"></use>
                                    </svg>
                                </i> -->
                                <video :src="media.url"></video>
                            </div>

                            <div v-if="media.type && media.type.slice(0,5) == 'audio'" class="icon audio-icon">
                                <i class="fa">
                                    <svg>
                                        <use xlink:href="#audio-media"></use>
                                    </svg>
                                </i>
                            </div>

                            <div v-if="media.datatype && media.datatype == 'text'" :class="'icon text-icon '+(media.label && media.label.length > 0 ? 'filled' : '')">
                                <i class="fa">
                                    <svg>
                                        <use xlink:href="#text-button"></use>
                                    </svg>
                                </i>
                                <span v-if="media.label && media.label.length > 0" class='thumb-label'>{{ textLabel(stripHtml(media.label), 13) }}</span>
                            </div>

                            <div v-if="media.type && media.type.slice(0,5) == 'image'" class='action-icons'>
                                <i class="fa" v-if="media.type != 'video'" v-on:click.stop="dataTransferAction(k)">
                                    <svg class='data-transfer'>
                                        <use xlink:href="#data-transfer"></use>
                                    </svg>
                                </i>
                                <i class="fa" v-on:click.stop="deleteMedia(k)">
                                    <svg class="trash">
                                        <use xlink:href="#bin"></use>
                                    </svg>
                                </i>
                            </div>

                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <!-- EditorMode End -->

        <!-- PreviewMode Start -->
        <div v-else :class="'media-gallery '+(thumbnailsVertical && navigationStyle != 'Arrows' ? 'verticalThumb' : '') + ' preview-mode'">
            <div class='fullscreen'>
                <div class='zoom-action-icons'>
                    <button class="close button-icon" v-on:click="closeExpand"><svg><use xlink:href="#close-x"></use></svg></button>
                    <button class="zoomIn button-icon" v-on:click="zoomIn"><svg><use xlink:href="#zoom-in"></use></svg></button>
                    <button class="zoomOut button-icon" v-on:click="zoomOut"><svg><use xlink:href="#zoom-out"></use></svg></button>
                </div>
                <img class="fullscreen-img"/>
            </div>

            <div class="active-content">
                <div v-if="medias.length > 0" v-for="(media, k) in medias" :class="'item item-'+k">
                    <div :class="'widget-instructions '+(!media.instructions || stripHtml(media.instructions).length <= 0 ? 'margin-0' : '')" v-html="media.instructions"></div>
                    <div class="columns column1" style="height: 100%">

                        <div v-if="media.type && media.type.slice(0,5) == 'image'" class="media galleryimage">
                            <button class="expand" v-on:click="expandImage(media.url)"><svg><use xlink:href="#expand"></use></svg></button>
                            <article data-type="galleryimage">
                                <figure class="media-content">
                                    <span class="helper"></span><img :src="media.url" alt="" />
                                </figure>
                            </article>
                        </div>

                        <div v-if="media.type && media.type.slice(0,5) == 'video'" class="media galleryvideo">
                            <article data-type="galleryvideo">
                                <section class="media-content">
                                    <VideoJS :id="'video-'+k" type="video" :src="media.url" controls="true" preload="auto"></VideoJS>
                                </section>
                            </article>
                        </div>

                        <div v-if="media.type && media.type.slice(0,5) == 'audio'" class="media galleryaudio">
                            <article data-type="galleryaudio">
                                <section class="media-content">
                                    <VideoJS :id="'audio-'+k" type="audio" :src="media.url"></VideoJS>
                                </section>
                            </article>
                        </div>

                        <div v-if="media.datatype && media.datatype == 'text'" class="media textdocument">
                            <article data-type="textdocument">
                                <figure class="media-content">
                                    <div class="document-preview">
                                        <span class="doc-label" v-html="media.label"></span>
                                        <span class="doc-text" v-html="media.textcontent"></span>
                                    </div>
                                </figure>
                            </article>
                        </div>

                    </div>
                    <div class="columns column2">
                        <div class="captions">
                            <div class="item-caption">
                                <article data-type="richtext">
                                    <div class="media-caption" v-html="media.caption"></div>
                                </article>
                            </div>
                            <div class="clear"></div>
                            <div class="item-credit">
                                <article data-type="richtext">
                                    <div class="media-credit" v-html="media.credit"></div>
                                </article>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div>
                </div>
                <div v-if="medias.length == 0" class="empty-gallery">
                    <svg><use xlink:href="#image-button"></use></svg>
                    <p>Add a media or text to begin.</p>
                </div>
            </div>
            <nav>
                <div v-if="navigationStyle == 'Thumbnails'" class="thumbnails">
                    <div class="thumbnails-wrapper">
                        <div v-for="(media, k) in medias" 
                            :class="'thumbnail thumbnail-'+k+' '+(!media.type || media.type.slice(0,5) != 'image' && media.type.slice(0,5) != 'video' ? 'dark-bg' : '')" 
                            @click.prevent="changeContent(k)" 
                            @mouseover="thumbnailHover(k)" 
                            @mouseout="thumbnailHover(k, true)">

                            <div class="img-wrapper" v-if="media.type && media.type.slice(0,5) == 'image'" :style="'background-image:url(' + media.url + ')'">
                                <img :src="media.url" alt="" draggable="false" />
                            </div>

                            <div v-if="media.type && media.type.slice(0,5) == 'video'" class="icon">
                                <!-- 
                                    <svg>
                                        <use xlink:href="#video-media"></use>
                                    </svg> -->
                                <video :src="media.url"></video>
                            </div>

                            <div v-if="media.type && media.type.slice(0,5) == 'audio'" class="icon audio-icon">
                                <svg>
                                    <use xlink:href="#audio-media"></use>
                                </svg>
                            </div>

                            <div v-if="media.datatype && media.datatype == 'text'" :class="'icon text-icon '+(media.label && media.label.length > 0 ? 'filled' : '')">
                                <svg>
                                    <use xlink:href="#text-button"></use>
                                </svg>
                                <span v-if="media.label && media.label.length > 0" class='thumb-label'>{{ textLabel(stripHtml(media.label), 13) }}</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div v-if="navigationStyle == 'Arrows'" class="arrows">
                    <button v-if="activePane > 0" class="arrows__arrow-left" @click="arrowNavigation('left')"><svg><use xlink:href="#arrow-up"></use></svg></button>
                    <button v-if="activePane == 0" class="arrows__arrow-left arrow-disabled"><svg><use xlink:href="#arrow-up"></use></svg></button>
                    
                    <button v-if="activePane < medias.length-1" class="arrows__arrow-right" @click="arrowNavigation('right')"><svg><use xlink:href="#arrow-up"></use></svg></button>
                    <button v-if="activePane == medias.length-1 || medias.length == 0" class="arrows__arrow-right arrow-disabled"><svg><use xlink:href="#arrow-up"></use></svg></button>
                </div>
                <div v-if="navigationStyle == 'Dots'" class="dots">
                    <div v-for="(media, k) in medias" :class="'dot ' + (activePane == k ? 'active' : '') " @click.prevent="changeContent(k)"></div>
                </div>
            </nav>
        </div>
        <!-- PreviewMode End -->
    </section>
</template>

<script>
    import Froala from '../Froala'
    import VideoJS from '../VideoJS'
    require('jquery-zoom');

    export default {
        name: 'MediaGallery',
        components: {
            Froala,
            VideoJS
        },
        props: ['widgetMode'],
        data() {
            return {
                editorMode: this.widgetMode == 'editor' ? true : false,
                isMobile: false,
                activePane: 0,
                newData: false,
                mediasLength: 0,
                dontAdjust: false
            }
        },
        methods: {
            setWidgetData: function(items, add){
                let data = _.clone(this.$store.state.widget.widget.data);
                if (add) {
                    data.items = _.concat(data.items, items);
                } else {
                    data.items = items;
                }

                this.$store.dispatch('setWidgetData', {
                    id: this.$route.params.id,
                    data: data
                });
            },
            adjustHeightContent: function(i){
                let item = $(this.$el).find('.item-'+i);
                let widget_scale = parseFloat($(this.$parent.$parent.$el).find('#widget').css('transform').split(',')[3]);
                let sizes_scale = [0.575, 0.766, 0.397, 0.53];
                let sizes_scale_multiplier = [3, 1.7, 6, 3.5]; // Manually added multipliers, gotta find a better way of doing this

                widget_scale = _.isFinite(widget_scale) ? widget_scale * (sizes_scale_multiplier[sizes_scale.indexOf(widget_scale)]) : 1;
                // Note: If you do `widget_scale * NaN` the widget got rendered at his perfect pixel on every device.

                let column1 = item.find('.columns.column1');
                let column2 = item.find('.columns.column2');
                let itemCaption = column2.find('.item-caption').removeAttr('style').outerHeight() * widget_scale;
                let itemCredit = column2.find('.item-credit').removeAttr('style').outerHeight() * widget_scale;
                let instructions = item.find('.widget-instructions').removeAttr('style');

                let defaultColumn2Height = 41;
                let defaultCaptionHeight = 24;
                let defaultCreditHeight = 23;
                let defaultInstructionsHeight = 18;

                let outerHeight = Math.abs(column2.outerHeight() == 0 && this.editorMode ? defaultColumn2Height : (itemCaption > 0 && itemCredit <= 0 ? itemCaption + defaultCreditHeight : (itemCaption <= 0 && itemCredit > 0 ? itemCredit + defaultCaptionHeight : column2.outerHeight()))) * widget_scale;
                let instructionsOuterHeight = Math.abs(instructions.outerHeight() == 0 && this.editorMode ? defaultInstructionsHeight : instructions.outerHeight()) * widget_scale;
                let instructionsTextLength = instructions.text().length <= 0 && this.editorMode ? 1 : instructions.text().length;

                let height = 100;
                if (instructionsTextLength > 0 && outerHeight == 0) {
                    outerHeight = instructionsOuterHeight + 1;
                } else if (instructionsTextLength > 0 && outerHeight > 0){
                    outerHeight += instructionsOuterHeight + 30;
                } else if (instructionsTextLength <= 0 && outerHeight > 0) {
                    outerHeight += 30;
                }

                if (outerHeight > 250) {
                    let difference = outerHeight - 250;
                    outerHeight = 250;

                    let array = [
                        {el: '.widget-instructions', val: instructionsOuterHeight, min: defaultInstructionsHeight}, 
                        {el: '.item-caption', val: itemCaption, min: defaultCaptionHeight}, 
                        {el: '.item-credit', val: itemCredit, min: defaultCreditHeight}
                    ];
                    let useDefaults = false;
                    let res = Math.max.apply(Math, array.map(o => o.val));
                    let highEl = array.find(o => o.val == res);

                    if (highEl.val - difference < highEl.min) {
                        difference = difference / 2;

                        let secondArray = _.filter(array, o => o.el != highEl.el);
                        res = Math.max.apply(Math, secondArray.map(o => o.val));
                        let secondHighEl = secondArray.find(o => o.val == res);

                        if (secondHighEl.val - difference < secondHighEl.min) {
                            useDefaults = true;

                            let thirdArray = _.filter(secondArray, o => o.el != secondHighEl.el);
                            let thirdHighEl = thirdArray[0];

                            $(item).find(thirdHighEl.el).css({
                                'height': thirdHighEl.min * 2,
                                'overflow-y': 'hidden'
                            });
                        }

                        $(item).find(secondHighEl.el).css({
                            'height': useDefaults ? secondHighEl.min * 3.75 : secondHighEl.val - difference,
                            'overflow-y': 'auto'
                        });
                    }

                    $(item).find(highEl.el).css({
                        'height': useDefaults ? highEl.min * 3.75 : highEl.val - difference,
                        'overflow-y': 'auto'
                    });
                }

                column1.css('height', 'calc(' + height + '% - ' + outerHeight + 'px)');
            },
            changeContent: function(i) {
                $(this.$el).find('.active-content .item').each(function() {
                    $(this).css('display', 'none');
                });
                $(this.$el).find('.thumbnails .thumbnail').each(function() {
                    $(this).removeClass('active');
                })
                $(this.$el).find('.active-content .item-' + i).fadeIn();
                $(this.$el).find('.thumbnails .thumbnail-' + i).addClass('active');
                this.activePane = i;

                if (!this.dontAdjust) this.adjustHeightContent(i);
            },
            deleteMedia: function(i) {
                let medias = _.map(this.medias, _.clone);
                medias.splice(i, 1);

                this.setWidgetData(medias);
                this.activePane = this.activePane == medias.length ? this.activePane-1 : this.activePane;
            },
            dataTransferAction: function(i) {
                this.$bus.$emit('data-transfer', i);
            },
            expandImage: function(src) {
                var self = this;
                $(this.$el).find('.fullscreen').fadeIn().addClass('active-fullscreen');
                $(this.$el).find('.fullscreen img').attr('src', src);
                $(this.$el).find('.active-content').css('display', 'none');
                $(this.$el).find('nav').css('display', 'none');
                if (this.isMobile) {
                    $(this.$el).find('.fullscreen .zoomIn').hide();
                    $(this.$el).find('.fullscreen .zoomOut').hide();
                    if (this.zoomInExpandMode) {
                        //$(this.$el).find('.fullscreen img').wrap('<span style="display:inline-block"></span>').css('display', 'block').parent().zoom();
                        $(this.$el).find('.fullscreen img').css('display', 'block').parent().zoom({
                            on: 'grab',
                            callback: function(){
                                $(self.$el).find('.fullscreen-img').css('display', 'none');
                            },
                            onZoomIn: function() {
                                $(self.$el).find('.fullscreen-img').css('display', 'none');
                            },
                            onZoomOut: function(){
                                $(self.$el).find('.fullscreen-img').css('display', 'block');
                            }
                        });
                    }
                } else if (!this.isMobile && this.zoomInExpandMode) {
                    $(this.$el).find('.fullscreen .zoomIn').show();
                    $(this.$el).find('.fullscreen .zoomOut').show();
                }
                if (!this.zoomInExpandMode) {
                    $(this.$el).find('.fullscreen .zoomIn').hide();
                    $(this.$el).find('.fullscreen .zoomOut').hide();
                }
            },
            closeExpand: function() {
                $(this.$el).find('.fullscreen').hide().removeClass('active-fullscreen');
                $(this.$el).find('.active-content').removeAttr('style');
                $(this.$el).find('nav').removeAttr('style');
                $(this.$el).find('.fullscreen img').parent().trigger('zoom.destroy');
                if (this.isMobile) {
                    let cnt = $(this.$el).find('.fullscreen img').parent().contents();
                    $(this.$el).find('.fullscreen .zoom-action-icons').after(cnt);
                    $(this.$el).find('.fullscreen span').remove();
                }
            },
            zoomIn: function() {
                var self = this;
                $(this.$el).find('.fullscreen img').css('display', 'block').parent().zoom({
                    on: 'click',
                    callback: function() {
                        if (!self.isMobile) {
                            $(this).trigger('click.zoom');
                        }
                        $(self.$el).find('.fullscreen-img').css('display', 'none');
                    },
                    onZoomIn: function() {
                        $(self.$el).find('.fullscreen-img').css('display', 'none');
                    },
                    onZoomOut: function(){
                        $(self.$el).find('.fullscreen-img').css('display', 'block');
                    }
                });
            },
            zoomOut: function() {
                $(this.$el).find('.fullscreen img').parent().trigger('zoom.destroy');
                $(this.$el).find('.fullscreen-img').css('display', 'block');
            },
            dragStartThumb: function(i) {
                this.initialDrag = i;
            },
            dragOverThumb: function(i) {
                $(this.$el).find('.thumbnails .thumbnail.borderToDrop').removeClass('borderToDrop');
                $(this.$el).find('.thumbnails .thumbnail-' + i).addClass('borderToDrop');
            },
            dragEndThumb: function() {
                $(this.$el).find('.thumbnails .thumbnail.borderToDrop').removeClass('borderToDrop');
                $(this.$el).find('.thumbnails .thumbnail .action-icons').show();
            },
            dropOnThumb: function(i) {
                $(this).removeClass('borderToDrop');
                var self = this;
                let medias = _.map(this.medias, _.clone);

                let index1 = this.initialDrag;
                let index2 = i;

                let index_2 = index1 > index2 ? index2+1 : index2;

                this.activePane = index_2;
                medias.splice(index_2, 0, medias.splice(index1, 1)[0]);

                this.setWidgetData(medias);

                let index1_height = $(this.$el).find('.item-'+index1+' .column1').attr('style');
                let index2_height = $(this.$el).find('.item-'+index_2+' .column1').attr('style');

                $(this.$el).find('.item-'+index1+' .column1').attr('style', index2_height);
                $(this.$el).find('.item-'+index_2+' .column1').attr('style', index1_height);

                this.dontAdjust = true;

                this.changeContent(this.activePane);
            },
            mouseDownThumb(i, up) {
                if (!up) {
                    $(this.$el).find('.thumbnails .thumbnail-' + i + ' .action-icons').hide();
                } else {
                    $(this.$el).find('.thumbnails .thumbnail-' + i + ' .action-icons').show();
                }
            },
            thumbnailHover: function(k, out) {
                if ($(this.$el).find('.thumbnails .thumbnail-' + k + ' img')) {
                    let url = $(this.$el).find('.thumbnails .thumbnail-' + k + ' img').attr('src');
                    if (!out) {
                        $(this.$el).find('.thumbnails .thumbnail-' + k + ' .img-wrapper').css('background-image', 'linear-gradient( rgba(0,0,0,0.5), rgba(0,0,0,0.5) ), url(' + url + ')');
                    } else {
                        $(this.$el).find('.thumbnails .thumbnail-' + k + ' .img-wrapper').css('background-image', 'url(' + url + ')');
                    }
                }
            },
            arrowNavigation: function(direction) {
                if (direction == 'right') {
                    this.activePane += 1;
                } else {
                    this.activePane -= 1;
                }
                this.changeContent(this.activePane);
            },
            stripHtml: function(html) {
                var tmp = document.createElement("DIV");
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText;
            },
            textLabel: function(text, max) {
                let new_text = text.substring(0, max);
                if (text.length > max) {
                    return new_text + '...';
                } else {
                    return new_text;
                }
            },
            initComponent: function() {
                var self = this;
                $(this.$el).find('.thumbnails .thumbnail-' + this.activePane).addClass('active');

                if (!this.dontAdjust){
                    this.adjustHeightContent(this.activePane);
                } else {
                    setTimeout(function(){
                        self.dontAdjust = false;
                    }, 1000)
                }

                $(window).resize(function(){
                    self.adjustHeightContent(self.activePane);
                });

                $(document).on('dragenter, dragover, drop', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });

                $(this.$el).find('.thumbnails .thumbnail div.icon').each(function() {
                    $(this).attr('style', '');
                });

                if (this.editorMode) {
                    $(this.$el).find('.thumbnails .thumbnail').each(function() {
                        $(this).on('dragenter, dragover', function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                        });
                    });
                }
            },
            updateWidgetData: function(i, type) {
                var self = this;
                let medias = _.map(this.medias, _.clone);
                let content = '';

                if (type == 'label') {
                    content = $(this.$el).find('.item.item-' + i + ' .textdocument__label .fr-element.fr-view').html() || "";
                } else if (type == 'instructions') {
                    content = $(this.$el).find('.item.item-' + i + ' .widget-instructions .fr-element.fr-view').html() || "";
                } else if (type == 'textcontent') {
                    content = $(this.$el).find('.item.item-' + i + ' .textdocument__textcontent .fr-element.fr-view').html() || "";
                } else if (type == 'caption') {
                    content = $(this.$el).find('.item.item-' + i + ' .item-caption .fr-element.fr-view').html() || "";
                } else if (type == 'credit') {
                    content = $(this.$el).find('.item.item-' + i + ' .item-credit .fr-element.fr-view').html() || "";
                }

                if ($.trim(this.stripHtml(content)).length > 0) {
                    medias[i][type] = content;
                } else {
                    medias[i][type] = '';
                }
                this.setWidgetData(medias);
            },
            newDataOnWidget: function(length, index){
                if (!_.isNull(index) && !_.isUndefined(index)){
                    this.activePane = index;
                } else if (_.isUndefined(length)){
                    this.activePane = this.medias.length;
                } else {
                    if (length == 1){
                        this.activePane = this.medias.length;
                    } else {
                        this.activePane = this.medias.length > 0 ? (this.medias.length > length ? this.medias.length : (this.medias.length + length) - length) : 0;
                        this.activePane = length == 1 ? this.activePane+1 : this.activePane;
                    }
                }
            }
        },
        mounted: function() {
            var self = this;

            $(this.$el).find('.item').each(function(i, el){
                $(el).show();
                self.adjustHeightContent(i);
                $(el).removeAttr('style');
                if (i == 0 && $(el).find('.media.galleryimage img').length) {
                    let img = $(el).find('.media.galleryimage img');
                    img.css('display', 'none');
                    setTimeout(function(){
                        img.removeAttr('style');
                    },0);
                }
            });
            this.initComponent();

            this.$bus.$on('addTextItem', function(){
                self.setWidgetData([{'datatype':'text'}], true);
                self.newDataOnWidget();
            });

            this.$bus.$on('addMediaItems', function(medias, dataTransfer){
                var data = _.map(medias, function(item){
                    item.datatype = 'media';
                    return item;
                });

                var newItems = [];
                if (self.medias.length != undefined){
                    newItems = self.medias.slice();
                }

                if (dataTransfer.on) {
                    var index = dataTransfer.index;
                    newItems.splice(index, 1);
                    _.each(data, function(el, i){
                        newItems.splice(index, 0, el);
                        index++;
                    });
                } else {
                    newItems = newItems.concat(data);
                }

                self.setWidgetData(newItems);
                self.newDataOnWidget(data.length, dataTransfer.index);
            });
        },
        updated: function() {
            this.initComponent();

            if (this.newData){
                this.newData = false;
                this.changeContent(this.activePane);
            }
        },
        computed: {
            navigationStyle() {
                return this.$store.state.widget.widget.settings[0].defaultValue;
            },
            thumbnailsVertical() {
                return this.$store.state.widget.widget.settings[1].defaultValue == 'Vertical' ? true : false;
            },
            zoomInExpandMode() {
                return this.$store.state.widget.widget.settings[2].defaultValue == 'On' ? true : false;
            },
            settings() {
                return this.$store.state.widget.widget.settings;
            },
            medias() {
                if (this.$store.state.widget.widget.data.items.length && this.mediasLength != this.$store.state.widget.widget.data.items.length) {
                    this.mediasLength = this.$store.state.widget.widget.data.items.length;
                    this.newData = true;
                }
                return this.$store.state.widget.widget.data.items;
            }
        },
        watch: {
            zoomInExpandMode: function() {
                this.closeExpand();
                this.changeContent(0);
            },
            thumbnailsVertical: function() {
                this.closeExpand();
                this.changeContent(0);
            },
        }
    }
</script>

<style src="../../../static/media-gallery/css/custombox.css"></style>
<style lang="css" src="../../../node_modules/video.js/dist/video-js.css"></style>
