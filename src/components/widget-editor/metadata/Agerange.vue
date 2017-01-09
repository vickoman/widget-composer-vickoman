<template>
    <li class="kds-mb-16">
                        
        <div class="input-age-range">
            <label for="">{{label}}</label>
            <ul class="age-inputs">
                <li>
                    <div class="input-number">
                        <label for="">From:</label>
                        <input type="number" min="0" max="99" maxlength="2"
                            v-bind:id="agerangeFromId"
                            v-model:value="from"
                            v-on:keydown="limitInputs"
                            v-on:keyup="filterInputs"
                            v-on:change="agerangeChanged">
                    </div>
                </li>
                <li>
                    <div class="input-number">
                        <label for="">To:</label>
                        <input type="number" min="0" max="120" maxlength="3"
                            v-bind:id="agerangeToId"
                            v-model:value="to" 
                            v-on:keydown="limitInputs"
                            v-on:keyup="filterInputs"
                            v-on:change="agerangeChanged">
                    </div>
                </li>
            </ul>
        </div>
    </li>
    <!-- <div class="input-time-range">
      <label for="">{{label}}</label>
      <ul class="time-inputs">
        <li>
          <div class="input-number">
            <label for="">minutes:</label>
            <input type="number" min="0" max="9999" maxlength="4"
                v-bind:id="timerangeMinutesId"
                v-model="minutes"
                v-on:keydown="limitInputs"
                v-on:keyup="filterInputs"
                v-on:change="timerangeChanged">
          </div>
        </li>
        <li>
          <div class="input-number">
            <label for="">seconds:</label>
            <input type="number" min="0" max="60" maxlength="2"
                v-bind:id="timerangeSecondsId"
                v-model="seconds"
                v-on:keydown="limitInputs"
                v-on:keyup="filterInputs"
                v-on:change="timerangeChanged">
          </div>          
        </li>
      </ul>
    </div> -->
</template>

<script>
export default {
    name: 'agerange',
    data (){
        return {
            agerangeFromId: 'agerange-from-' + this.sectionId + '-' + this.itemId,
            agerangeToId: 'agerange-to-' + this.sectionId + '-' + this.itemId,
            from: this.fromValue,
            to: this.toValue
        }
    },
    props: ['label', 'fromValue', 'toValue', 'sectionId', 'itemId'],
    computed:{
        minutes: function(){
            return Math.floor(this.value / 60)
        },
        seconds: function(){
            return this.value - this.minutes * 60;
        }
    },
    methods: {
        limitInputs: function(event){
            if(event.target.id == this.agerangeFromId){
                if (this.inputFrom.val().length >= 1){
                    this.inputFrom.val(this.inputFrom.val().slice(0,1))
                }
            }else{
                if (this.inputTo.val().length >= 1){
                    this.inputTo.val(this.inputTo.val().slice(0,2))
                }
            }
        },
        filterInputs: function(event){

            return false

            var vm = this
            
            // Observe and delete not wanted letters:  [ E | e | . | = | + | - ]
            var keyCode = ('which' in event) ? event.which : event.keyCode;
            var isNotWanted = (keyCode == 69 || keyCode == 101 || keyCode == 190 || keyCode == 107 || keyCode == 187 || keyCode == 189);

            if(event.target.id == this.inputFrom){
                if(isNotWanted){
                    this.inputFrom.val(this.inputFrom.val().slice(this.inputFrom.val().length, 1))
                }                
            }else{
                if(isNotWanted){
                    this.inputTo.val(this.inputTo.val().slice(this.inputTo.val().length, 1))
                }
            }            
            
        },
        // SEND TO SAVE
        agerangeChanged: function (event) {   


            if(this.from == '' || this.from == 'undefined'){
                this.from = 0
            }
            if(this.to == '' || this.to == 'undefined'){
                this.to = 0
            }
            
            this.$emit('timerangeChanged', this.sectionId, this.itemId, this.from, this.to)
        }
    },
    mounted : function(){
        this.inputFrom = $('#' + this.agerangeFromId);
        this.inputTo = $('#' + this.agerangeToId);
    }  
}
</script>