<template>
  <div class="alert alert-danger">do not use this component</div>
  <div class="row row-deck row-cards row-games-list" v-bind="$attrs">
    <template v-for="(app, i) in items" :key="'card' + i">
      <div
        class="col col-6 col-sm-4 col-md-3 col-lg-custom pt-1 pb-3"
        style="padding-left: 0.75rem; padding-right: 0.75rem">
        <b-game :key="app" :uuid="app" :body="false"></b-game>
      </div>
    </template>

    <ul v-if="pages > 1" class="pagination justify-content-center">
      <li
        class="page-item cursor-pointer"
        :class="{ 'disabled cursor-default': page <= 1 }"
        @click="setPage('--')">
        <div class="page-link">
          <Icon>ChevronLeft</Icon>
        </div>
      </li>

      <template v-for="i in pages" :key="i">
        <li
          v-if="shouldShow(i)"
          class="page-item"
          :class="{ active: i == page }"
          @click="page = i">
          <div class="page-link cursor-pointer">{{ i }}</div>
        </li>
      </template>

      <li
        class="page-item cursor-pointer"
        :class="{ 'disabled cursor-default': page <= pages }"
        @click="setPage('++')">
        <div class="page-link">
          <Icon>ChevronRight</Icon>
        </div>
      </li>
    </ul>

    <!-- <b-btn class="mt-3">
      <Icon class="text-secondary me-2">ArrowsMoveVertical</Icon>
      Show more
    </b-btn> -->
    <slot />
  </div>
</template>

<script>
/**
 * @file:    \components\game\list.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 8th January 2024
 * Modified: Thu 17 October 2024 - 15:32:39
 **/

export default {
  name: 'List',
  props: {
    apps: {
      type: [String, Array],
      default: null,
    },

    show: {
      type: String,
      default: 'grid',
    },

    cols: {
      type: [Number, String],
      default: 3,
    },

    max: {
      type: [Number, String],
      default: 12,
    },
  },

  data() {
    return {
      page: 1,
      offset: 4,
      perPage: 7,
    }
  },

  computed: {
    items() {
      if (!this.apps) return []

      let items = this.apps

      if (this.max > 0)
        items = items.slice(parseInt(this.max) * (this.page - 1), this.page * this.max)

      return items
    },

    pages() {
      return Math.ceil(this.apps.length / this.max)
    },
  },

  methods: {
    setPage(dir) {
      if (this.page > 1 && dir === '--') this.page--
      if (this.page < this.pages && dir === '++') this.page++
    },

    shouldShow(i) {
      if (this.pages <= this.offset * 2) return true

      if (Math.abs(this.page - i) <= 2) return true
      if (Math.abs(this.pages - i) <= 2) return true
    },

    init() {},
  },

  mounted() {
    this.init()
  },
}
</script>
