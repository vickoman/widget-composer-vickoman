import widgetDataSource from  '../../api/widget'
import tagDataSource from  '../../api/tags'
import commentDataSource from '../../api/comments'
import metadataDataSource from '../../api/metadata'
import servicesDataSource from  '../../api/services'
import moment from 'moment'
import _ from 'lodash'
import Vue from 'vue'


const state = {
    widgetId: null,
    widget: {},
    newWidget: {},
    widgetTitle: ''
}

const mutations = {
    SET_WIDGET_ID (state, { id }) {
        state.widgetId = id
    },

    SET_WIDGET_NAME (state, { response }) {
        state.widget.name = response.name
    },

    FETCH_WIDGET (state, { widget }) {
        Vue.set(state, 'widget' ,widget)
    },

    FETCH_WIDGET_COMMENTS (state, {response}){
        Vue.set(state.widget,'comments',response)
    },

    FETCH_WIDGET_USERS (state, {response}){
        Vue.set(state.widget,'users',response)
    },

    REMOVE_WIDGET_COMMENT (state, {response}){
        return ({response})
    },

    SET_WIDGET_COMMENT (state, { response }) {
        Vue.set(state.widget,'comments',response)
    },

    CREATE_NEW_WIDGET(state, {response}){
        state.newWidget = response
    },

    UPDATE_WIDGET_COMMENT (state,{comment}){
        return ({comment})
    },
    UPDATE_WIDGET_TAGS (state,{tag}){
        state.widget.tags.push(tag)
    },
    UPDATE_CREATED_WIDGET_TAGS(state,{item}){
        state.widget.tags.push(item)
    },
    REMOVE_WIDGET_TAGS(state,{item}){
        state.widget.tags = _.remove(state.widget.tags ,function(tag){
            return tag.id != item.id || tag.name != item.name;
        })
    },
    SET_REPLY_COMMENT (state,{reply}){
        if(!_.has(state.widget,'comments'))
            Vue.set(state.widget.comments,'comment',reply)
    },

    UPDATE_REPLY_COMMENT (state,{reply}){
        //state.widget.comments.comment = reply
    },

    DELETE_REPLY_COMMENT (state,{reply}){
        //state.widget.comments.comment = reply
    },

    SET_WIDGET_SETTINGS (state, { response }) {
        state.widget.settings = response.settings
    },

    SET_WIDGET_METADATA (state, { response }) {
        state.widget.metadata.content = response.content;
    },

    SET_WIDGET_DATA (state, { response }) {
        state.widget.data = response.data
    }
}

const actions = {
    getWidget ({commit}, widgetId) {
        widgetDataSource.getWidget(widgetId)
        .then(widget => commit('FETCH_WIDGET', { widget }))
        .catch((response)=>{
            console.log('thisa', Vue.router, state)
            if (response.status == 404 && response.body.error.code == "MODEL_NOT_FOUND"){
              location.href = "/not-found"
            }
        })
    },

    createNewWidget({commit}, newWidget) {
        return widgetDataSource.createNewWidget(newWidget).then(response => commit('CREATE_NEW_WIDGET', {response})
    )},

    setWidgetName({commit}, widgetData) {
        widgetDataSource.setWidgetName(widgetData.id, widgetData.name).then(response => commit('SET_WIDGET_NAME', { response }))
    },
    getWidgetComments ({commit},widgetId){
        commentDataSource.getWidgetComments(widgetId).then(response => commit('FETCH_WIDGET_COMMENTS', { response }))
    },
    getWidgetUsers ({commit}){
        commentDataSource.getWidgetUsers().then(response => commit('FETCH_WIDGET_USERS', { response }))
    },

    setWidgetComment({commit}, widgetData) {
        let comment = {
            ownerId: parseInt(widgetData.ownerId),
            content: widgetData.content,
            dateCreated: moment(),
            name : widgetData.name
        };
        return commentDataSource.setWidgetComment(widgetData.id, comment).then(response => commit('SET_WIDGET_COMMENT', {response})
    )}
    ,
    setWidgetSettings({commit}, settings) {
        widgetDataSource.setWidgetSettings(state.widget.id, settings)
        .then(response => commit('SET_WIDGET_SETTINGS', { response }))
    },
    setWidgetMetadata({commit}, metadata) {
        console.log('widget setWidgetMetadata');
        metadataDataSource.setWidgetMetadata(state.widget.id, metadata)
        .then(response => commit('SET_WIDGET_METADATA', { response }))
    },

    removeWidgetComment({commit}, widgetData){
        commentDataSource.deleteComment(widgetData).then(response => commit('REMOVE_WIDGET_COMMENT',{response}))
    },

    updateWidgetComment({commit},comment,newComment){
        let updateComment = {
            ownerId: comment.ownerId,
            content: newComment,
            dateCreated: comment.dateCreated,
            dateUpdated: moment(),
            name : comment.name
        };
        commentDataSource.updateComment(comment.widgetId,comment.id, updateComment).then(response => commit('UPDATE_WIDGET_COMMENT',{response}))
    },

    setReply({commit},replyData){
        let reply = {
            name : replyData.name,
            ownerId : replyData.ownerId,
            content : replyData.content,
            dateCreated : moment()
        };
        commentDataSource.setReply(replyData.parent,reply).then(response => commit('SET_REPLY_COMMENT',{response}))
    },

    updateReply({commit},commentId,reply,newComment){
        var updatedReply = {
            ownerId : reply.ownerId,
            dateCreated : reply.dateCreated,
            dateUpdated : reply.dateUpdate,
            name : reply.name,
            content : newComment,
            id: reply.id,
            commentId : reply.commentId
        };
        commentDataSource.updateReply(commentId,updatedReply).then(response => commit('UPDATE_REPLY_COMMENT',{response}))
    },

    removeReply({commit},commentId,reply){
        commentDataSource.deleteReply(commentId,reply.id).then(response => commit('DELETE_REPLY_COMMENT',{response}))
    },
    getWidgetData ({commit},widgetId){
        widgetDataSource.getWidgetData(widgetId).then(response => commit('SET_WIDGET_DATA', { response }))
    },
    setWidgetData ({commit}, {id, data}){
        // commit('SET_WIDGET_DATA', { response: {data} })
        widgetDataSource.setWidgetData(id, {data: data})
            .then(response => commit('SET_WIDGET_DATA', { response } ))
    },
    setWidgetThumbnail ({commit}, {widgetId, container}){
        servicesDataSource.setWidgetThumbnail(widgetId, container)
        // .then(response => commit('SET_WIDGET_DATA', { response }))
    },
    removeTag({commit},{item}){
        tagDataSource.deleteTag(item.connectionId)
            .then(response =>  commit('REMOVE_WIDGET_TAGS',{item}))
    }
}
const getters = {
    getWidgetMetadata: state => {
        return state.widget.metadata
    },
    getNewComments : state =>{
       return state.widget.comments;
    },
    getWidgetData : state =>{
        return state.widget.data;
    },
    getWidgetIntroduction: state =>{
        return state.widget.data;
    },
    getTags : state => {
        return state.widget.tags;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
