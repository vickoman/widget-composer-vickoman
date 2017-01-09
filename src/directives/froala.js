
// import $ from 'jquery'
// import 'froala-editor/js/froala_editor.js'
// import 'froala'
// import "froala-editor/css/froala_style.min.css"

const opts = {
    widget: {
        toolbarInline: true,
        charCounterCount: true,
        toolbarButtons:   ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtonsSM:   ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink']
    },
    default: {
        toolbarInline: true,
        charCounterCount: true,
        toolbarButtonsSM:   ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
        toolbarButtons:   ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink']
    },
    headerFooter: {
        toolbarButtons: ['bold', 'italic', 'underline', '|', 'insertLink', '|', 'undo', 'redo', 'clearFormatting', '|', 'html'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', '|', 'insertLink', '|', 'undo', 'redo', 'clearFormatting', '|', 'html'],
        height: 200
    }
}
    

var froala = {
    // params: ['upload-path', 'type'],
    // twoWay: true,
    bind: function(el, binding, vnode) {
        $.FroalaEditor.DEFAULTS.key= "VZSZGUSXYSMZe1JGZ==";
        var $el = $(el);
        var self = this;
        console.log('this',this)
        /*$el.on('froalaEditor.initialized',  (e, editor) => this.vm.$editor = editor );
        $el.on('froalaEditor.focus',        (e, editor) => editor.$box.addClass('focus') );
        $el.on('froalaEditor.blur',         (e, editor) => editor.$box.removeClass('focus') );
        $el.on('froalaEditor.image.error',  (e, editor, error) => alert(error.message) );*/

        let defaults = {
            toolbarInline: true,
            charCounterCount: true,
            toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'color', 'align','-', 'formatUL', 'formatOL', 'indent', 'outdent', 'insertImage', 'insertLink'],
            initOnClick: true,
            typingTimer: 999,
        }
        let options = {};

        if (binding.value.model){
            $el.html(binding.value.model)
        }

        let editorType = binding.value.type || 'default'
        
        $.extend(options, defaults, opts[editorType],{
            placeholderText: binding.value.placeholder || ''
            // fileUploadURL: binding.value.uploadPath || '',
            // imageUploadURL: binding.value.uploadPath || ''
        })

        console.log('binding', binding)
        console.log('options', options)


        // console.log(vnode.tag);
        // console.log('el',$el, $el.html());
        setTimeout(() => { 
            $el.froalaEditor(options) 
                //  $('body').on('blur', $('#froala'), function(el, el2){
                //  console.log('blur', el, this)
            	//  // binding.value.model = $el.html()
            // })
        }, 200);

        
        $el.on('froalaEditor.blur', 
        function(event, ui, el){
            console.log('blur froala', self)
            this.$emit('blur', event, ui, $el)
        })

    },
    unbind: function () {
        // don't forget to teardown listeners and stuff.
        $(this.el).off().froalaEditor('destroy')
    },
    update: (el, binding, vnode) => {
        console.log('update', el, binding, vnode)
        $(el).html(binding.value.model)
    }
}

module.exports = froala

   
