import _ from 'lodash';

var utils = {
    mapList: function (list, targetList) {
        _.foreach(list, function (item) {
            targetList.push({
                id: item.id,
                name: item.name,
                uuid : item.uid,
                selected : false,
                size: item.size || 0,
                created: item.created,
                ownerId: item.ownerId || 0,
                originalModel : item.model,
                isFavorite : item.isFavorite,
                lastUpdated: item.lastUpdated,
                type: utils.getType(item,'type'),
                thumbnail: utils.getType(item,'thumbnail'),
                objectStorage: item.objectStorage || false,
                originalFilename: utils.getType(item,'name'),
                model: utils.getType(item,'model')
            });
        });
        return _.uniqBy(targetList,asset => asset.uuid);
    },
    getType: function(item,property){
        var models = {
            Widget : {
                name : item.model,
                type: 'gzip/gz',
                thumbnail : item.metadata && item.metadata.thumbnail ? item.metadata.thumbnail : null,
                model :  item.model + 's'
            },
            Media : {
                name: item.originalFilename ? item.originalFilename : item.name,
                type: item.type,
                thumbnail: item.url,
                model : item.model
            }
        };
        return models[item.model][property];
    },
    fileExtension : function( url ) {
        let extension = _.first(url.split('.').pop().split(/\#|\?/));
        switch (extension) {
            case  'jpg':
            case 'jpeg':
            case  'png':
                return `image/${extension}`;
            case 'mp3':
            case 'ogg':
            case 'wav':
                return `audio/${extension}`;
            case  'mp4':
                return `video/${extension}`
        }
    },
    getFavorites : function(itemList){
        var favorites = [];
        var selected = [];
        selected = _.filter(itemList, n => n.selected);
        favorites = _.map(selected,item => item.isFavorite);
        return _.every(favorites,Boolean);
    },
    getList : function(list){
        var items = [];
        var itemList = _.map(list, list => list.originalModel);
        _.forEach(itemList,function(item){
            items.push({
                type : item,
                ids : _.map(_.filter(list, list => list.originalModel === item),obj => obj.id)
            });
        });
        return _.uniqBy(items, items=>items.type);
    },
    buildSearch : function(list){
        var search = {};
        _.forEach(list.filters,function(terms,key){
            search[key] = [];
            _.map(terms,function(item){
                if(key!=='custom'){
                    search[key].push({
                        id:item.id,
                        name:item.name
                    })
                }else{
                    search[key].push({
                        type:item.type,
                        term:item.name
                    })
                }
            })
        });
        return search;
    },
    objectTag : function(selectedItemsList,tagList){
        return {
            items : utils.getList(selectedItemsList),
            tags : tagList
        }
    }
};
module.exports = utils;
