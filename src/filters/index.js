import moment from 'moment'
import _ from 'lodash'


export function host (url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}
export function formatDate (time) {

  var date = moment(time),
  month = moment.localeData('en').monthsShort()[date.month()],
  day = date.format('DD'),
  year = date.format('YYYY'),
  hours = date.format('HH:mm A');

  return month + ' ' + day + ', ' + year + ' @ ' + hours;
}

export function filterDate(time){
  return moment(time).format('ll')
}
export function filterDateHours(time){
  return moment(time).format('LLL')
}

export function getType (filename) {
  var type;
  if(isImage(filename)){
       type = "image";
  }else if(isVideo(filename)){
       type = "video";
  }else if(isAudio(filename)){
       type = "audio";
  }else{
      type = 'widget'
  }
  return type;
}
export function arrayToString (array) {
  var i, len, newArray=[];
  for (i = 0, len = array.length; i < len; i++) {
    newArray[i] = "."+array[i];
  }
  return newArray.toString();
}

export function removeSpecialChars (filename) {
  return filename.replace(/[^A-Z0-9]+/ig, "_");
}
export function removeTags (filename) {
  return filename.replace(/<\/?[^>]+(>|$)/g, "");
}

export function hashCode (item) {
  var hash = 0, i, chr, len;
  if (item.length === 0) return hash;
  for (i = 0, len = item.length; i < len; i++) {
    chr   = item.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  if(parseInt(hash) < 0)
  {
    hash = parseInt(hash) * -1
    hash ="N"+hash
  }
  return hash;
}
function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}
export function isValidExtension(filename, array) {
    var i, len, ext = getExtension(filename);
    for (i = 0, len = array.length; i < len; i++) {
      if(array[i] == (ext)){
        return true;
      }
    }
    return false;
}
export function mediaTypeAllowed(array) {
    var i, len, mediasAllowed = {image:false, video:false, audio:false};
    for (i = 0, len = array.length; i < len; i++) {
        if(isImage("ext."+array[i])){
             mediasAllowed.image = true;
        }else if(isVideo("ext."+array[i])){
             mediasAllowed.video = true;
        }else if(isAudio("ext."+array[i])){
             mediasAllowed.audio = true;
        }
    }
    return mediasAllowed;
}
export function mergeList(list){
    return _.union(list.tag,list.project,list.creator,list.custom);
}
function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'png':
    case 'ttf':
        return true;
    }
    return false;
}
function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
        return true;
    }
    return false;
}
function isAudio(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'mp3':
    case 'wav':
        return true;
    }
    return false;
}
export function urlImage(filename) {
    var regex = /^(http|https):\/\//
    var matches = filename.match(regex);
    if (_.isNull(matches)) {
        return 'http://' + filename;
    }
}
export function formatFile(fileType){
    var regex = /\b^\w*[^a-z]/;
    if(!_.isUndefined(fileType) && _.isString(fileType)){
        var match = fileType.match(regex);
        return match['input'].replace(_.first(match),'.')
    }else{
        return null;
    }
}