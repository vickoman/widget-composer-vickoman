import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const thumbRoot = process.env.THUMBNAIL_ROOT

export default {
    setWidgetThumbnail(id, container) {
        return Vue.http.get(`${thumbRoot}/thumb/${id}/${container}`)
                .then((response) => Promise.resolve(response.data))
                .catch((err)=>{
                    console.warn(err,'is the thumbnail service down?')
                })
    }
}
