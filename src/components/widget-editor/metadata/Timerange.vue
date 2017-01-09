<template>
    <div class="input-time-range">
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
    </div>
</template>

<script>
export default {
    name: 'timerange',
    data (){
        return {
            timerangeMinutesId: 'timerange-minutes-' + this.sectionId + '-' + this.itemId,
            timerangeSecondsId: 'timerange-seconds-' + this.sectionId + '-' + this.itemId,
            minutes : 0,
            seconds: 0,
        }
    },
    props: ['label', 'value', 'sectionId', 'itemId'],
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
            if(event.target.id == this.timerangeMinutesId){
                if (this.inputMinutes.val().length >= 3){
                    this.inputMinutes.val(this.inputMinutes.val().slice(0,3))
                }
            }else{
                if (this.inputSeconds.val().length >= 1){
                    this.inputSeconds.val(this.inputSeconds.val().slice(0,1))
                    this.seconds = this.inputSeconds.val().slice(0,1)
                }
            }
        },
        filterInputs: function(event){

            var vm = this
            
            // Observe and delete not wanted letters:  [ E | e | . | = | + | - ]
            var keyCode = ('which' in event) ? event.which : event.keyCode;
            var isNotWanted = (keyCode == 69 || keyCode == 101 || keyCode == 190 || keyCode == 107 || keyCode == 187 || keyCode == 189);

            if(event.target.id == this.timerangeMinutesId){
                if(isNotWanted){
                    this.inputMinutes.val(this.inputMinutes.val().slice(this.inputMinutes.val().length, 1))
                }
            }else{
                if(isNotWanted){
                    this.inputSeconds.val(this.inputSeconds.val().slice(this.inputSeconds.val().length, 1))
                }

            }
            
            this.manageInputs()
            
            
        },
        manageInputs: function () {
            if(this.inputSeconds.val() >= 60){
                this.inputMinutes.val(parseInt(this.inputMinutes.val()) + 1)
                this.inputSeconds.val(parseInt(this.inputSeconds.val()) - 60)
            }
        },
        showLabel: function(){
            this.input.prev().removeClass('u-hidden')
        },
        hideLabel: function(){
            this.input.prev().addClass('u-hidden')
        },
        // SEND TO SAVE
        timerangeChanged: function (event) {         
            
            var minutesInSeconds =  this.inputMinutes.val() * 60
            var seconds =  this.inputSeconds.val()
            var totalTime = parseInt(minutesInSeconds) + parseInt(seconds)            
            
            this.$emit('timerangeChanged', this.sectionId, this.itemId, totalTime)
        }
    },
    mounted : function(){
        this.inputMinutes = $('#' + this.timerangeMinutesId);
        this.inputSeconds = $('#' + this.timerangeSecondsId);

        document.querySelector('.input-number').querySelector('input').oninput = function() {
          if (this.value.length > 4) {
            return this.value = this.value.slice(0, 4);
          }
        },
        document.querySelector('.input-number').querySelector('input').oninput = function() {
          if (this.value.length > 4) {
            return this.value = this.value.slice(0, 4);
          }
        }
    }  
}
</script>