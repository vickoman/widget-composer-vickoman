import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

export default {
    login (credentials) {
        return Vue.http.post(`${root}/my-user/login`, credentials)
            .then((response) => Promise.resolve(response))
    },
    logout () {
        return Vue.http.post(`${root}/my-user/logout`)
            .then((response) => Promise.resolve(response))
    },
    getUser (id) {
        return Vue.http.get(`${root}/my-user/${id}/data`)
            .then((response) => Promise.resolve(response.data))
    }
}