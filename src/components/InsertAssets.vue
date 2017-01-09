<template>
	<div class="media-modal" id="insert-assets" style="display: none">
	  <div class="media-modal__header">
        <div class="title-container">
            <div class="title">Add Media</div>
            <svg @click="$emit('close')">
                <use xlink:href="#close-x"></use>
            </svg>
        </div>
        <ul class="media-modal__nav">
            <li class="selected">
                <div class="btn-title upload">Upload</div>
            </li>
            <li>
                <div class="btn-title url">By URL</div>
            </li>
            <li>
                <div class="btn-title content">Content Manager</div>
            </li>
        </ul>
    </div>
    <div class="media-modal__canvas">
        <ul class="bottom-nav">
            <li>
                <button class="button-standard-gray">Cancel</button>
            </li>
            <li>
                <button class="button-standard-gray">Add</button>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
	export default {
		name: 'InsertAssets',
			data () {
				return {
			}
		},
		methods: {
			insertAssets: function(){
				console.log('insertAssets')
			}
		}
	}
</script>


