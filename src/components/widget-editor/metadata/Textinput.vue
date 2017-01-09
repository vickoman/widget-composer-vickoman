<template>
    <li class="kds-mb-16">    
        <div class="input-text">
            <label class="u-hidden" v-bind:for="textinputId">{{label}}</label>
            <input type="text" class="txt-input" 
                v-bind:id="textinputId"
                v-bind:placeholder="label"
                v-model:value="textinputValue"
                v-on:change="textinputChanged"
                v-on:focusin="showLabel"
                v-on:focusout="hideLabel"
                />
        </div>
    </li>
</template>

<script>

export default {
    name: 'textinput',
    data (){
        return {
            textinputId: 'text-input-' + this.sectionId + '-' + this.itemId,
            textinputValue: this.value
        }
    },
    props: ['label', 'value', 'sectionId', 'itemId'],
    methods: {
        showLabel: function(){
            this.input.prev().removeClass('u-hidden')
        },
        hideLabel: function(){
            this.input.prev().addClass('u-hidden')
        },
        textinputChanged: function (event) {
            var newValue = $('#' + this.textinputId).val();
            this.$emit('textinputChanged', this.sectionId, this.itemId, newValue)
        }
    },
    mounted : function(){
        this.input = $('#' + this.textinputId);
    }  

}
</script>