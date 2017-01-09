import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

export default {
    // GET
    getContainers () {
        return Vue.http.get(`${root}/containers/`)
            .then((response) => Promise.resolve(response.data))
    },
    getContainerFiles (container) {
        return Vue.http.get(`${root}/containers/${container}/files`)
            .then((response) => Promise.resolve(response.data))
    },
    addMediaToStorage (container, form) {
        return Vue.http.post(`${root}/containers/${container}/upload`,form)
            .then((response) => Promise.resolve(response.data))
    },
}
