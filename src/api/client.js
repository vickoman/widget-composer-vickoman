import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

export default {
    // GET
    getClientItems (id,params) {
        //if(params.skip!==params.skip)
    	return Vue.http.get(`${root}/client/${id}/assets/${params.limit}/${params.skip}`,{
                before(request) {
                    // abort previous request, if exists
                    if (Vue.previousRequest) {
                        Vue.previousRequest.abort();
                    }
                    // set previous request on Vue instance
                    Vue.previousRequest = request;
                }
            })
            .then((response) =>  Promise.resolve(response.data));
    },
    getClientMedia (id) {
        return Vue.http.get(`${root}/client/${id}/media`)
            .then((response) => Promise.resolve(response.data));
    }
}
