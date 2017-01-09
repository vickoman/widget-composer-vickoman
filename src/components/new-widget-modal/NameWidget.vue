<template>
    <div class="name-widget-component">
        <template v-if="templateId">
            <div class="name-widget-container">
                <div class="input-text">
                    <input class="txt-input" v-bind:placeholder="templateName+ ' Name'"
                        v-model="widgetName"
                        v-on:keydown="limitInput"
                        v-on:keyup.enter="createWidget"/>
                </div>
                <button class="button-standard-green"
                    v-bind:disabled="widgetName.length == 0 ? true : false"
                    v-on:click="createWidget">Start</button>

                <div class="help-text">Please name your {{templateName}} Widget before continuing.</div>
            </div>
            <a class="media-modal-nav-link left-link" v-on:click="backToTemplates">
                <svg>
                    <use xlink:href="#navigation-previous"></use>
                </svg> Back to templates
            </a>
        </template>
        <template v-else>
            <knowbly-loader></knowbly-loader>
        </template>
    </div>
</template>

<script>

    import KnowblyLoader from './../KnowblyLoader'
    import Functions from '../../store/modules/widget'
    export default {
        name: 'NameWidget',
        components:{
            KnowblyLoader
        },
        data (){
            return {
                widgetName: ''
            }
        },
        props:['templateId', 'templateName'],
        methods:{

            limitInput: function(e){
                if(!window.testing){
                    // replaces spaces with hyphens
                    if(e.key == ' '){
                        this.widgetName = this.widgetName + '-'
                    }
                    // accepts letters, numbers, and dashes.
                    // ignores all other characters.
                    if(!/^([A-Za-z0-9\-\_]+)$/.test(e.key)){
                        e.preventDefault()
                        e.stopPropagation()
                    }
                }
            },
            backToTemplates: function(){
                this.$emit('backToTemplates')
            },
            createWidget: function(){
                
                if(_.isEmpty(this.widgetName)){
                    return false;
                }
                
                var vm = this

                var data = '{"title":"", "introduction":"", "caption": "", "credit": "", "items":[]}'

                var widget = '{"widget": {"ownerId": '+ this.$store.state.auth.user.id +', "name": "'+ this.widgetName
                    +'", "clientId": "'+ this.$store.state.containers.clientId
                    +'","data": '+ data +', "widgetTypeId": '+ this.templateId +' }}';


                Functions.actions.createNewWidget(this.$store, widget).then(function(response){
                    vm.editCreatedWidget(vm.$store.state.widget.newWidget.widget.id)
                });

            },
            editCreatedWidget: function(id){
                this.$router.push({ path: '/widget-editor/' + id })
            }
        }
    }
</script>
