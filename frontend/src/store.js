import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { Snackbar } from 'buefy/dist/components/snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    settings: { initialSearchQuery: '', searchQuery: '', panelType: 'card', bookmarkIcon: 'fa-star', perPage: '20', youtubeLink: 'false' },
    images: [],
    previewItem: null,
    bookmarkImages: [],
    searchFailed: false,
    imageFailed: false,
    recentSearch: [],
    showRecentSearchBox: false,
    isImageLoading: false,
    language: 'en_us',
    pageType: 'search',
    appError: null
  },
  getters: {
    SEARCH_QUERY: (state) => {
      return state.settings.searchQuery
    },
    INITIAL_SEARCH_QUERY: (state) => {
      return state.settings.initialSearchQuery
    },
    GET_IMAGES: (state) => {
      return state.images
    },
    GET_PREVIEW: (state) => {
      return state.previewItem
    },
    GET_RECENT_SEARCH: (state) => {
      return state.recentSearch
    },
    IS_IMAGE_LOADING: (state) => {
      return state.isImageLoading
    },
    SEARCH_FAILED: (state) => {
      return state.searchFailed
    },
    GET_IMAGE_FAILED: (state) => {
      return state.imageFailed
    },
    BOOKMARK_IMAGES: (state) => {
      return state.bookmarkImages.reverse()
    },
    PAGE_TYPE: (state) => {
      return state.pageType
    },
    SHOW_RECENT_SEARCH_BOX: (state) => {
      return state.showRecentSearchBox
    },
    GET_SETTINGS: (state) => {
      return state.settings
    }
  },
  mutations: {
    SET_SEARCH_QUERY: (state, query) => {
      state.pageType = 'search'
      state.settings.searchQuery = query
    },
    SET_IMAGE: (state, data) => {
      state.images = data
    },
    SET_PREVIEW_ITEM: (state, data) => {
      state.previewItem = data
    },
    SEARCH_FAILED: (state, action) => {
      state.searchFailed = action
    },
    SET_RECENT_SEARCH: (state, data) => {
      state.pageType = 'search'
      state.recentSearch = data
    },
    CLEAR_SEARCH: (state) => {
      state.images = []
      state.settings.searchQuery = ''
    },
    TOGGLE_RECENT_SEARCH: (state) => {
      state.showRecentSearchBox = !state.showRecentSearchBox
    },
    SET_BOOKMARK_IMAGES: (state, images) => {
      state.bookmarkImages = images
    },
    IS_IMAGE_LOADING: (state, action) => {
      state.isImageLoading = action
    },
    SET_PAGE_TYPE: (state, type) => {
      if (type === 'bookmarks') { state.settings.searchQuery = '' }
      state.pageType = type
    },
    SET_SETTINGS: (state, settings) => {
      state.settings = settings
    },
    SET_IMAGE_FAILED: (state, action) => {
      state.imageFailed = action
    },
    APP_ERROR: (state, message) => {
      state.appError = message
      Snackbar.open({
        message: message,
        type: 'is-danger',
        position: 'is-top',
        actionText: 'Reload App',
        indefinite: true,
        onAction: () => {
          window.location.reload()
        }
      })
    }
  },
  actions: {
    SEARCH_IMAGES: async ({ commit, dispatch }, payload) => {
      try {
        // show loading animation
        commit('IS_IMAGE_LOADING', true)
        const { data } = await axios.get(`${payload.url}`)
        if (data.data.length === 0) {
          // if search response data results is empty commit search failed and clear the search input
          commit('CLEAR_SEARCH')
          commit('SEARCH_FAILED', true)
          commit('IS_IMAGE_LOADING', false)
        } else {
          // assign the search data results to set image state and query to set search query state
          commit('IS_IMAGE_LOADING', false)
          commit('SEARCH_FAILED', false)
          commit('SET_IMAGE', data.data)
          commit('SET_SEARCH_QUERY', payload.query)
          dispatch('SAVE_TO_RECENT_SEARCH', payload.query)
        }
      } catch (err) {
        // if error commit search failed and clear the search input
        commit('CLEAR_SEARCH')
        commit('IS_IMAGE_LOADING', false)
        commit('APP_ERROR', err.message)
      }
    },
    SAVE_TO_RECENT_SEARCH: ({ commit }, payload) => {
      try {
        let recentSearch = []
        // check if localstorage have recent search datas
        if (localStorage.getItem('recent_search') === null) {
          // if localstorage is null push the new recent search to empty array
          recentSearch.push(payload)
          localStorage.setItem('recent_search', JSON.stringify(recentSearch))
        } else {
          // if localstorage is not null append the new recent search to the end of array
          recentSearch = JSON.parse(localStorage.getItem('recent_search'))
          recentSearch.push(payload)
          // check if the new recent search is already in the array then remove duplicate and save to localstorage
          let newRecentSearch = (recentSearch) = recentSearch.filter((item, i) => recentSearch.indexOf(item) === i)
          localStorage.setItem('recent_search', JSON.stringify(newRecentSearch))
        }
        // assign a new array to the set recent search state
        commit('SET_RECENT_SEARCH', recentSearch)
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    GET_RECENT_SEARCH: ({ commit }) => {
      try {
        // assign recent_search localstorage dato to a recentSearch variable
        const recentSearch = localStorage.getItem('recent_search')
        // check if recentSearch variable is not null
        if (recentSearch !== null) {
          // if not null assign a new array to the  recentSearch state
          commit('SET_RECENT_SEARCH', JSON.parse(recentSearch))
        }
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    REMOVE_RECENT_SEARCH_ITEM: ({ commit }, item) => {
      try {
        // assign recent_search localstorage to recentSearchItems variable
        const recentSearchItems = JSON.parse(localStorage.getItem('recent_search'))
        // get the index location of the item in recentSearchItems array
        const recentSearchItemsIndex = recentSearchItems.indexOf(item)
        // remove if item is in the recentSearchItems array
        if (recentSearchItemsIndex !== -1) recentSearchItems.splice(recentSearchItemsIndex, 1)
        // assign the new recentSearchItems array to the recent_search localstorage
        localStorage.setItem('recent_search', JSON.stringify(recentSearchItems))
        // if recentSearchItems is empty remove recent search box
        if (recentSearchItems.length === 0) {
          commit('TOGGLE_RECENT_SEARCH')
        }
        // assign the new recentSearchItems array to the the set recent search state
        commit('SET_RECENT_SEARCH', recentSearchItems)
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    BOOKMARK_IMAGE: ({ commit }, payload) => {
      try {
        // console.info("begin")
        // destructure and assign payload  image objects to the new variables
        const { artistName, imgName, imgUrl, dimensions, size} = payload.image
        // assign the new payload image variables as object items to newBookmarkItem variable
        const newBookmarkItem = { artistName, imgName, imgUrl, dimensions, size}
        let bookmarkImages = []
        // check payload status
        if (payload.status === 'unbookmarked') {
          // if status is unbookmarked assign bookmark_images localstorage to boolmarkImages
          bookmarkImages = JSON.parse(localStorage.getItem('bookmark_images'))
          // check if the bookmarkImages item is already in the array
          const oldBookmarkImages = bookmarkImages.map((e) => { return e.imgName }).indexOf(imgName)
          // if is in the array remove payload item to bookmarkImages
          if (oldBookmarkImages !== -1) bookmarkImages.splice(oldBookmarkImages, 1)
          // set the new bookmarkImages array to the localstorage
          localStorage.setItem('bookmark_images', JSON.stringify(bookmarkImages))
        } else {
          // if status is bookmark
          // check if bookmark storage is null
          if (localStorage.getItem('bookmark_images') === null) {
            // push the newBookmarkItem to bookmarkImages
            bookmarkImages.push(newBookmarkItem)
            // set the new bookmarkImages array to the localstorage
            localStorage.setItem('bookmark_images', JSON.stringify(bookmarkImages))
          } else {
            // if bookmark storage have datas
            // assign bookmark_image localstorage data to bookmarkImages
            bookmarkImages = JSON.parse(localStorage.getItem('bookmark_images'))
            // push the newBookmarkItem to bookmarkImages
            bookmarkImages.push(newBookmarkItem)
            // push the newBookmarkItem to bookmarkImages
            localStorage.setItem('bookmark_images', JSON.stringify(bookmarkImages))
          }
        }
        commit('SET_BOOKMARK_IMAGES', bookmarkImages)
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    GET_BOOKMARK_IMAGES: ({ commit }) => {
      try {
        // assign bookmark_images localstorage to bookmarkImages variable
        const bookmarkImages = localStorage.getItem('bookmark_images')
        if (bookmarkImages !== null) {
          // if not null assign the new bookmark images array to the bookmark images state
          commit('SET_BOOKMARK_IMAGES', JSON.parse(bookmarkImages))
        }
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    GET_SETTINGS: ({ commit, state }) => {
      try {
        // assign settings localstorage to settings variable
        const settings = localStorage.getItem('settings')
        // check if settings variable is not null
        if (settings !== null) {
          // if not null assign the new setting array to the setting state
          commit('SET_SETTINGS', JSON.parse(settings))
        } else {
          // if null set the default state settings to localstorage
          localStorage.setItem('settings', JSON.stringify(state.settings))
        }
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    UPDATE_SETTINGS: ({ commit, state }, payload) => {
      try {
      // destructure and assign payload objects and state to the new variables
        const { settingValue, settingName } = payload
        const { settings } = state
        // update settings by reassigning the settings object name to the payload object name
        settings[settingName] = settingValue
        // assign the new settings array to the settings state
        commit('SET_SETTINGS', settings)
        // assign the new settings array to the settings localstorage
        localStorage.setItem('settings', JSON.stringify(settings))
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    GET_PREVIEW_ITEM: async ({ commit, state }, payload) => {
      try{
        commit('IS_IMAGE_LOADING', false)
        commit('SET_PREVIEW_ITEM', payload)
      } catch(err) {
        commit('APP_ERROR', err.message)
      }

      // try {
      //   // show loading animation
      //   commit('IS_ALBUM_TRACKS_LOADING', true)
      //   // reset album tracks
      //   if (state.albumTracks.length > 0) {
      //     commit('RESET_ALBUM_TRACKS')
      //   }
      //   const { data } = await axios.get(`${payload.url}`)
      //   if (data.result.length === 0) {
      //     commit('SET_IMAGE_FAILED', true)
      //     commit('IS_ALBUM_TRACKS_LOADING', false)
      //   } else {
      //     commit('SET_ALBUM_TRACKS', data.result)
      //     commit('IS_ALBUM_TRACKS_LOADING', false)
      //   }
      // } catch (err) {
      //   commit('IS_ALBUM_TRACKS_LOADING', false)
      //   commit('APP_ERROR', err.message)
      // }
    }
  }
})
