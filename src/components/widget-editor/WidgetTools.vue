<template>
    <div class="media-tools" >
        <ul v-if="tools">        
            <template v-for="tool in tools">
                

                <li class="button-icon image-icon" id="show-modal" v-if="tool == 'Media'">
                    <a @click="openModal">
                        <svg>
                            <use xlink:href="#image-button"></use>
                        </svg>
                    </a>
                </li>

                <li class="button-icon text-icon" id="add-text" v-if="tool == 'RichText'">
                    <a @click="addText">
                        <svg>
                            <use xlink:href="#text-button"></use>
                        </svg>
                    </a>
                </li>
                

            </template>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'WidgetTools',
        props: ['tools'],
        methods: {
            openModal: function (e) {
                this.$parent.openModal('upload');
            },
            addText: function(e) {
                this.$bus.$emit('addTextItem');
            }
        }
    }
</script>
