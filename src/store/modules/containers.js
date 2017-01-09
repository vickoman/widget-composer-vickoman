import widgetTypeDataSource from '../../api/widgetTypes'
import containerDataSource from  '../../api/containers'
import favoritesDataSource from  '../../api/favorites'
import filtersDataSource from  '../../api/filters'
import clientDataSource from '../../api/client'
import mediaDataSource from '../../api/media'
import tagsDataSource from  '../../api/tags'
import utils from '../../utils/index'
import moment from 'moment'
import auth from './auth'
import _ from 'lodash'
import Vue from 'vue'

const container = process.env.CONTAINER_QA || 'test-project';

const state = {
    container: {name: container},
    clientWithItems: [],
    widgetTypes: [],
    media: [],
    clientId : 1,
    tags:{
        list:[],
        hasTags:false
    }
};
const mutations = {
    FETCH_CONTAINERS (state, { containers }) {
        Vue.set(state,'containers',containers)
    },
    FETCH_PROJECT_ITEMS (state, { clientWithItems }) {
        let newClient = {client: []};
        utils.mapList(clientWithItems.assets, newClient.client);
        Vue.set(state, 'clientWithItems', newClient.client)
    },
    FETCH_PROJECT_MEDIA (state, { media }) {
        state.media = media
    },
    UPDATE_PROJECTS (state,{clients}){
        utils.mapList(clients.assets,state.clientWithItems);
    },
    SELECT_PROJECT_ITEM (state,{index}){
        state.clientWithItems[index].selected =  true;
    },
    DESELECT_PROJECT_ITEMS(state,{value}){
        _.map(state.clientWithItems,function(item){
            item.selected = false;
        });
    },
    SELECT_PROJECT_ITEMS(state,{value}){
        _.map(state.clientWithItems,function(item){
            item.selected = true;
        });
    },
    FETCH_TEMPLATE_TYPES (state, { widgetTypes }){
        state.widgetTypes = widgetTypes
    },
    SORT_PROJECTS (state,{sort}){
        state.clientWithItems  = _.orderBy(state.clientWithItems,[client => client[sort.property]],[sort.value]);
    },
    UPDATE_QUERY_TAGS(state,{tags}){
        _.forEach(tags, function (tag) {
            state.tags.list.push(tag);
        });
        state.tags.hasTags = _.size(tags)>0
    },
    UPDATE_FAVORITE_ITEMS(state,{data}){
        if(!_.isUndefined(data)){
            _.forEach(state.clientWithItems ,function(item){
                var newItem = _.find(data.list,asset => asset.uuid === item.uuid);
                if(!_.isUndefined(newItem)){
                    item.isFavorite = data.favorite
                }
            });
            Vue.set(state,'favorites',data.favorite);
        }
    },
    SET_CLIENT_FILTERS(state,{response}){
        Vue.set(state,'clientFilters',response.filters);
    },
    GET_FAVORITES ( state){
        var isFav = utils.getFavorites(state.clientWithItems);
        Vue.set(state,'favorites',isFav)
    }
}


const getters = {
    getClients : state => {
         _.map(state.clientWithItems, function (newItem) {
            newItem.owner = 'Tierry Henry';
        });
        return !_.isUndefined(state.clientWithItems) ? state.clientWithItems : [];
    },
    getWidgetTypes : state => {
        return state.widgetTypes;
    },
    getSelectedItems : state => {
         _.filter(state.clientWithItems.assets, function(asset){
             return !asset.selected
         });
    },
    filterByType: (state)=>(filter)=>{
        return filter;
    },
    getQueryTags : state => {
        return state.tags
    },
    getFilterClients : state => {
        return state.clientFilters
    },
}

const actions = {
    getContainers ({commit}) {
        containerDataSource.getContainers().then(containers => commit('FETCH_CONTAINERS', { containers }));
    },
    addMedia ({commit}, {container, file}) {
        let form = new FormData();
        form.append('file', file);
        return containerDataSource.addMediaToStorage(container, form)
        .then((data) => {
            let file = _.first(data.result.files.file);
            file.url = `${process.env.API_DATA_ROOT}/containers/${container}/download/${file.name}` ;
            file.clientId = state.clientId;
            file.objectStorage = true;
            return mediaDataSource.addMediaToDB(file)
        })
        .then((media)=>{
          return media.data;
        })
    },
    addMediaByUrl ({commit}, {url}) {
        let file = {
            name: url.substring(url.lastIndexOf('/') + 1),
            clientId: state.clientId,
            url,
            type: utils.fileExtension(url),
            objectStorage: false
        }
        return mediaDataSource.addMediaToDB(file)
        .then((media)=>{
          return media.data
        })
    },
    getClientItems ({commit},{id,params}) {
        return clientDataSource.getClientItems(id,params)
            .then(clientWithItems => commit('FETCH_PROJECT_ITEMS', { clientWithItems }));
    },
    loadClientItems ({commit},{id,params}){
        return clientDataSource.getClientItems(id,params)
                .then(clients => _.size(clients.assets)>0 ? commit('UPDATE_PROJECTS', { clients }): false);
    },
    getClientMedia ({commit}) {
        clientDataSource.getClientMedia(state.clientId)
            .then(media => commit('FETCH_PROJECT_MEDIA', { media }));
    },
    deleteMedia ({commit}, {id, fileName, isUrl}) {
        var media = {
            media: {
                fileName,
                id,
                container: state.container.name,
                clientId: state.clientId,
                objectStorage: !isUrl
            }
        };
        mediaDataSource.deleteMedia(media)
        .then((media) =>{
            commit('FETCH_PROJECT_MEDIA', { media })
        });
    },
    getTemplateTypes ({commit}) {
        widgetTypeDataSource.getTemplateTypes(state.clientId)
            .then(widgetTypes => commit('FETCH_TEMPLATE_TYPES', { widgetTypes }))
    },
    setItemTags ({commit},{data}){
        var selected = state.clientWithItems.filter(n => n.selected==true);
        var data = {
            data: utils.objectTag(selected,data.tags),
            clientId : auth.state.user.clientId
        };
        return  _.size(selected) > 0 ?
        tagsDataSource.createTag(data)
            .then(response => response) :  false;
    },
    queryTag ({commit},{query}){
        tagsDataSource.searchTag(query)
            .then(response => commit('UPDATE_QUERY_TAGS',{tags:response.data}));
    },
    setFavorites ({commit},{data}){
        var selected = state.clientWithItems.filter(n => n.selected==true);
        var favorites = {
            data : {
                assets:   utils.getList(selected),
                favorite : data.favorite,
                userId : data.userId
            }
        };
        return  _.size(favorites.data) > 0 ? favoritesDataSource.setFavorite(favorites)
            .then(response => {
                commit('UPDATE_FAVORITE_ITEMS', {data:{list:selected,favorite:data.favorite}})
                return {
                    data:response,
                    status:favorites.data.favorite
                }})
            : false;
    },
    getFilters({commit},user){
        return filtersDataSource.getFilters(user.clientId)
            .then(response => {  commit('SET_CLIENT_FILTERS', {response} )})
    }

};

export default {
    state,
    actions,
    getters,
    mutations
}
