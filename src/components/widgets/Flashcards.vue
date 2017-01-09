<template>
    <section>
        <template v-for="(flashcard, index) in flashcards">
            <section>
                <h3>{{flashcard.term}} - {{index}}<h3>
                <h4>{{flashcard.definition}}</h4>
                <input v-model="flashcard.definition">
            </section>
        </template>
    </section>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'Flashcards',
        components: {
           
        },
        props: ['widgetMode'],
        data() {
            return {
                flashcards: this.$store.getters.getWidgetData.items
            }
        },
        // computed: {

        //     widgetData () {
        //         return this.$store.getters.getWidgetData
        //     }

        // },
        // created: function() {
        //     this.$store.dispatch('getWidgetData', this.$route.params.id);
        //     //console.log('setWidgetTitle', setWidgetTitle)
        // },
        // methods: {
        //     setWidgetTitle: _.debounce( function(e){
        //             this.$store.dispatch("setWidgetTitle", {e: e});                
        //     }, 1300)  
        // },
        // methods: mapActions({
        //     setWidgetTitle: 'setWidgetTitle' // map this.myMethod() to store.dispatch('b')
        // })
        
        // vuex: {
        //     // getters: {
        //     //     widgetTitle: state => this.$store//state.widget
        //     // },
        //     actions: {
        //         editWidgetTitle
        //     }
        // }
        // methods: MG.methods,
        // mounted: MG.mounted,
        // updated: MG.updated,
        // computed: MG.computed,
        // watch: MG.watch
    }
</script>