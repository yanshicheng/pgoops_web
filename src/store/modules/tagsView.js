const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  },
  delLeftVisitedRoute(state, route) {
    let index = state.visitedViews.length
    state.visitedViews = state.visitedViews.filter((item) => {
      if (item.name === route.name) {
        index = state.visitedViews.indexOf(item)
      }
      return item.meta.affix || index <= state.visitedViews.indexOf(item)
    })
  },
  delRightVisitedRoute(state, route) {
    let index = state.visitedViews.length
    state.visitedViews = state.visitedViews.filter((item) => {
      if (item.name === route.name) {
        index = state.visitedViews.indexOf(item)
      }
      return item.meta.affix || index >= state.visitedViews.indexOf(item)
    })
  },
  delOthersVisitedRoute(state, route) {
    state.visitedViews = state.visitedViews.filter((item) => {
      return item.meta.affix || item.path === route.path
    })
  },
  delAllVisitedRoutes(state) {
    state.visitedViews = state.visitedViews.filter((item) => item.meta.affix)
  },
  delVisitedRoute(state, route) {
    state.visitedViews.forEach((item, index) => {
      if (item.path === route.path) {
        state.visitedViews.splice(index, 1)
      }
    })
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  async delRoute({ dispatch, state }, route) {
    await dispatch('delVisitedRoute', route)
    return {
      visitedViews: [...state.visitedViews]
    }
  },
  delVisitedRoute({ commit, state }, route) {
    commit('delVisitedRoute', route)
    return [...state.visitedViews]
  },
  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  delLeftVisitedRoute({ commit, state }, route) {
    commit('delLeftVisitedRoute', route)
    return [...state.visitedViews]
  },
  delRightVisitedRoute({ commit, state }, route) {
    commit('delRightVisitedRoute', route)
    return [...state.visitedViews]
  },
  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedRoute({ commit, state }, route) {
    commit('delOthersVisitedRoute', route)
    return [...state.visitedViews]
  },
  async delOthersRoutes({ dispatch, state }, route) {
    await dispatch('delOthersVisitedRoute', route)
    return {
      visitedViews: [...state.visitedViews]
    }
  },
  async delLeftRoutes({ dispatch, state }, route) {
    await dispatch('delLeftVisitedRoute', route)
    return {
      visitedViews: [...state.visitedViews]
    }
  },
  async delRightRoutes({ dispatch, state }, route) {
    await dispatch('delRightVisitedRoute', route)
    return {
      visitedViews: [...state.visitedViews]
    }
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
  async delAllRoutes({ dispatch, state }, route) {
    await dispatch('delAllVisitedRoutes', route)
    return {
      visitedViews: [...state.visitedViews]
    }
  },
  delAllVisitedRoutes({ commit, state }) {
    commit('delAllVisitedRoutes')
    return [...state.visitedViews]
  },
  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
