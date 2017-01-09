import Vue from 'vue'
import VueResource from 'vue-resource'
import router from 'vue-router'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

// Vue.http.interceptors.push((request, next)  => {
//
//   // modify request
//   // request.method = 'POST';
//
//   // continue to next interceptor
//   next((response) => {
//     console.log('response intercepted', response)
//     // router().push('/')
//     if (response.status == 404 && response.body.error.code == "MODEL_NOT_FOUND"){
//         // location.href = "/not-found"
//     }
//     // router.push('/')
//
//     // modify response
//     // response.body = '...';
//
//   });
// });

export default {
    // GET
    getWidget(id) {
        return Vue.http.get(`${root}/widget/${id}?filter[include]=widgetType&filter[include]=metadata&filter[include]=metadata&filter[custom]=tag`)
            .then((response) => Promise.resolve(response.data))
    },
    getWidgetData (id){

        return Vue.http.get(`${root}/widget/${id}/data`)
            .then((response) => {
                return Promise.resolve(response.data)
            })
    },
    // POST
    createNewWidget(newWidget){
        return Vue.http.post(`${root}/widget/add`, newWidget)
            .then((response) => Promise.resolve(response.data))
    },
    // PUT
    setWidgetName (id, name) {
        return Vue.http.put(`${root}/widget/${id}/name`, {name: name})
            .then((response) => Promise.resolve(response.data))
    },
    setWidgetSettings (id, settings) {
        return Vue.http.put(`${root}/widget/${id}/settings`, {settings:settings})
            .then((response) => Promise.resolve(response.data))
    },
    setWidgetData (id, data){
        console.log('API data', data);
        return Vue.http.put(`${root}/widget/${id}/data`, data)
            .then((response) => Promise.resolve(response.data))
    }
}
