import commentsDataSource from  '../../api/comments'
import moment from 'moment'

const state = {
    widgetId: null,
    widget: {}
}
const mutations = {
    SET_WIDGET_COMMENT (state, { response }) {
        state.widget.comment = response
    }
}
const actions = {
    setWidgetComment({commit}, widgetData) {
        let comment = {
            ownerId: parseInt(widgetData.ownerId),
            comment: widgetData.comment,
            dateCreated: moment().format('MM/DD/YYYY')
        };
        commentsDataSource.setWidgetComment(widgetData.id, comment).then(response => commit('SET_WIDGET_COMMENT', {response})
    )}
}
export default {
    state,
    actions,
    mutations
}