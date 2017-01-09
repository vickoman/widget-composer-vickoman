<template>
	<div class="kb-video-js" :id="id"></div>
</template>

<script>
	var videojs = require('video.js');
    var wavesurfer = require('../plugins/wavesurfer.js/src/wavesurfer.js');
    require('../plugins/videojs-wavesurfer.js');

    export default {
    	name: 'VideoJS',
    	props: ['type', 'src', 'id', 'controls', 'preload', 'poster'],
        data() {
            return {
                typeChanged: false,
                videoTemplate: '<video class="video-js vjs-default-skin"></video>',
                audioTemplate: '<audio class="video-js vjs-default-skin"></audio>'
            }
        },
    	methods: {
    		setVideo: function(el, src, changeFromAudio) {
    			if (changeFromAudio) {
    				if (this.audioPlayer) {
    					this.audioPlayer.waveform.destroy();
    					this.audioPlayer = undefined;
    				}

					let el = $(this.videoTemplate).attr(this.attrs);

	    			$(this.$el).prepend(el);

	    			this.videoPlayer = videojs(el[0]);
    			}
    		},
    		setAudio: function(el, src, update, changeFromVideo) {
    			if (update){
    				if (this.audioPlayer) {
    					this.audioPlayer.waveform.destroy();
    					this.audioPlayer = undefined;
    				}
    				if (changeFromVideo && this.videoPlayer) {
    					this.videoPlayer.dispose();
    					this.videoPlayer = undefined;
    				}

	    			let el = $(this.audioTemplate);

	    			$(this.$el).prepend(el);

	    			this.audioPlayer = videojs(el[0], {
			            controls: true,
			            autoplay: false,
			            loop: false,
			            width: 600,
			            height: 360,
			            plugins: {
			                wavesurfer: {
			                    src: src,
			                    msDisplayMax: 10,
			                    waveColor: '#8EEECC',
			                    progressColor: '#17C588',
			                    hideScrollbar: true,
			                    renderer: "MultiCanvas",
			                    //maxCanvasWidth: 800,
			                    scrollParent: true,
			                    pixelRatio: 1
			                }
			            }
			        });
    			} else {
    				this.audioPlayer = videojs(el, {
			            controls: true,
			            autoplay: false,
			            loop: false,
			            width: 600,
			            height: 360,
			            plugins: {
			                wavesurfer: {
			                    src: src,
			                    msDisplayMax: 10,
			                    waveColor: '#8EEECC',
			                    progressColor: '#17C588',
			                    hideScrollbar: true,
			                    renderer: "MultiCanvas",
			                    //maxCanvasWidth: 800,
			                    scrollParent: true,
			                    pixelRatio: 1
			                }
			            }
			        });
    			}
    		}
    	},
    	mounted: function(){
    		var self = this;

    		if (this.type == 'video'){
    			$(this.$el).prepend($(this.videoTemplate).attr(this.attrs));
    		} else if (this.type == 'audio') {
    			$(this.$el).prepend($(this.audioTemplate));
    		}

			$(this.$el).find('video').first().each(function(){
		        self.videoPlayer = videojs($(this)[0]);
		    });

		    $(this.$el).find('audio').first().each(function(){
		        self.setAudio($(this)[0], self.src);
		    });
    	},
    	computed: {
    		attrs() {
    			return {
    				controls: this.controls,
	    			preload: this.preload,
	    			poster: this.poster,
	    			src: this.src
    			}
    		}
    	},
    	watch: {
    		type: function(){
    			this.typeChanged = true;
    		},
    		src: function(){
    			if (!this.typeChanged && this.type == 'video'){
    				$(this.$el).find('video').attr('src', this.src);
    			} else if (!this.typeChanged && this.type == 'audio') {
    				this.setAudio($(this.$el).find('audio')[0], this.src, true);
    			}

    			if (this.typeChanged && this.type == 'audio') {
    				this.setAudio($(this.$el).find('video')[0], this.src, true, true);
    			} else if (this.typeChanged && this.type == 'video') {
    				this.setVideo($(this.$el).find('audio')[0], this.src, true);
    			}
    		}
    	}
    }
</script>
