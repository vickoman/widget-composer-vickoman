<template>
<div>
    <vue-progress-bar></vue-progress-bar>
    <transition name="fade" mode="out-in">
        <router-view class="view"></router-view>
    </transition>
</div>
</template>
