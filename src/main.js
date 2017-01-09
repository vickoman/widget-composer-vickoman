import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import VueResource from 'vue-resource'
import VueProgressBar from 'vue-progressbar' 
import VueResourceProgressBarInterceptor from 'vue-resource-progressbar-interceptor'
import * as _ from 'lodash'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'

Vue.use(VueResource);
Vue.use(VueProgressBar);
Vue.use(VueResourceProgressBarInterceptor);

require("!style!css?sourceMap!sass?sourceMap!./sass/main.scss")

// Authentication
router.beforeEach((to, from, next) => {
    if (!to.meta.requiresAuth) {
        next()
    } else {
        store.dispatch('isAuthenticated')
            .then((isAuth) => {
                if (isAuth) {
                    let userRoles = store.getters.userRoles
                    let routeRoles = to.meta.roles
                    let isEnabled = _.intersection(userRoles, routeRoles).length

                    if (isEnabled) {
                         // This logout action must be called from a view
                        if (to.path == '/logout') {
                            store.dispatch('logout')
                        } else {
                            next()
                        }
                    }
                } else {
                    next({ path: '/login', query: { redirect: to.fullPath }})
                }
            })
    }
})

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.


/* eslint-disable no-new */
var bus = new Vue({});

Object.defineProperty(Vue.prototype, '$bus', {
    get(){
        return this.$root.bus;
    }
}); 

const app = new Vue({
    router,
    store,
    el: '#app',
    template: '<App/>',
    components: { 
        App
    },
    data: {
    	bus: bus,
    }
})

// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
export { app, router, store }