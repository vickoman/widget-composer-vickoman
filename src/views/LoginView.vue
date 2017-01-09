<template>
    <div>
        <h2>Login</h2>
        <input type="text" placeholder="Enter a username" v-model="credentials.username" >
        <input type="password" placeholder="Enter a password" v-model="credentials.password">
        <button @click="submit()">Validate</button>
        <transition name="fade">
            <p v-if="status">{{ status }}</p>
        </transition>
    </div>
    <!-- <div class="login-container">
        <div class="logo">
            <svg>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#logo"></use>
            </svg>
        </div>
        <div class="input-text">
            <label class="u-hidden" v-bind:for="'loginEmail'">Email</label>
            <input id="loginEmail" class="txt-input" type="text" placeholder="Email" v-model="credentials.username" v-on:focusin="showLabel" v-on:focusout="hideLabel">
        </div>
        <div class="input-text">
            <label class="u-hidden" v-bind:for="'loginPassword'">Password</label>
            <input id="loginPassword" class="txt-input" type="password" placeholder="Password" v-model="credentials.password" v-on:focusin="showLabel" v-on:focusout="hideLabel">
        </div>
        <div class="sign--in--options">
            <div class="sign--in--options--keep">
                <input type="checkbox" name="keep-me-sign" id="keep-me-sign" :value="true"/>
                <label v-bind:for="'keep-me-sign'">Keep me sign in.</label>
            </div>
            <div class="sign--in--options--forgot">
                <a href="#">Forgot your password?</a>
            </div>
        </div>
        <button class="button-standard-green" @click="submit()">Sign in</button>
        <div class="links">
            <div class="">
                Sign in via LinkedIn or Google:
            </div>
            <div class="links--button">
                <div class="links--button--icon">
                    <a href="#">
                        <svg>
                            <use xlink:href="#text-button"></use>
                        </svg>
                    </a>
                </div>
                <div class="links--button--icon">
                    <a href="#">
                        <svg>
                            <use xlink:href="#text-button"></use>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        <transition name="fade">
            <p v-if="status">{{ status }}</p>
        </transition>
    </div> -->
</template>

<script>
    export default {
        name: 'loginView',
        data() {
            return {
                credentials: {
                    username: '',
                    password: ''
                }
            }
        },
        computed: {
            status() {
                return this.$store.state.auth.messages
            }
        },
        methods: {
            // showLabel: function(e){
            //     $(e.target).prev().removeClass('u-hidden')
            // },
            // hideLabel: function(e){
            //     $(e.target).prev().addClass('u-hidden')
            // },
            submit() {
                let credentials = {
                    username: this.credentials.username,
                    password: this.credentials.password
                }

                this.$store.dispatch('login', credentials)
            }
        }
    }
</script>

<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>
