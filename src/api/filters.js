import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

const root = process.env.API_DATA_ROOT;

export default {
    //GET
    getFilters(clientId){
        return Vue.http.get(`${root}/client/${clientId}/filters`)
                .then((response)=>Promise.resolve(response.data))
    }

}