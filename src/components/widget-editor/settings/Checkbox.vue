<template>
    <li class="kds-mb-32">
        <div class="checkbox">
            <input type="checkbox" v-bind:id="checkboxId" v-model="checked" v-on:change="checkboxChanged">
            <label v-bind:for="checkboxId">{{ label }}</label>
        </div>
    </li>
</template>

<script>

export default {
    name: 'checkbox',
    data (){
        return {
            checkboxId: 'checkbox-' + this.renderedId,
            checked: this.defaultValue
        }
    },
    props: ['label', 'defaultValue', 'renderedId'],
    methods: {
        checkboxChanged: function (event) {
            this.$emit('checkboxChanged', this.renderedId, this.checked,this.label)
        }
    },  
}
</script>