<template>
    <li>
        <div class="main-comment">
            <div class="name-container">
                <div class="name-date">
                    <div class="name">{{ data.commData.fullName }}</div>
                    <div class="date">{{ data.commData.dateCreated | formatDate }}</div>
                </div>
                <div class="comment-menu">
                    <a v-if="data.commData.ownerId == this.$store.state.auth.user.id">
                        <svg viewBox="0 0 4 14">
                            <path d="M5.25,17a2,2,0,1,1,2,2A2,2,0,0,1,5.25,17Zm0-5a2,2,0,1,1,2,2A2,2,0,0,1,5.25,12Zm0-5a2,2,0,1,1,2,2A2,2,0,0,1,5.25,7Z" transform="translate(-5.25 -5)"/>
                        </svg>
                    </a>
                    <div class="comment-menu-dd u-hide">
                        <div class="btn-delete" @click="deleteComment(data.commData)">Delete</div>
                        <div class="btn-edit" v-on:click="show = !show" v-if="!show">Edit</div>
                    </div>
                </div>
            </div>
            <div class="msg" v-if="!show" v-html="content"></div>
            <div v-if="show">
                <!-- <textarea placeholder="Type a comment..." v-model="content"></textarea> -->
                <CommentTextArea :contentType="'comment'" :lastContent="content"/>
                <ul class="btns-comment-cancel" >
                    <li @click="cancel">CANCEL</li>
                    <li class="btn-comment" @click="updateComment(data.commData,content)">UPDATE</li>
                </ul>
            </div>
        </div>
        <div class="reply-container">
            <div class="reply-header">
                <svg viewBox="0 0 9 4.5">
                    <path d="M0,0,4.5,4.5,9,0Z"/>
                </svg>
                Reply <span v-if="data.commData.comment!=''"> &nbsp; ({{commentsSize}})</span>
            </div>
            <ul class="replies u-hide">
                <ul class="area-container">
                    <!-- <textarea placeholder="Type a reply..." v-model="replyCont" v-on:keyup="onKeyUp"></textarea> -->
                    <CommentTextArea :contentType="'reply'" :lastContent="replyCont"/>
                    <ul class="btns-reply-cancel u-hide">
                        <li @click="cancelReply">CANCEL</li>
                        <li @click="addReply">REPLY</li>
                    </ul>
                </ul>
                <ul class="reply-list">
                    <reply v-for="(replyData, index) in data.commData.comment" :data="{replyData, index}"></reply>
                </ul>
            </ul>
        </div>
    </li>
</template>

<script>
    import Reply from './Reply'
    import CommentTextArea from './CommentTextArea'
    import Functions from '../../../store/modules/widget'
    var newComment = '';
    export default {
        name: 'comment',
        props: ['data'],
        data (){
            return {
                show: false,
                replyCont: "",
                content: this.data.commData.content ? this.data.commData.content : ''
            }
        },
        computed:{
            content: {
                get: function () {
                    return this.data.commData.content ? this.data.commData.content : ''
                },
                set: function (newValue) {
                    newComment = newValue;
                }
            },
            commentsSize(){
                return this.data.commData.comment ? this.data.commData.comment.length : null;
            }
        },
        components: {
            'reply' : Reply,
            CommentTextArea
        },
        methods: {
            setComment: function(commentValue){
                this.content = commentValue;
            },
            setReply: function(replyValue){
                this.replyCont = replyValue;
            },
            deleteComment: function (comment) {
                Functions.actions.removeWidgetComment(this.$store,comment);
                this.getComments(this.$store,this.data.commData.widgetId);
            },
            updateComment: function (comment) {
                this.show = !this.show;
                Functions.actions.updateWidgetComment(this.$store,comment,this.addLinkContent(newComment));
                this.getComments(this.$store,this.data.commData.widgetId);
            },
            cancel: function (e) {
                this.content = '';
                this.show = !this.show;
                this.$bus.$emit('clear');
            },
            addReply: function (e) {
                var fullname = this.$store.state.auth.user.firstName + " " + this.$store.state.auth.user.lastName;
                Functions.actions.setReply(this.$store,{parent:this.data.commData.id, ownerId:this.$store.state.auth.user.id, name:fullname,content: this.addLinkContent(this.replyCont)})
                document.querySelector('.btns-reply-cancel').classList.add('u-hide');
                this.getComments(this.$store,this.data.commData.widgetId);
                this.replyCont = "";
                this.$bus.$emit('clear');
            },
            deleteReply: function(reply) {
                Functions.actions.removeReply(this.$store,this.data.commData.id,reply);
                this.getComments(this.$store,this.data.commData.widgetId);
            },
            updateReply: function(reply) {
                Functions.actions.updateReply(this.$store,this.data.commData.id,reply.reply,this.addLinkContent(reply.newReply));
                this.getComments(this.$store,this.data.commData.widgetId);
            },
            getComments: function(store,data,id){
                setTimeout(function(){Functions.actions.getWidgetComments(store,data,id)},400);
            },
            cancelReply: function (e) {
                this.replyCont = "";
                this.$el.querySelector('.btns-reply-cancel').classList.add('u-hide');
                this.$bus.$emit('clear');
            },
            onKeyUp: function(e){
                this.$bus.$emit('userskeyUp', e);
            },
            addLinkContent: function(contentValue){
                return this.$parent.addLinkContent(contentValue);
            }
        },
        mounted : function(){
            var that = this;
            var txt = this.$el.querySelector('.replies');
            txt.addEventListener('focusin', function(e){
                that.$el.querySelector('.btns-reply-cancel').classList.remove('u-hide');
            });
            this.$el.querySelector('.comment-menu').addEventListener('click', function(e) {
                that.$el.querySelector('.comment-menu-dd').classList.toggle('u-hide');
            });

            this.$el.querySelector('.reply-header').addEventListener('click', function(e) {
                that.$el.querySelector('.replies').classList.toggle('u-hide');
            })
        }
    }
</script>