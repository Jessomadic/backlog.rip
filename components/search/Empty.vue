<template>
  <div class="p-2">
    <div class="empty" style="border: 1px dashed #cccccc73; border-radius: 4px">
      <template v-if="preset == null">
        <p class="empty-title">Your library is empty</p>
        <p class="empty-subtitle text-secondary">
          You don't have any games in your library.
          <br />
          Try importing your Steam games or add any game you want from games page.
        </p>
        <div class="empty-action">
          <b-btn to="/import" color="primary" size="sm" class="me-3">
            <!-- <Icon>StepInto</Icon> -->
            Import your library
          </b-btn>

          <b-btn to="/import" color="primary" size="sm" class="me-3">
            <!-- <Icon>StepInto</Icon> -->
            Add a game manually
          </b-btn>

          <b-btn to="/games" variant="ghost" size="sm" color="secondary">
            Browse all games
          </b-btn>
        </div>
      </template>

      <template v-if="preset == 'filtering'">
        <p class="empty-title">Nothing found</p>
        <p class="empty-subtitle text-secondary">
          We couldn't find any results matching your search criteria.
          <br />
          Try to change your search query or filters.
        </p>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * @file:    \components\search\empty.vue
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 15th March 2024
 * Modified: Thu 19 December 2024 - 10:00:07
 **/

export default {
  name: 'SearchEmpty',
  props: {
    preset: {
      type: [String, Boolean],
      default: null,
    },

    title: {
      type: String,
      default: 'Your library is empty',
    },
  },

  data() {
    return {
      ui: {},
    }
  },

  methods: {},

  mounted() {},
}
</script>
