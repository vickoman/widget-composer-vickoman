import Vue from 'vue'
import VueCookie from 'vue-cookie'
import authDataSource from '../../api/auth'
import router from '../../router'

Vue.use(VueCookie)

const state = {
    authenticated: false,
    user: null,
    messages: ''
}

const mutations = {
    AUTH_SUCCESS (state, response) {
        VueCookie.set('know_auth', response.data.id, { expires: '1209600s' })
        VueCookie.set('know_user', response.data.userId, { expires: '1209600s' })

        Vue.http.headers.common['Authorization'] = response.data.id  

        state.authenticated = true

        router.push({ path: '/' })
    },
    AUTH_FAIL (state, response) {
        state.messages = response
    },
    AUTH_LOGOUT (state, response) {
        state.authenticated = false
        state.user = null
        state.messages = ''

        VueCookie.delete('know_auth')
        VueCookie.delete('know_user')

        router.push({ path: '/login' })
    },
    AUTH_ENABLED (state, status) {
        state.authenticated = status
        
        if (status == false) {
            state.messages = ''
        }
    },
    SET_USER (state, { response }) {
        state.user = response.user
    }
}

const actions = {
    login ({ dispatch, commit }, payload) {
        authDataSource.login(payload)
            .then((response) => {
                let userId = response.data.userId

                commit('AUTH_SUCCESS', response)
                dispatch('getUser', userId)
            }, (error) => {
                if (error.status == 401) {
                    commit('AUTH_FAIL', error.data.error.message)    
                }
            })
    },
    logout ({ commit }) {
        if (VueCookie.get('know_auth')) {
            authDataSource.logout({sid: VueCookie.get('know_auth')})
                .then((response) => {
                    commit('AUTH_LOGOUT', response)
                })
        }
        
    },
    getUser ({ commit }, id) {
        authDataSource.getUser(id).then(response => commit('SET_USER', { response }))
    },
    isAuthenticated ({ dispatch, commit }) {
        let id = VueCookie.get('know_user')
        
        if ( !VueCookie.get('know_auth') ) {
            commit('AUTH_LOGOUT', false)

            return false
        }

        Vue.http.headers.common['Authorization'] = VueCookie.get('know_auth') 
        
        return authDataSource.getUser(id).then(response => {
            commit('SET_USER', { response })
            commit('AUTH_ENABLED', true)   

            return true
        }, (err) => {
            
            return false
        })
    }
}

const getters = {
    userRoles: state => {
        return state.user.roles
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}