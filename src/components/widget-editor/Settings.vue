<template>
    <div class="panel-settings">
        <div class="panel-content">
            <div class="panel-header">Widget Settings</div>
            
                <ul>
                    <template v-for="(setting, index) in settings">
                        <!-- Checkbox component -->
                        <template v-if="setting.type == 'checkbox'">
                            <checkbox 
                                :label="setting.label"
                                :defaultValue="setting.defaultValue"
                                :renderedId="index"
                                v-on:checkboxChanged="simpleSettingChanged">
                            </checkbox>
                        </template>                        

                        <!-- Radio multiple component -->
                        <template v-if="setting.type == 'radio'">
                            <radio 
                                :title="setting.title"
                                :labels="setting.values"
                                :defaultValue="setting.defaultValue"
                                :renderedId="index"
                                v-on:radioChanged="simpleSettingChanged">
                            </radio>                        
                        </template>

                    </template>
                </ul>

            <!--  <pre>
                {{ settings }}
            </pre> -->
        </div>
    </div>
</template>

   <!--  TODO: COMPONETIZE THESE SETTING TYPES:
    <li class="kds-mb-32">
        <div class="radio-buttons-response">
            <div class="radio-button-header">Response Type</div>
            <ul>
                <li>
                    <div class="radio-container">
                        <input type="radio" value="On" checked="" name=".v1m3s" id="427">
                        <label for="427">On</label>
                        <div class="input-number-container u-hidden">
                            <div class="input-number-max">
                                <label for="">Max attempts</label>
                                <input type="number" min="1" max="9" value="3" name=".v1m3s">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="radio-container">
                        <input type="radio" value="Off" name=".v1m3s" id="201">
                        <label for="201">Off</label>
                        <div class="input-number-container u-hidden">
                            <div class="input-number-max">
                                <label for="">Max attempts</label>
                                <input type="number" min="1" max="9" value="3" name=".v1m3s">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </li>
    <li class="kds-mb-32">
        <div class="input-number">
            <label for="">Width</label>
            <input type="number" min="-9999" max="9999" maxlength="4" value="249">
        </div>
    </li>
    -->

<script>

import Checkbox from './settings/Checkbox'
import Radio from './settings/Radio'

export default {
    name: 'settings',
    components: {
        Checkbox,
        Radio
    },
    computed: {
        settings() {                
            return this.$store.state.widget.widget.settings
        }
    },
    methods: {
        simpleSettingChanged: function (id, defaultValue) {

            var newSettings = JSON.parse(JSON.stringify(this.settings));
            
            newSettings[id].defaultValue = defaultValue;
            
            this.$store.dispatch('setWidgetSettings', newSettings);
        },
    }
}
</script>
