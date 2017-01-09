import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

export default {
    // PUT
    addMediaToDB (file) {
        return Vue.http.post(`${root}/media/add`, {media: file})
    },
    deleteMedia(media) {
        return Vue.http.post(`${root}/media/delete`, media)
    }
}
