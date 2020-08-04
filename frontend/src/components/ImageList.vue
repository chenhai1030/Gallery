<template>
    <section class="section">
      <div class="container" style="margin-top:0px;">
        <div class="columns is-multiline is-mobile" v-if="!isImageLoading && images.length > 0">
          <div class="column is-6" >
            <span class="is-size-5-desktop is-size-6-mobile has-text-grey" v-if="pageType !== 'bookmarks'"> Search Results </span>
            <span class="is-size-5-desktop is-size-6-mobile has-text-grey" v-else> Bookmarks</span></div>
          <div class="column is-5 has-text-right "><span class="has-text-grey-light is-size-6"> {{images.length}} image(s) </span> </div>
          <div class="column is-1 has-text-left">
              <b-tooltip type="is-light" label="switch panel view" position="is-top" :active="!isMobile">
<!--                <i @click="onClickUpdateSettings" class="fas  fa-lg" :class="[settings.panelType === 'card' ? 'fa-th-list' : 'fa-th']"></i>-->
                <i @click="onClickUpdateSettings" class="fas  fa-lg" :class="[settings.panelType === 'card' ? 'fa-th-list' : 'fa-th']"></i>
            </b-tooltip>
          </div>
        </div>
        <!-- Image List -->
        <transition name="list" mode="out-in" >
          <div class="columns is-multiline is-mobile" v-if="!isImageLoading && displayedImages.length > 0" :key="pageType">
              <div  class="column"
                :class="[settings.panelType === 'card' ? 'is-3-widescreen is-3-desktop is-4-tablet' : 'is-4-widescreen  is-4-desktop is-6-tablet is-12-mobile']"
                v-for="image in displayedImages"
                :key="image.collectionId">
                <!-- Card Panel  -->
                <div class="card"
                  v-if="settings.panelType === 'card'" >
                  <div class="card-image" @click="onClickImage(image)">
                    <figure class="image is-4by3">
                      <img
                        :src="image.imgUrl"
                        :alt="image.imgName">
                    </figure>
                  </div>
                  <div class="card-content">
                    <div class="media">
                      <div class="media-content overflow-content">
                        <div class="title is-size-6-widescreen is-size-6-desktop image-name" ><a v-if="image.imgUrl" @click="onClickImageName(image)">{{image.imgName}}</a></div>
                        <div class="subtitle is-6">{{image.dimensions}} <br>
                        <span class="has-text-grey-light">{{image.size}}</span></div>
                      </div>
                    </div>
                  </div>
                  <footer class="card-footer">
                      <a :href="image.imgUrl" target="_blank" class="card-footer-item" download="image.imgName">
                        <b-tooltip type="is-light" label="Download" position="is-top" :active="!isMobile">
                          <i class="fas fa-cloud-download-alt"></i>
                        </b-tooltip>
                      </a>
                      <span class="heart card-footer-item">
                        <b-tooltip type="is-light" :label="isInBookmark(image.imgName) ? 'click to unbookmarked' : 'click to bookmark'" position="is-top" :active="!isMobile">
                          <i @click="clickBookmarkImage(image)" class="fas fa-lg bookmarkIcon" :class="[{'favorite': isInBookmark(image.imgName)}, settings.bookmarkIcon]"></i>
                        </b-tooltip>
                      </span>
                      <a v-if="settings.youtubeLink === 'true'" :href="`https://www.youtube.com/results?search_query=${image.artistName} - ${image.imgName}`" target="_blank" class="card-footer-item">
                        <b-tooltip type="is-light" label="search on youtube" position="is-top" :active="!isMobile">
                          <i class="fab fa-youtube"></i>
                        </b-tooltip>
                      </a>
                    </footer>
                </div>
                <!-- Media Panel-->
                <article class="media media-wrap" v-if="settings.panelType === 'media'">
                  <figure class="media-left">
                    <p class="image ">
                      <img :src="image.imgUrl" :alt="image.imgName">
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content overflow-content">
                      <div>
                        <strong><a v-if="image.collectionId" @click="onClickImageName(image)">{{image.imgName}}</a></strong> <br>
                        {{image.artistName}} ( <span class="has-text-grey-light">{{image.imgName}}</span> )
                      </div>
                    </div>
                    <div class="level is-mobile">
                      <div class="level-left">
                        <a  class="level-item" :href="image.imgUrl" target="_blank">
                          <b-tooltip type="is-light" label="Download" position="is-top" :active="!isMobile">
                            <i class="fas fa-cloud-download-alt"></i>
                          </b-tooltip>
                        </a>
                        <a class="level-item">
                          <b-tooltip type="is-light" :label="isInBookmark(image.imgName) ? 'click to unbookmarked' : 'click to bookmark'" position="is-top" :active="!isMobile">
                            <i @click="clickBookmarkImage(image)" class="fas bookmarkIcon" :class="[{'favorite': isInBookmark(image.imgName)}, settings.bookmarkIcon]"></i>
                          </b-tooltip>
                        </a>
                        <a v-if="settings.youtubeLink === 'true'" class="level-item" :href="`https://www.youtube.com/results?search_query=${image.artistName} - ${image.collectionCensoredName}`" target="_blank">
                          <b-tooltip type="is-light" label="search on youtube" position="is-top" :active="!isMobile">
                            <i class="fab fa-youtube"></i>
                          </b-tooltip>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </transition>
          <!-- Loading animation -->
          <div class="columns is-mobile" v-if="isImageLoading">
            <div class="column loading">
                <b-loading :is-full-page="false" :active.sync="isImageLoading" :can-cancel="false"></b-loading>
            </div>
          </div>
          <!-- Pagination -->
          <div class="columns is-multiline is-mobile" v-if="!isImageLoading && images.length > 0">
            <div class="column is-12" v-if="images.length > 0">
              <hr>
              <b-pagination
                  :total="images.length"
                  :current.sync="current"
                  :order="order"
                  :size="size"
                  :simple="isSimple"
                  :rounded="isRounded"
                  :per-page="settings.perPage">
              </b-pagination>
            </div>
          </div>
          <!-- No Bookmark message-->
          <template v-if="pageType === 'bookmarks' && images.length === 0">
            <div class="columns is-multiline is-mobile">
              <div class="column">
                <h3 class="title is-4 has-text-centered">You have no saved bookmarks.</h3>
              </div>
            </div>
          </template>
          <!-- Search results message -->
          <template v-if="searchFailed && !isImageLoading">
          <div class="columns is-multiline is-mobile">
            <div class="column">
              <h3 class="title is-4 has-text-centered">Nothing found. </h3>
              <h3 class="title is-4 has-text-centered"> Please Search Again!</h3>
            </div>
          </div>
          </template>
      </div>
    </section>
