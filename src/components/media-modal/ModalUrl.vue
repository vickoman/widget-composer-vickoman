<template>
	<div>
		<div class="media-modal__url">
			<div class="input-text">
				<label class="u-hidden" for="txt-input"></label>
				<input type="text" name="" class="txt-input" placeholder="Enter URL" v-model="url" v-on:keyup.enter="showPreview" />
			</div>
			<div class="url-instruction" v-if="storedArray.length <= 0">A preview of your URL content will appear below.</div>
			<div class="url-preview">
				<ul class="media-container">
					<li v-for="item in storedArray" class="media-shell" @click="selectItem(item)" :id="item.id">
						<div class="selection selected"></div>
						<div class="delete-media">
							<div class="trash-icon" @click="deleteMediaItem(item)">
								<svg>
									<use xlink:href="#trash"></use>
								</svg>
							</div>
						</div>
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
		name: 'modalurl',
		data () {
			return {
				container: {name: 'newFolder'},
				url: "",
				disableButton: true,
				hoverName: "",
				selectedArray:[],
				storedArray:[]
			}
		},
		props: {
			allowedFormats: Array,
			contentManager: Boolean
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
			this.$store.dispatch('getContainers');
			this.getClientItems()
//			this.$store.dispatch('getClientItems',{skip:0,limit:0})
		},
		methods: {
			uploadByUrl(e) {
				var that = this;
				if(this.$options.filters.isValidExtension(this.url, this.allowedFormats)){
					this.disableButton = false;
					let arr = [];
					arr.push(this.$store.dispatch('addMediaByUrl', {container: this.$store.state.containers.container.name, url: this.url}))
					Promise.all(arr)
					.then((itemsArray) => {
						console.log("arrayItems: ",itemsArray);
						$.each(itemsArray, function( index, item ) {
							that.storedArray.push(item.media);
							that.selectedArray.push(item.media);
						});
						if(this.contentManager){
							this.getClientItems()
//							this.$store.dispatch('getClientItems',{skip:0,limit:0})
						}
					})
				}
			},
			cancel(e) {
				var that = this;
				this.url = "";
				$.each(this.storedArray, function( indexStored, itemStored ) {
					that.deleteMedia(itemStored);
				});
				this.storedArray = [];
				this.selectedArray = [];
				$(".media-shell .selected").removeClass("selected");
				this.disableButton = true;
				if(!this.contentManager){
					this.$store.dispatch('getClientItems',{skip:0,limit:0})
				}
				this.closeModal();
			},
			showPreview(e) {
				this.uploadByUrl();
				this.url = "";
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
			selectItem(item) {
				if(this.contentManager){
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
				}
			},
			addSelection(selection) {
				this.selectedArray.push(selection);
			},
			deleteSelection(selection) {
				var that = this;
				var selectedIndex = null;
				$.each(this.selectedArray, function( index, item ) {
					if(item.id == selection.id){
						selectedIndex = index;
					}
				});
				that.selectedArray.splice(selectedIndex, 1);
			},
			deleteMediaItem(item) {
				var that = this;
				var selectedIndex = null;
				$.each(this.storedArray, function( index, itemStored ) {
					if(item.id == itemStored.id){
						selectedIndex = index;
					}
				});
				this.storedArray.splice(selectedIndex, 1);
				this.deleteMedia(item);
				this.deleteSelection(item);
			},
			addItems(e) {
				if(!this.contentManager){
					this.getClientItems();
//					this.$store.dispatch('getClientItems',{skip:0,limit:0})
				}
				this.$parent.addItems(this.selectedArray);
				this.closeModal();
			},
			closeModal(e) {
				this.$parent.closeModal();
			},
			deleteMedia(item) {
				let id = item.id;
				let fileName = item.name;
				console.log("DELETE: ",{id, fileName })
				this.$store.dispatch('deleteMedia', {id, fileName, isUrl: true});
				if(this.contentManager){
					this.getClientItems()
//					this.$store.dispatch('getClientItems',{skip:0,limit:0})
				}
			},
			getClientItems : function(){
				this.$store.dispatch('getClientItems',{id:1,params:{skip:0,limit:0}});
			}
		}
	}
</script>