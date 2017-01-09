<template>
    <li class="kds-mb-16">
        <div class="dropdown-input">
            <div class="dropdown-input__button">
                <div class="dropdown-input__input">
                    <label class="u-hidden" for="txt-input">{{label}}</label>
                    <input type="text" class="txt-input"
                        v-bind:id="languageinputId"
                        v-model:value="languageinputValue"
                        v-bind:placeholder="label"
                        v-on:change="languageinputChanged"
                        v-on:keyup="filterLanguages"
                        v-on:focusin="showLabel"
                        v-on:focusout="hideLabel">
                </div>
                <svg class="dropdown-input__arrow" v-on:click="toggleSelector">
                    <use xlink:href="#arrow-down"></use>
                </svg>
            </div>
            <ul class="dropdown-input__content u-hide" v-show="filteredLanguages">
                <template v-for="language in filteredLanguages">
                    <li v-on:click="languageSelected">{{language.lang}}</li>
                </template>
            </ul>
        </div>
    </li>

</template>

<script>
export default {
    name: 'languagedropdown',
    data (){
        return {
            languageinputId: 'language-dropdown-' + this.sectionId + '-' + this.itemId,
            languageinputValue: this.value,
            filteredLanguages: '',
            emptySearchMessage: 'Enter a valid language'
        }
    },
    props: ['label', 'value', 'sectionId', 'itemId'],
    methods: {
        languageSelected: function (event) {
            this.hideSelector();
            if(event.target.innerText == this.emptySearchMessage){
                return false
            }
            this.input.val(event.target.innerText);
            this.languageinputChanged();
            
        },
        filterLanguages: function(){
        
            var vm = this
            this.showSelector();

            // Filter Languages
            var filtered =  _.filter(languages, function(language) {
                return language.lang.toLowerCase().indexOf(vm.input.val().toLowerCase()) >= 0;
            });

            //conditional display
            if (_.isEmpty(filtered)){
                var emptyMessage = [{lang: vm.emptySearchMessage}]
                vm.filteredLanguages = emptyMessage
            }else{
                vm.filteredLanguages = filtered
            }            
            
        },
        showSelector: function(){
            $('.dropdown-input__content').removeClass('u-hide');            
        },
        hideSelector: function(){
            $('.dropdown-input__content').addClass('u-hide');
        },
        toggleSelector: function(){
            $('.dropdown-input__content').toggleClass('u-hide');
            this.filteredLanguages = languages
        },
        showLabel: function(){
            this.input.prev().removeClass('u-hidden')
        },
        hideLabel: function(){
            this.input.prev().addClass('u-hidden')
        },
        // SEND TO SAVE
        languageinputChanged: function () {            
            var newValue = this.input.val();            
            this.$emit('languageinputChanged', this.sectionId, this.itemId, newValue)
        }
    },
    mounted : function(){
        this.input = $('#' + this.languageinputId);
    }  
}

