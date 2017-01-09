<template>
    <header class="header header--bg-gray" >
        <div class="header__title ">Widget Composer</div>
        <a href="#" @click="saveThumb">
            <svg>
                <use xlink:href="#close-x"></use>
            </svg>
        </a>
    </header>
</template>
<script>
    export default {
        name : 'headerindex',
        methods: {
            saveThumb() {
                this.$store.dispatch('setWidgetThumbnail', {widgetId: this.$store.state.widget.widget.id, container: this.$store.state.containers.container.name});
                this.$router.push({ name: 'contentManagerView'})
            }
        }
    }
</script>