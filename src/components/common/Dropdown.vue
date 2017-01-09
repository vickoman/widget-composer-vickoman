<template>
    <div>
        <div @click="showList = !showList">
            <svg width="16" height="22" class="color--white">
                <use xlink:href="#sort"></use>
            </svg>
            <svg class="dropdown-input__arrow" width="10" height="6">
                <use xlink:href="#arrow-down"></use>
            </svg>
        </div>
        <div class="dropdown-input" v-bind:class="{'u-hide':showList}" >
            <ul class="dropdown-input__content">
                <template v-for="item in list">
                    <li v-on:click="inputChanged(item)">{{item.label}}</li>
                </template>
            </ul>
        </div>
    </div>
</template>
<style scoped lang="scss">
    .dropdown-input{
        position: absolute;
        border:0;
        > ul{
            &.dropdown-input__content{
                top: 16px;
                min-width: 110px;
                color:black;
                left: -35px;
            }
        }
    }
    .dropdown-input__arrow{
        position: absolute;
        margin-top: -15px;
        margin-left: 19px;
        fill: white;
    }
</style>
<script>
    export default {
        name: 'Dropdown',
        props:['label','inputValue','list'],
        methods:{
            inputChanged: function (item) {
                this.$emit('inputChanged',  item);
                this.showList = !this.showList;
            }
        },
        data() {
            return {
                showList : true
            }
        }
    }
</script>