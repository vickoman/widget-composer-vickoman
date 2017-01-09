import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

export default {
    getTemplateTypes () {
        return Vue.http.get(`${root}/widget_type`)
            .then((response) => Promise.resolve(response.data))
    }  
}