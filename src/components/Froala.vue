<template>
    <div>
        <div v-html="content"></div>
    </div>
</template>

<script>
require('jquery')

require('froala-editor/js/froala_editor.min.js')
require('froala-editor/js/plugins/colors.min.js')
require('froala-editor/js/plugins/image.min.js')
require('froala-editor/js/plugins/image_manager.min.js')
require('froala-editor/js/plugins/align.min.js')
require('froala-editor/js/plugins/link.min.js')
require('froala-editor/js/plugins/lists.min.js')

import _ from 'lodash'

function extractContent(s) {
    var span= document.createElement('span');
    span.innerHTML= s;
    return span.textContent || span.innerText;
}

const opts = {
    widget: {
        toolbarButtons:   ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
    },
    default: {
        toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtons:   ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink']
    },
    headerFooter: {
        toolbarButtons:   ['bold', 'italic', 'underline', 'strikeThrough', 'color',],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'color',],
        toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', 'color',],
    },
    mediaOneLine: {
        toolbarButtons:   ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtonsSM: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        multiLine: false
    }
}

export default {
    name: 'Froala-Editor',
    props:['content', 'placeholder', 'editorType', 'group','apiPath','isEditable'],
    methods: {
        clicked: function(){
            // console.log('clicked', this)
        },
        updateValue: function(newValue){
            console.log(newValue)
        },
    },
    data(){
        return {
            instance: null,
            defaults: {
                toolbarInline: true,
                charCounterCount: false,
                toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
                initOnClick: true,
                typingTimer: 1500,
                theme: 'knowbly',
            }
        }
    },
    watch : {
        content : function (value, old) {
            // console.log(value)
            if (_.isUndefined(value) || extractContent(value).trim() == "") {
                $(this.$el).find('div.fr-element.fr-view').html(' ');
                $(this.$el).find('div.fr-wrapper').addClass('show-placeholder');
            } else {
                $(this.$el).find('div.fr-element.fr-view').html(value)
                $(this.$el).find('div.fr-wrapper').removeClass('show-placeholder');
            }
        }
    },
    mounted: function(){
        $.FroalaEditor.DEFAULTS.key= "VZSZGUSXYSMZe1JGZ==";
        $.FroalaEditor.DefineIconTemplate('knowbly_design', '<svg><use xlink:href="#[NAME]"></use></svg>');
        $.FroalaEditor.ICON_DEFAULT_TEMPLATE = 'knowbly_design';

        let $el = $(this.$el);
        let self = this;

        let editorType = this.editorType || 'default'

        $.extend(this.defaults, opts[editorType],{
            placeholderText: this.placeholder || '',
        })

        // console.log(vnode.tag);
        // console.log('el',$el, $el.html());
        setTimeout(() => {
            $el.froalaEditor(this.defaults)
            // $el.froalaEditor()
            window.instance = $.FroalaEditor
            //this.$options.propsData.isEditable ?  $el.froalaEditor('edit.on') :  $el.froalaEditor('edit.off')
        }, 200);

        $el.on('froalaEditor.blur',
        (event, ui, el)=>{
            // console.log( this.$store)
            if(this.$options.propsData.apiPath && !_.isEmpty(this.$options.propsData.apiPath.mutation) && !_.isEmpty(this.$options.propsData.apiPath.action)){
                    this.$store.commit(this.$options.propsData.apiPath.mutation,{response:{name:$el.text()}});
                    this.$store.dispatch(this.$options.propsData.apiPath.action,{id: this.$store.state.widget.widget.id, name: $el.text()});
            }else{
                    return false
            }
    })

        this.group = this.group || 'global';

        $el.on('froalaEditor.contentChanged', function (e, editor) {
            // Do something here.
            // console.log('contentchanged',editor, self.group);
            // self.$emit('froalachanged', editor, this.group)

            if (!window.undoPressed && !window.redoPressed) {
                editorUndoOrder[self.group].splice(editorUndoCurrentPosition + 1, editorUndoOrder[self.group].length);
                window.editorUndoOrder[self.group].push(editor);
                window.editorUndoCurrentPosition = window.editorUndoOrder[self.group].length - 1;
                // console.log('contentchanged', editorUndoOrder[self.group].map(value => value['id']), window.editorUndoCurrentPosition);
                self.$emit('froalachanged', editor, this.group);
            }else {
                window.undoPressed = false;
                window.redoPressed = false
            }
            // self.$emit('changed', e, editor, $el.html())

        });

        $el.on('froalaEditor.focus', function (e, editor) {
            // Do something here.
            // console.log('focus')
            self.$emit('focus', e, editor)

        });
    }
}
// module.exports = froala
</script>
