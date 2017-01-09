<template>
    <li class="kds-mb-16">
        <div class="textarea-line-container">
            <label class="u-hidden" for="txtarea-line">{{label}}</label>
            <textarea type="text" class="textarea-line"
                v-bind:id="textareainputId"
                v-bind:placeholder="label"
                v-model:value="textareainputValue"
                v-on:change="textareainputChanged"
                v-on:keyup="textareainputResize"
                v-on:focusin="showLabel"
                v-on:focusout="hideLabel">
            </textarea>
        </div>
    </li>
</template>

<script>

export default {
    name: 'textareainput',
    data (){
        return {
            textareainputId: 'textarea-input-' + this.sectionId + '-' + this.itemId,
            textareainputValue: this.value
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
        textareainputResize: function(event){
            event.target.style.height = "5px";
            event.target.style.height = (event.target.scrollHeight)+"px";
        },
        textareainputChanged: function (event) {
            var newValue = $('#' + this.textareainputId).val();
            this.$emit('textareainputChanged', this.sectionId, this.itemId, newValue)
        }
    },
    mounted : function(){
        this.input = $('#' + this.textareainputId);
    }    
}
</script>