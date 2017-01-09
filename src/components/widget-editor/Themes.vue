<template>
    <div class="panel-content">
        <div class="panel-header">{{panelTitle}}</div>
        <div class="modern-container">
            <div class="dropdown dropdown-input">
                <div class="dropdown-button">
                    <div class="input-text">
                        <label class="u-hidden" for="txt-input">Language</label>
                        <input type="text" name="" class="txt-input" placeholder="Language" value=""/>
                    </div>
                    <div class="icon-arrow">
                        <svg>
                            <use xlink:href="#arrow-down"></use>
                        </svg>
                    </div>
                </div>
                <ul class="dropdown-content u-hide">
                    <li>Dropdown Item</li>
                    <li>Dropdown Item</li>
                    <li>Dropdown Item</li>
                </ul>
            </div>
        </div>
        <div class="academic-container">
            <div class="dropdown dropdown-input">
                <div class="dropdown-button">
                    <div class="input-text">
                        <label class="u-hidden" for="txt-input">Language</label>
                        <input type="text" name="" class="txt-input" placeholder="Language" value=""/>
                    </div>
                    <div class="icon-arrow">
                        <svg>
                            <use xlink:href="#arrow-down"></use>
                        </svg>
                    </div>
                </div>
                <ul class="dropdown-content u-hide">
                    <li>Dropdown Item</li>
                    <li>Dropdown Item</li>
                    <li>Dropdown Item</li>
                </ul>
            </div>
        </div>
        <div class="playful-container">
            <div class="dropdown dropdown-input">
                <div class="dropdown-button">
                    <div class="input-text">
                        <label class="u-hidden" for="txt-input">Language</label>
                        <input type="text" name="" class="txt-input" placeholder="Language" value=""/>
                    </div>
                    <div class="icon-arrow">
                        <svg>
                            <use xlink:href="#arrow-down"></use>
                        </svg>
                    </div>
                </div>
                <ul class="dropdown-content u-hide">
                    <li>Dropdown Item</li>
                    <li>Dropdown Item</li>
                    <li>Dropdown Item</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'themes',
        data () {
            return {
                panelTitle: 'Themes'
            }
        }
    }
</script>