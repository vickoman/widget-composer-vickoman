import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import widget from './modules/widget'
import containers from './modules/containers'
import auth from './modules/auth'
import VuePaginate from 'vue-paginate'

Vue.use(Vuex);
Vue.use(VuePaginate);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    widget,
    containers,
    auth
  },
  strict: debug
})