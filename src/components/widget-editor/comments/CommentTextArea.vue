<template>
    <div class="text-area-comment">
        <textarea :placeholder="'Type a '+contentType+'...'" v-model="content" v-on:keyup="onKeyUp" ></textarea>
        <input type="hidden" name="" v-model="searchUser" value="" />
        <ul class="user-list-container" v-if="showUserList.show && widgetUsers.length > 0" tabindex="0"> 
            <li v-for="(usersData, index) in widgetUsers" class="users-list-body" @click="callUser(textCall, usersData.username); userListOnly = true" tabindex="0" v-bind:class="{ active: index==0 }" v-on:mouseover="onMouseOver" :itemValue="usersData.username">
                <div class="name">{{ usersData.username }} -- {{usersData.fullName}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'commenttextarea',
        props: ['contentType','lastContent'],
        data (){
            return {
                content: this.lastContent ? this.$options.filters.removeTags(this.lastContent) : '',
                showUserList: {show:false, first:0, last:0},
                widgetUsers : [],
                textCall: "",
                searchUser: "",
                enableFilter: true,
                endSelection: "",
                userListOnly: false,
            }
        },
        watch: {
            content: function (val) {
                if(this.showUserList.show){
                    this.showUserList.last =val.substr(this.showUserList.first).indexOf(" ");
                    if(this.enableFilter){
                        if(parseInt(this.showUserList.last) == -1){
                            this.searchUser = val.substr(this.showUserList.first);
                        }else{
                            this.searchUser = val.substr(this.showUserList.first,this.showUserList.last);
                        }
                    }         
                }
                if(this.contentType == "comment"){
                    this.$parent.setComment(val);
                }else{
                    this.$parent.setReply(val);
                }
            }
        },
        created() {
            this.$store.dispatch('getWidgetUsers');
        },
        computed:{
            widgetUsers() {
                var searchUser = this.searchUser;
                var that = this;
                let allUsers = this.$store.state.widget.widget.users?this.$store.state.widget.widget.users.usernames:[];
                if (allUsers && allUsers.length > 0){
                    let usrs = allUsers
                    if(!searchUser){
                        usrs.filter(function(user){
                            return user;
                        })
                        return usrs;
                    }
                    searchUser = searchUser.trim().toLowerCase();
                    usrs = usrs.filter(function(user){
                        if(user.username.toLowerCase().indexOf(searchUser) !== -1 || user.fullName.toLowerCase().indexOf(searchUser) !== -1 ){
                            return user;
                        }
                    })
                    return usrs;
                }else{
                    this.hideUsers();
                }
            },
        },
        methods: {
            showUsers : function(target, first, last){
                this.$store.dispatch('getWidgetUsers');
                this.searchUser = "";
                this.textCall = target;
                this.showUserList.show = true;
                this.showUserList.first = first;
                this.showUserList.last = last;
            },
            hideUsers : function(first, last){
                this.showUserList.show = false;
                this.searchUser="";
            },
            onMouseOver : function(e){
                e.preventDefault();
                e.stopPropagation();
                if($(e.target).hasClass("users-list-body")){
                    if(!$(e.target).hasClass("active")){
                        $(".user-list-container li").removeClass("active");
                        $(e.target).addClass("active");
                        this.enableFilter= false;
                        this.getUserName(this.textCall, $(e.target).attr("itemValue"));
                    }
                }
            },
            onKeyUp : function(e){
                var selectionStart = $(e.target).prop("selectionStart");
                this.enableFilter = true;
                if( e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18 && e.keyCode != 91) // SHIFT || CTRL || ALT || CMD
                {
                    if(selectionStart == 1 || e.target.value.substr(selectionStart-2,1) == " "){
                        if(e.target.value.substr(selectionStart-1,1) == "@" ){
                            this.showUsers(e.target, selectionStart,e.target.value.substr(selectionStart).indexOf(" "));
                        }
                    }
                }
                if(e.keyCode == 32 || selectionStart < this.showUserList.first){ //SPACEBAR
                    this.hideUsers();
                }
                if(this.showUserList.show){
                    if (e.keyCode == 38) { //UP ARROW
                        this.enableFilter= false;
                        var active = $(".user-list-container .active");
                        $(".user-list-container li").removeClass("active");
                        if (active.prev().length == 0) {
                            active.siblings().last().addClass("active");
                        } else {
                            var selection = active.prev();
                            selection.last().addClass("active");
                            $.each($(active), function( index, item ) {
                                $(item).removeClass("active");
                            });
                        }
                        this.getUserName(this.textCall, $(".user-list-container .active").attr("itemValue"));
                    }
                    if (e.keyCode == 40) { //DOWN ARROW
                        this.enableFilter = false;
                        var active = $(".user-list-container .active");
                        $(".user-list-container li").removeClass("active");
                        if (active.next().length == 0) {
                            active.siblings().first().addClass("active");
                        } else {
                            var selection = active.next();
                            selection.last().addClass("active");
                            $.each($(active), function( index, item ) {
                                $(item).removeClass("active");
                            });
                        }
                        this.getUserName(this.textCall, $(".user-list-container .active").attr("itemValue"));
                    }
                    if (e.keyCode == 13) { //ENTER
                        var active = $(".user-list-container .active");
                        active.trigger("click");
                    }
                }else{
                    if(e.keyCode == 8 || e.keyCode == 46 ){ //BACKSPACE || SUPR
                        var diff, counter = 0;
                        for (counter = 1; counter <=  e.target.value.length; counter++) {
                            var character = e.target.value.substr((selectionStart - counter),1);
                            if(character == "@"){
                                if( (e.target.value.substr((selectionStart - (counter + 1) ),1) == " " && selectionStart - (counter + 1) > 0 ) || (selectionStart - counter ) == 0) {
                                    this.showUserList.first = selectionStart - (counter - 1);
                                    this.showUserList.last = selectionStart;
                                    diff = this.showUserList.last - this.showUserList.first;
                                    this.searchUser = e.target.value.substr(this.showUserList.first,diff);
                                    this.showUserList.show = true;
                                }
                                return false;
                            }else if(character == " " || (selectionStart - counter) <= 0){
                                return false;
                            }
                        }
                    }
                }
            },
            getUserName : function(myField, myValue){
                if (document.selection) {
                    myField.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                }
                else if (myField.selectionStart || myField.selectionStart == '0') {
                    var startPos = this.showUserList.first;
                    var endPos = myField.selectionEnd;
                    if (myField.value.substring(endPos, myField.value.length).length > 0){
                        this.endSelection = myField.value.substring(endPos, myField.value.length);
                    }
                    if(myField.value.substring(endPos, endPos + 1) == " "){
                        myField.value = myField.value.substring(0, startPos) + myValue  + this.endSelection;
                    }else{
                        myField.value = myField.value.substring(0, startPos) + myValue + " " + this.endSelection;
                    }
                } else {
                    myField.value += myValue + " ";
                } 
                myField.focus();
                var caretPos = startPos + myValue.length;
                myField.setSelectionRange(caretPos, caretPos);
                this.content = myField.value;
                return myField.value;
            },
            callUser: function(field, value){
                this.content = this.getUserName(field, value);
                this.endSelection = "";
                this.showUserList.show = false;
            },
        },
        mounted : function(){
            var that = this;
            this.$bus.$on('clear', function(){
                that.content = "";
                that.hideUsers();
            });
            $(".text-area-comment textarea").keydown(function(e) {
                if(that.showUserList.show){
                    var key = e ? e.which : window.event.keyCode;
                    if(key==13 || key==38 || key==40) { //ENTER || UP ARROW || DOWN ARROW
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });
            $(".view").on("click", function (e) {
                if (!that.userListOnly) {
                    if (that.showUserList.show) {
                        that.showUserList.show = false;
                    }
                }
                that.userListOnly = false;
            });
        }
    }
</script>