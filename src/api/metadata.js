import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

export default {
    setWidgetMetadata (id, metadata) {
        return Vue.http.put(`${root}/widget_metadata/${id}`, {content:metadata})
            .then((response) => Promise.resolve(response.data))
    }

}