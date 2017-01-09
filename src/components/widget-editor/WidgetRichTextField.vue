<template>
    <section class="widget-rich-text">
        <template v-if="widgetMode == 'editor'">
            <div v-bind:class="className">

                <froala
                    editor-type="headerFooter"
                    group="widget"
                    v-bind:content="content"
                    v-bind:placeholder="placeholder"
                    v-on:froalachanged="updateWidgetData">
                </froala>

            </div>
        </template>
        <template v-else>

            <div v-bind:class="className" v-html="richTextContent"></div>

        </template>

    </section>
</template>

<script>

import Froala from '../Froala'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'WidgetRichTextField',
    components:{
        Froala
    },
    props: ['widgetMode', 'content', 'className', 'placeholder', 'widgetData'],
    computed:{
        richTextContent() {
            return this.content;
        },
    },
    methods: {

        updateWidgetData: function() {
            var newContent = $('.'+ this.className +' .fr-element.fr-view').html() || "";
            if ($.trim(this.stripHtml(newContent)).length <= 0) {
                newContent = '';
            }
            this.$emit('richTextChanged', newContent, this.className);
        },
        stripHtml: function(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText;
        }

    },

}
</script>