var languages = [
    {langKey: "AA", lang: "AFAR"},
    {langKey: "AB", lang: "ABKHAZIAN"},
    {langKey: "AF", lang: "AFRIKAANS"},
    {langKey: "AM", lang: "AMHARIC"},
    {langKey: "AR", lang: "ARABIC"},
    {langKey: "AS", lang: "ASSAMESE "},
    {langKey: "AY", lang: "AYMARA"},
    {langKey: "AZ", lang: "AZERBAIJANI "},
    {langKey: "BA", lang: "BASHKIR"},
    {langKey: "BE", lang: "BYELORUSSIAN"},
    {langKey: "BG", lang: "BULGARIAN"},
    {langKey: "BH", lang: "BIHARI"},
    {langKey: "BI", lang: "BISLAMA"},
    {langKey: "BN", lang: "BENGALI;BANGLA "},
    {langKey: "BO", lang: "TIBETAN"},
    {langKey: "BR", lang: "BRETON"},
    {langKey: "CA", lang: "CATALAN"},
    {langKey: "CO", lang: "CORSICAN "},
    {langKey: "CS", lang: "CZECH "},
    {langKey: "CY", lang: "WELSH "},
    {langKey: "DA", lang: "DANISH"},
    {langKey: "DE", lang: "GERMAN"},
    {langKey: "DZ", lang: "BHUTANI"},
    {langKey: "EL", lang: "GREEK "},
    {langKey: "EN", lang: "ENGLISH"},
    {langKey: "EO", lang: "ESPERANTO"},
    {langKey: "ES", lang: "SPANISH"},
    {langKey: "ET", lang: "ESTONIAN "},
    {langKey: "EU", lang: "BASQUE"},
    {langKey: "FA", lang: "PERSIAN (farsi)"},
    {langKey: "FI", lang: "FINNISH"},
    {langKey: "FJ", lang: "FIJI"},
    {langKey: "FO", lang: "FAROESE"},
    {langKey: "FR", lang: "FRENCH"},
    {langKey: "FY", lang: "FRISIAN"},
    {langKey: "GA", lang: "IRISH "},
    {langKey: "GD", lang: "SCOTS GAELIC"},
    {langKey: "GL", lang: "GALICIAN "},
    {langKey: "GN", lang: "GUARANI"},
    {langKey: "GU", lang: "GUJARATI "},
    {langKey: "HA", lang: "HAUSA "},
    {langKey: "HE", lang: "HEBREW"},
    {langKey: "HI", lang: "HINDI "},
    {langKey: "HR", lang: "CROATIAN "},
    {langKey: "HU", lang: "HUNGARIAN"},
    {langKey: "HY", lang: "ARMENIAN "},
    {langKey: "IA", lang: "INTERLINGUA "},
    {langKey: "IE", lang: "INTERLINGUE "},
    {langKey: "IK", lang: "INUPIAK"},
    {langKey: "ID", lang: "INDONESIAN"},
    {langKey: "IS", lang: "ICELANDIC"},
    {langKey: "IT", lang: "ITALIAN"},
    {langKey: "IU", lang: "INUKTITUT"},
    {langKey: "JA", lang: "JAPANESE "},
    {langKey: "JV", lang: "JAVANESE "},
    {langKey: "KA", lang: "GEORGIAN "},
    {langKey: "KK", lang: "KAZAKH"},
    {langKey: "KL", lang: "GREENLANDIC "},
    {langKey: "KM", lang: "CAMBODIAN"},
    {langKey: "KN", lang: "KANNADA"},
    {langKey: "KO", lang: "KOREAN"},
    {langKey: "KS", lang: "KASHMIRI "},
    {langKey: "KU", lang: "KURDISH"},
    {langKey: "KY", lang: "KIRGHIZ"},
    {langKey: "LA", lang: "LATIN "},
    {langKey: "LN", lang: "LINGALA"},
    {langKey: "LO", lang: "LAOTHIAN "},
    {langKey: "LT", lang: "LITHUANIAN"},
    {langKey: "LV", lang: "LATVIAN;LETTISH"},
    {langKey: "MG", lang: "MALAGASY "},
    {langKey: "MI", lang: "MAORI "},
    {langKey: "MK", lang: "MACEDONIAN"},
    {langKey: "ML", lang: "MALAYALAM"},
    {langKey: "MN", lang: "MONGOLIAN"},
    {langKey: "MO", lang: "MOLDAVIAN"},
    {langKey: "MR", lang: "MARATHI"},
    {langKey: "MS", lang: "MALAY "},
    {langKey: "MT", lang: "MALTESE"},
    {langKey: "MY", lang: "BURMESE"},
    {langKey: "NA", lang: "NAURU "},
    {langKey: "NE", lang: "NEPALI"},
    {langKey: "NL", lang: "DUTCH "},
    {langKey: "NO", lang: "NORWEGIAN"},
    {langKey: "OC", lang: "OCCITAN"},
    {langKey: "OM", lang: "AFAN (OROMO)"},
    {langKey: "OR", lang: "ORIYA "},
    {langKey: "PA", lang: "PUNJABI"},
    {langKey: "PL", lang: "POLISH"},
    {langKey: "PS", lang: "PASHTO;PUSHTO"},
    {langKey: "PT", lang: "PORTUGUESE"},
    {langKey: "QU", lang: "QUECHUA"},
    {langKey: "RM", lang: "RHAETO-ROMANCE "},
    {langKey: "RN", lang: "KURUNDI"},
    {langKey: "RO", lang: "ROMANIAN "},
    {langKey: "RU", lang: "RUSSIAN"},
    {langKey: "RW", lang: "KINYARWANDA "},
    {langKey: "SA", lang: "SANSKRIT "},
    {langKey: "SD", lang: "SINDHI"},
    {langKey: "SG", lang: "SANGHO"},
    {langKey: "SH", lang: "SERBO-CROATIAN "},
    {langKey: "SI", lang: "SINGHALESE"},
    {langKey: "SK", lang: "SLOVAK"},
    {langKey: "SL", lang: "SLOVENIAN"},
    {langKey: "SM", lang: "SAMOAN"},
    {langKey: "SN", lang: "SHONA "},
    {langKey: "SO", lang: "SOMALI"},
    {langKey: "SQ", lang: "ALBANIAN "},
    {langKey: "SR", lang: "SERBIAN"},
    {langKey: "SS", lang: "SISWATI"},
    {langKey: "ST", lang: "SESOTHO"},
    {langKey: "SU", lang: "SUNDANESE"},
    {langKey: "SV", lang: "SWEDISH"},
    {langKey: "SW", lang: "SWAHILI"},
    {langKey: "TA", lang: "TAMIL "},
    {langKey: "TE", lang: "TELUGU"},
    {langKey: "TG", lang: "TAJIK "},
    {langKey: "TH", lang: "THAI"},
    {langKey: "TI", lang: "TIGRINYA "},
    {langKey: "TK", lang: "TURKMEN"},
    {langKey: "TL", lang: "TAGALOG"},
    {langKey: "TN", lang: "SETSWANA "},
    {langKey: "TO", lang: "TONGA "},
    {langKey: "TR", lang: "TURKISH"},
    {langKey: "TS", lang: "TSONGA"},
    {langKey: "TT", lang: "TATAR "},
    {langKey: "TW", lang: "TWI"},
    {langKey: "UG", lang: "UIGUR "},
    {langKey: "UK", lang: "UKRAINIAN"},
    {langKey: "UR", lang: "URDU"},
    {langKey: "UZ", lang: "UZBEK "},
    {langKey: "VI", lang: "VIETNAMESE"},
    {langKey: "VO", lang: "VOLAPUK"},
    {langKey: "WO", lang: "WOLOF "},
    {langKey: "XH", lang: "XHOSA "},
    {langKey: "YI", lang: "YIDDISH"},
    {langKey: "YO", lang: "YORUBA"},
    {langKey: "ZA", lang: "ZHUANG"},
    {langKey: "ZH", lang: "CHINESE"},
    {langKey: "ZU", lang: "ZULU"}
];
</script>