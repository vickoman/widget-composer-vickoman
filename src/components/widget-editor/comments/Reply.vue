<template>
    <li class="reply-body" >
        <div class="name-container">
            <div class="name-date">
                <div class="name">{{ data.replyData.fullName }}</div>
                <div class="date">{{ data.replyData.dateCreated | formatDate }}</div>
            </div>
            <div class="comment-menu" >
                <a v-if="data.replyData.ownerId == this.$store.state.auth.user.id">
                    <svg viewBox="0 0 4 14">
                        <path d="M5.25,17a2,2,0,1,1,2,2A2,2,0,0,1,5.25,17Zm0-5a2,2,0,1,1,2,2A2,2,0,0,1,5.25,12Zm0-5a2,2,0,1,1,2,2A2,2,0,0,1,5.25,7Z" transform="translate(-5.25 -5)"/>
                    </svg>
                </a>
                <div class="comment-menu-dd u-hide">
                    <div class="btn-delete" @click="deleteReply(data.replyData)">Delete</div>
                    <div class="btn-edit" v-on:click="show = !show" v-if="!show">Edit</div>
                </div>
            </div>
        </div>
        <div class="msg" v-if="!show" v-html="replycontent"></div>
        <div v-if="show">
            <CommentTextArea :contentType="'reply'" :lastContent="replycontent"/>
            <ul class="btns-reply-cancel">
                <li @click="cancel">CANCEL</li>
                <li @click="updateReply(data.replyData)">UPDATE</li>
            </ul>
        </div>
    </li>
</template>

<script>
    import CommentTextArea from './CommentTextArea'
    var newReply = '';
    export default {
        name: 'reply',
        props: ['data'],
        data (){
            return {
                replycontent: this.data.replyData.content,
                show: false
            }
        },
        computed:{
            replycontent: {
                get: function () {
                    return this.data.replyData.content ? this.data.replyData.content : ''
                },
                set: function (newValue) {
                    newReply = newValue;
                }
            }
        },
        components: {
            CommentTextArea
        },
        methods: {
            setReply: function(replyValue){
                this.replycontent = replyValue;
            },
            deleteReply: function (comment) {
                this.$parent.deleteReply(comment);
            },
            updateReply: function (reply) {
                this.$parent.updateReply({reply:reply,newReply:newReply});
                this.show = !this.show
            },
            cancel: function (e) {
                this.replycontent = this.data.replyData.content ? this.data.replyData.content : '';
                this.show = !this.show;
                this.$bus.$emit('clear');
            }
        },
        mounted : function(){
            var that = this;
            if(this.data.replyData.ownerId == this.$store.state.auth.user.id){
                this.$el.querySelector('.comment-menu').addEventListener('click', function(e) {
                    that.$el.querySelector('.comment-menu-dd').classList.toggle('u-hide');
                })
            }
        }
    }
</script>