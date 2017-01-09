<template>
    <div class="tagger">
        <div class="tagger--container kds-shadow--box kds-b kds--b--gray">
            <div class="tagger--holder kds--flex kds--row kds-align-center" @click="setFocus()">
                <div class="width-10" v-if="label">
                    {{label}}
                </div>
                <div class="width-5" v-if="label"></div>
                <div class="tagger--elements kds--flex width-100" v-bind:class="{'width-100 kds-b kds--b--gray':label}">
                    <div class="tagger--pills width-90 kds-float-r">
                        <div v-for="tag in selectedTags" class="kds--pills kds--inlineb">
                            {{tag.name}}
                            <button class="btn btn--rounded--small " @click="removeTag(tag)">
                                <svg>
                                    <use xlink:href="#close-x"></use>
                                </svg>
                            </button>
                        </div>
                        <input type="text" minlength="3" ref="tags" @keyup.enter="tagBehavior()" @keyup.delete="reset()"  v-on:keyup.188="createTag()" v-model="tagModel" v-on:focus="showList=true" v-on:change="tagInputChanged" v-bind:class="{'width-100':selectedTags.length==0,'width-40':selectedTags.length>0}" >
                    </div>
                    <div class="tagger--button width-10 kds-float-r kds--flex">
                        <button @click="showList = !showList" class="width-100 kds--bg-green kds--b-0">
                            <svg class="color--white kds--svg-standard" preserveAspectRatio="none">
                                <use xlink:href="#arrow-down"></use>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="kds--absolute kds--flex kds--row" v-if="showList">
                <ul class="tagger--list kds-b kds--b--gray">
                    <li class="kds--bb kds--b--gray"><span>Suggestions</span> <knowbly-loader :text="'Searching'" v-if="items.length==0 && showList && tagModel" /></li>
                    <li v-for="item in items.list" @click="selectCreatedTag(item)" v-if="items.hasTags">
                        {{item.name}}
                    </li>
                    <li class="kds--bb kds--b--gray" @click="createTag()" v-if="!items.hasTags && tagModel">{{tagModel}} (Create new label)</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import KnowblyLoader from '../KnowblyLoader'

    export default {
        name: 'Tag',
        props: ['label','tags','isPreview'],
        data(){
            return {
                items: [],
                selectedTags : [],
                showList: false,
                enterPressed:0,
                tagModel:null
            }
        },
        components:{
            KnowblyLoader
        },
        created : function(){
            this.selectedTags = this.$options.propsData.tags || [];
        },
        watch:{
            selectedTags : function(val){
//                console.log(val,'tagger')
            }
        },
        methods:{
            selectTag : function(){
                var string = this.tagModel.replace(/[^\w\s]/gi, '');
                if(this.$options.propsData.isPreview){
                    this.$store.commit('UPDATE_WIDGET_TAGS',{tag:{name:string}})
                }else{
                    this.selectedTags.push({name:string});
                    this.selectedTags = _.uniq(this.selectedTags);
                }
            },
            selectCreatedTag : function(item){
                this.setFocus();
                this.tagModel = null;
                if(this.$options.propsData.isPreview){
                    this.$store.commit('UPDATE_CREATED_WIDGET_TAGS',{item})
//                    this.selectedTags.push(item);
                }else{
                    this.selectedTags.push(item);
                    this.selectedTags = _.uniq(this.selectedTags);
                }
                this.tagBehavior()
            },
            setFocus : function(){
                this.$refs.tags.focus()
            },
            tagBehavior:function(){
                this.enterPressed = this.enterPressed + 1;
                if(this.enterPressed ===1) {
                    this.createTag();
                    this.showList = false;
                    this.$emit('selectedTag', this.selectedTags);
                    this.enterPressed = 0;
                }
            },
            createTag : function(){
                return !_.isNull(this.tagModel) && _.size(this.tagModel)>=3 ? (this.selectTag(),this.tagModel = null, this.$refs.tags.focus()): false
            },
            removeTag : function(item){
                if(this.$options.propsData.isPreview){
                    if(item.connectionId){
                        this.$store.dispatch('removeTag',{item:item})
                    }else{
                        this.$store.commit('REMOVE_WIDGET_TAGS',{item})
                    }
                    this.$parent.deleteTag(item);
//                    this.$store.getters.getTags
                }else{
                    this.selectedTags = _.remove(this.selectedTags,function(tag){
                        return tag.id !== item.id
                    });
                }

            },
            reset : function(){
                this.items = [];
                this.showList = false;
            },
            tagInputChanged : function(){
                var self = this;
                if(_.size(this.tagModel)>=3){
                    this.$store.dispatch('queryTag',{query:self.tagModel});
                    this.items = _.size( this.$store.state.containers.tags) > 0 ? this.$store.state.containers.tags: [];
                }
            }
        }
    }
</script>