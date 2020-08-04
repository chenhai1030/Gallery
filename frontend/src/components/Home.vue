<template>
    <div id="home">
        <div  class="nav-search">
          <the-navbar
            v-show="showNavbar"
            @clickToggleRecentSearchBox="toggleRecentSearchBox"
            @clickShowBookmarks="showBookmarks"
            @clickSettings="showSettingsModal"
            @clickTitle="setPageType('search')"
            @clickImageItem='getImagePreview'
            :pageType="pageType"
            :recentSearch="recentSearch"
            :bookmarkImages="bookmarkImages"
            :settings="settings"
            :isMobile="isMobile"
            :showRecentSearchBox="showRecentSearchBox">
          </the-navbar>
          <the-searchbar
            @clickSearch="searchImages"
            @clickClearSearch="clearSearch"
            :recentSearch="recentSearch"
            :newSearchQuery="searchQuery"
            :settings="settings"
            >
          </the-searchbar>
        </div>
        <main>
          <transition name="fade">
            <recent-search-box
              v-if="showRecentSearchBox && recentSearch.length > 0"
              :recentSearch="recentSearch"
              @clickSearchItem="searchImages"
              @clickRemoveRecentSearchItem="removeRecentSearchItem">
            </recent-search-box>
          </transition>
          <image-list
            @clickUpdateSettings="updateSettings"
            @clickImage='getImagePreview'
            :clickBookmarkImage="bookmarkImage"
            :isInBookmark="isInBookmark"
            :images="pageType === 'search' ? images: bookmarkImages"
            :pageType="pageType"
            :isImageLoading="isImageLoading"
            :searchFailed="searchFailed"
            :bookmarkImages="bookmarkImages"
            :settings="settings"
            :isMobile="isMobile"
            >
          </image-list>
          <!-- settings modal -->
          <b-modal
            :active.sync="isSettingsModalActive"
            :canCancel=true has-modal-card >
            <the-settings
              :settings="settings"
              @clickUpdateSettings="updateSettings">
            </the-settings>
          </b-modal>
          <!-- image preview modal -->
          <b-modal
            :active.sync="isImageModalActive"
            :canCancel=true
            :onCancel="resetPreviewItems"
            scroll="clip"
            >
            <div class="columns is-mobile is-centered" v-if="!imageFailed && previewItem == null " >
              <div class="columns is-mobile"  >
                <div class="column loading">
                    <b-loading :is-full-page="false" :active.sync="isImageLoading" :can-cancel="false"></b-loading>
                </div>
              </div>
            </div>
            <div class="container" v-else-if="imageFailed">
              <div class="columns is-mobile is-centered"  >
                <div class="column is-4">
                  <b-message  type="is-danger" has-icon >
                    Error loading preview image. <br>
                    Please check again later.
                  </b-message>
                </div>
              </div>
            </div>
            <image-item-preview  v-else
              :previewItem="previewItem">
              <p class="image is-4by3">
                <img :src="previewItem.imgUrl">
              </p>
            </image-item-preview>
          </b-modal>
        </main>
        <the-footer :class="{'footer-fixed': pageType === 'search' && images.length === 0 || pageType === 'bookmarks' && bookmarkImages.length === 0 || isImageLoading }"></the-footer>
    </div>
</template>

