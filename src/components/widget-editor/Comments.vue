<template>
    <div class="panel-content" >
        <div class="panel-header">{{panelTitle}}</div>
        <div class="create-comment">
            <!-- <textarea placeholder="Type a comment..." v-model="commentCont" v-on:keyup="onKeyUp"></textarea> -->
            <CommentTextArea :contentType="'comment'" :lastContent="commentCont"/>
            <ul class="btns-comment-cancel u-hide">
                <li class="btn-comment" @click="cancel(widget.widget.id)">CANCEL</li>
                <li class="btn-comment" @click="addComment(widget.widget.id)" v-bind:class="{ 'disabled' : commentCont === '' ? true : false}">COMMENT</li>
            </ul>
        </div>
        <ul class="main-comment-container">
            <Comment v-for="(commData, index) in widgetComments" v-if="widgetComments" :data="{commData, index}"/>
            <!--<div v-if="widgetComments==''">
                &lt;!&ndash;loader&ndash;&gt;
            </div>-->
        </ul>
        
    </div>
</template>
<script>
  import Comment from './comments/Comment'
  import CommentTextArea from './comments/CommentTextArea'
  import Functions from '../../store/modules/widget'
  export default {
    name: 'comments',
    data () {
        return {
            panelTitle: 'Comments',
            commentCont: "",
            widgetComments : [],
        }
    },
    components: {
       Comment,
       CommentTextArea
    },
    props:['widget'],
    computed:{
        widgetComments(){
            return this.$store.getters.getNewComments;
        }
    },
    created() {
        this.$store.dispatch('getWidgetUsers');
    },
    methods: {
        setComment: function(commentValue){
            this.commentCont = commentValue;
        },
        addComment: function (id,e) {
            var fullname = this.$store.state.auth.user.firstName + " " + this.$store.state.auth.user.lastName;
            this.$store.dispatch('setWidgetComment',{id:id,content:this.addLinkContent(this.commentCont), name:fullname,ownerId:this.$store.state.auth.user.id});
            this.getComments(this.$store,id);
            this.commentCont = "";
            this.$bus.$emit('clear');
        },
        getComments : function(store,id){
            setTimeout(function(){Functions.actions.getWidgetComments(store,id)},300);
        },
        cancel : function(id, e){
            this.commentCont = "";
            this.$el.querySelector('.btns-comment-cancel').classList.add('u-hide');
            this.$bus.$emit('clear');
            // console.log(this.$store.state.widget.widget.users.usernames);
        },
        addLinkContent : function(contentValue){
            this.$store.dispatch('getWidgetUsers');
            var widgetUsers = this.$store.state.widget.widget.users?this.$store.state.widget.widget.users.usernames:[];
            var slices = contentValue.split(" ");
            var finalContent, first, last, ocurrences = [];
            $.each( slices, function( i, val ) {
                if(val[0]=="@"){
                    $.each( widgetUsers, function(index,userObject) {
                        if(userObject.username == val.substr(1)){
                            ocurrences.push(val);
                            return false;
                        }
                    });
                }
            });
            $.each( ocurrences, function( i, val ) {
                first = contentValue.indexOf(val);
                last = val.length + first;
                finalContent = contentValue.substring(0, first) + "<a>" + val + "</a>" + contentValue.substring(last, contentValue.length);
                contentValue = finalContent;
            });
            //TODO: Send Notification
            return contentValue;
        }
    },

    mounted : function(){
        var that = this;
        var txt = this.$el.querySelector('.create-comment');
        txt.addEventListener('focusin', function(e){
            that.$el.querySelector('.btns-comment-cancel').classList.remove('u-hide');
        })
    }
  }
</script>
