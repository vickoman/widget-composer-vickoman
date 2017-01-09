import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const root = process.env.API_DATA_ROOT

export default {
    // SET
    setWidgetComment(id, comment) {
        return Vue.http.post(`${root}/widget/${id}/comments`, comment)
                .then((response) => Promise.resolve(response.data))
    },
    setWidgetComment(id, comment) {
        return Vue.http.post(`${root}/widget/${id}/comment`, comment)
                .then((response) => Promise.resolve(response.data))
    },
    setReply(commentId, reply){
        return Vue.http.post(`${root}/comment/${commentId}/comment`,reply)
            .then((response) => Promise.resolve(response.data))
    },
    // GET
    getWidgetComments(id) {
        return Vue.http.get(`${root}/widget/${id}/comment?filter[include]=comment`)
                .then((response) => Promise.resolve(response.data))
    },
    getWidgetUsers() {
        return Vue.http.get(`${root}/my-user/usernames`)
            .then((response) => Promise.resolve(response.data));
    },
    // PUT
    updateComment(widgetId,commentId,comment){
        return Vue.http.put(`${root}/widget/${widgetId}/comment/${commentId}`, comment)
                .then((response) => Promise.resolve(response.data))
    },
    updateReply(commentId, reply){
      return Vue.http.put(`${root}/comment/${commentId}/comment/${reply.id}`,reply)
          .then((response) => Promise.resolve(response.data))
    },
    // DELETE
    deleteComment(comment){
        return Vue.http.delete(`${root}/widget/${comment.widgetId}/comment/${comment.id}`)
            .then((response) => Promise.resolve(response.data))
    },
    deleteReply(commentId,replyId){
        return Vue.http.delete(`${root}/comment/${commentId}/comment/${replyId}`)
                .then((response) => Promise.resolve(response.data))
    }
}