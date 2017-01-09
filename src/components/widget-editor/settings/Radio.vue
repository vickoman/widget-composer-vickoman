<template>
    <li class="kds-mb-32">
        <div class="radio-buttons-vertical">
            <div class="radio-button-header">{{title}}</div>
            <ul>
                <template v-for="(item, i) in labels">
                    <li>                        
                        <input type="radio"
                            v-model="checked"
                            :value="item.label"
                            v-bind:name="radioName"
                            v-bind:id="radioName + '-' + i"
                            v-on:change="radioChanged"
                            >
                        <label v-bind:for="radioName + '-' + i">{{item.label}}</label>
                    </li>                    
                </template>
            </ul>
        </div>
    </li>
</template>

<!-- v-bind:checked="[checked == item.label ? 'checked' : '']" -->
<script>

export default {
    name: 'radio',
    data (){
        return {
            radioName: 'radio-' + this.renderedId,
            checked : this.defaultValue
        }
    },

    props: ['title', 'labels', 'defaultValue', 'renderedId'],
    methods: {
        radioChanged: function (event) {
            var checkedLabel = $('input[name="'+this.radioName+'"]:checked').val();
            this.$emit('radioChanged', this.renderedId, checkedLabel)
        }
    },  
}
</script>