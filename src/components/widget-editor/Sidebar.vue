<template>
    <div class="sidebar">
        <ul>
            <li class="sidebar-btn btn-settings">
                <a @click="showPanel('btn-settings')">
                    <svg>
                        <use xlink:href="#settings"></use>
                    </svg>
                </a>
            </li>
            <li class="sidebar-btn btn-metadata">
                <a @click="showPanel('btn-metadata')">
                    <svg>
                        <use xlink:href="#metadata"></use>
                    </svg>
                </a>
            </li>
            <li class="sidebar-btn btn-accessibility">
                <a @click="showPanel('btn-accessibility')">
                    <svg>
                        <use xlink:href="#accessibility"></use>
                    </svg>
                </a>
            </li>
            <li class="sidebar-btn btn-comments">
                <a @click="showPanel('btn-comments'); isOpen = !isOpen; getComments(widget.widget.id) ">
                    <svg>
                        <use xlink:href="#comments"></use>
                    </svg>
                </a>
            </li>
        </ul>
        <ul>
            <li class="sidebar-btn btn-user-guide">
                <a @click="showPanel('btn-user-guide')">
                    <svg>
                        <use xlink:href="#help-info"></use>
                    </svg>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    import Functions from '../../store/modules/widget'

    export default {
        name: 'sidebar',
        props:['widget'],
        data (){
            return {
                isOpen : false,
                panelOpen: false,
            }
        },
        methods:{
            getComments : function(widgetId){
                if(this.isOpen)
                    this.$store.dispatch('getWidgetComments', widgetId)
            },
            showPanel : function(button){
                if(this.panelOpen){
                    if($("."+button).hasClass("u-selected")){
                        $(".sidebar-btn").removeClass("u-selected");
                        this.panelOpen = false;
                        $('.panel').removeClass('u-panel-open');
                    }else{
                        $(".sidebar-btn").removeClass("u-selected");
                        $("."+button).addClass("u-selected");
                        this.panelOpen = true;
                        this.selectPanel(button);
                    }
                }else{
                    $("."+button).addClass("u-selected");
                    this.panelOpen = true;
                    this.selectPanel(button);  
                }
            },
            selectPanel : function(button){
                $('.panel').addClass('u-panel-open');
                $(".panel-settings, .panel-metadata, .panel-accessibility, .panel-comments").addClass("u-hide");
                switch (button) {
                    case "btn-settings":
                        $(".panel-settings").removeClass("u-hide");
                        break; 
                    case "btn-metadata":
                        $(".panel-metadata").removeClass("u-hide");
                        break;
                    case "btn-accessibility":
                        $(".panel-accessibility").removeClass("u-hide");
                        break;
                    case "btn-comments":
                        $(".panel-comments").removeClass("u-hide");
                        break;
                    case "btn-user-guide":
                        $(".panel-help").removeClass("u-hide");
                        break;
                }
            },
        }
    };
</script>