<script>
import TheNavbar from './TheNavbar'
import TheSearchbar from './TheSearchbar'
import RecentSearchBox from "./RecentSearchBox"
import ImageList from "./ImageList"
import TheFooter from './TheFooter'
import { mapGetters } from 'vuex'
export default {
    name: "Home",
    data () {
        return {
            isSettingsModalActive: false,
            isImageModalActive: false,
            windowWidth: window.innerWidth,
            showNavbar: true
        }
    },
    components: {
        TheNavbar,
        TheSearchbar,
        RecentSearchBox,
        ImageList,
        TheFooter
    },
    computed: {
      ...mapGetters({
        recentSearch: 'GET_RECENT_SEARCH',
        images: 'GET_IMAGES',
        previewItem: 'GET_PREVIEW',
        searchQuery: 'SEARCH_QUERY',
        initialSearchQuery: 'INITIAL_SEARCH_QUERY',
        bookmarkImages: 'BOOKMARK_IMAGES',
        pageType: 'PAGE_TYPE',
        showRecentSearchBox: 'SHOW_RECENT_SEARCH_BOX',
        isImageLoading: 'IS_IMAGE_LOADING',
        searchFailed: 'SEARCH_FAILED',
        imageFailed: 'GET_IMAGE_FAILED',
        settings: 'GET_SETTINGS',
        isAppError: 'IS_APP_ERROR'
      }),
      showRecentSearchBox () {
        return this.$store.state.showRecentSearchBox
      },
      isMobile () {
        return this.$mq === 'mobile'
      }
    },
    created () {
      this.$store.dispatch('GET_SETTINGS')
      this.$store.dispatch('GET_RECENT_SEARCH')
      this.$store.dispatch('GET_BOOKMARK_IMAGES')
      window.addEventListener('scroll', this.toggleNavbar)
    },
    destroyed () {
    window.removeEventListener('scroll', this.toggleNavbar)
    },
    methods: {
      searchImages (query) {
        if (query) {
          const payload = { 'url': `api/search?q=${query}`, 'query': query }
          this.$store.dispatch('SEARCH_IMAGES', payload)
        }
        this.$store.commit('SET_PAGE_TYPE', 'search')
      },
      clearSearch () {
        this.$store.commit('CLEAR_SEARCH')
      },
      toggleRecentSearchBox () {
        this.$store.commit('TOGGLE_RECENT_SEARCH')
      },
      removeRecentSearchItem (item) {
        this.$store.dispatch('REMOVE_RECENT_SEARCH_ITEM', item)
      },
      bookmarkImage (image) {
        if (this.isInBookmark(image.imgName)) {
          this.$store.dispatch('BOOKMARK_IMAGE', { 'image': image, 'status': 'unbookmarked' })
          // this.$dialog.confirm({
          //   message: `Are you sure you want to unbookmark this image? <b>${image.imgName} image</b>`,
          //   type: 'is-danger',
          //   hasIcon: true,
          //   onConfirm: () => {
          //     this.$store.dispatch('BOOKMARK_IMAGE', { 'image': image, 'status': 'unbookmarked' })
          //     this.$toast.open({
          //       duration: 3000,
          //       message: `"${image.imgName} image" has been unbookmark!`,
          //       position: 'is-bottom-right',
          //       type: 'is-danger'
          //     })
          //   }
          // })
        } else {
          // this.$toast.open({
          //   duration: 3000,
          //   message: `"${image.imgName} image" bookmarked!`,
          //   position: 'is-bottom',
          //   type: 'is-info'
          // })
          this.$store.dispatch('BOOKMARK_IMAGE', { 'image': image, 'status': 'bookmark' })
        }
      },
      isInBookmark (imageName) {
        return this.bookmarkImages.findIndex(image => image.imgName === imageName) > -1
      },
      showBookmarks () {
        this.$store.commit('SET_PAGE_TYPE', 'bookmarks')
      },
      updateSettings (settingName, settingValue) {
        const payload = { 'settingName': settingName, 'settingValue': settingValue }
        this.$store.dispatch('UPDATE_SETTINGS', payload)
      },
      showSettingsModal () {
        this.isSettingsModalActive = true
      },
      getImagePreview (item) {
        if (item) {
          this.isImageModalActive = true
          this.$store.dispatch('GET_PREVIEW_ITEM', item)
        }
      },
      setPageType (pageType) {
        if (pageType !== this.pageType) {
          this.$store.commit('SET_PAGE_TYPE', pageType)
        }

        if (pageType === 'search' && this.initialSearchQuery !== this.searchQuery) {
          this.searchImages(this.initialSearchQuery)
        }
      },
      resetPreviewItems () {
        this.$store.commit('RESET_PREVIEW_ITEMS')
      },
      toggleNavbar () {
        let scrollBarPosition = window.pageYOffset | document.body.scrollTop
        if (scrollBarPosition > 100) {
          this.showNavbar = false
        } else {
          this.showNavbar = true
        }
      }
    }
}
</script>

<style lang="scss">
  // Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #008a94;
$primary-invert: findColorInvert($primary);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

// transitions
.list-enter-active,
{
  transition: all .5s;
}
.list-leave-active {
  transition: all .5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
   transform: translateY(20px);
}
.fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .component-fade-leave-to
{
  opacity: 0;
}
</style>