</template>

<script>
export default {
  name: 'ImageList',
  data () {
    return {
      current: 1,
      order: 'is-centered',
      size: '',
      isSimple: false,
      isRounded: false
    }
  },
  props: {
    images: {
      type: Array,
      required: true
    },
    pageType: {
      type: String,
      required: true
    },
    isImageLoading: {
      type: Boolean,
      required: true
    },
    searchFailed: {
      type: Boolean,
      required: true
    },
    bookmarkImages: {
      type: Array,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    },
    clickBookmarkImage: {
      type: Function,
      required: true
    },
    isInBookmark: {
      type: Function,
      required: true
    },
  },
  computed: {
    displayedImages () {
      let n = this.paginate(this.images)
      return n
    }
  },
  watch: {
    images (val, oldVal) {
      if (val !== oldVal) {
        this.current = 1
      }
    }
  },
  methods: {
    paginate (images) {
      let current = this.current
      let perPage = this.settings.perPage
      let from = (current * perPage) - perPage
      let to = (current * perPage)
      return images.slice(from, to)
    },
    onClickUpdateSettings () {
      const settingValue = this.settings.panelType === 'card' ? 'media' : 'card'
      this.$emit('clickUpdateSettings', 'panelType', settingValue)

    },
    onClickImageName (img) {
      this.$emit('clickImage', img)
    },
    onClickImage (img) {
      this.$emit('clickImage', img)
    }
  }
}
</script>
