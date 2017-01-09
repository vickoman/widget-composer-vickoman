import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

export default {
    //POST
    createTag(data){
        return Vue.http.post(`${root}/tag/tag-assets/`,data)
            .then((response)=>Promise.resolve(response.data))
    },
    //GET
    searchTag(query){
        return Vue.http.get(`${root}/tag/tag-assets`,{params:{query:query}})
            .then((response)=>Promise.resolve(response.data))
    },
    //DELETE
    deleteTag(id){
        return Vue.http.delete(`${root}/connection/${id}`)
            .then((response)=>Promise.resolve(response))
    }
}