<template>
  <div id="panelsettings">
    <settings></settings>
  </div>
</template>

<script>
import Settings from './components/Settings'



var settings = [
  // Radio buttons
    {
        "type"   : "radio",
        "values" : [
            {
                "value" : "on",
                "label" : "On"
            },
            {
                "value" : "off",
                "label" : "Off"
            }
        ],
        "defaultValue" : "on"
    },

    // Radio buttons with inline dropdown combo
    {
        "type"   : "radio-combo",
        "values" : [
            {
                "value"  : "immediate",
                "label"  : "Immediate",
                "inline" : "Object for another component"
            },
            {
                "value" : "delayed",
                "label" : "Delayed"
            }
        ],
        "defaultValue" : "immediate"
    },

    // Dropdown
    {
        "type"   : "dropdown",
        "label"  : "Max attempts",
        "values" : [
            {
                "value" : "1",
                "label" : "1"
            },
            {
                "value" : "2",
                "label" : "2"
            },
            {
                "value" : "3",
                "label" : "3"
            }
        ],
        "defaultValue" : "3"
    },

    // Checkbox
    {
        "type"         : "checkbox",
        "label"        : "Include \"Show Answer\" button",
        "defaultValue" : "true"
    },

    // Input text
    {
        "type"         : "input",
        "label"        : "Completion Message",
        "placeholder"  : "Your message",
        "maxLength"    : "100",
        "defaultValue" : "Good job!"
    },

    // Input number
    {
        "type"         : "input-number",
        "label"        : "Width",
        "placeholder"  : "Your message",
        "maxValue"     : "768",
        "minValue"     : "100",
        "defaultValue" : "500"
    },

    // Background image
    {
        "type"   : "bg-image",
        "action" : "modal-upload-image",
        "path"   : ""
    },

    // Button
    {
        "type"   : "button",
        "label"  : "Batch Upload",
        "action" : "modal-upload-batch"
    }
];


export default {
  name: 'panelsettings',
  components: {
    Settings
  },
  data: settings
}
</script>

<style></style>