import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

const root = process.env.API_DATA_ROOT;

export default {
    //POST
    setFavorite(data){
        return Vue.http.post(`${root}/favorite/mark-asset/`,data)
                .then((response)=>Promise.resolve(response.data))
    }

}