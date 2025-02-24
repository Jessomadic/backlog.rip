/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: Mon 24 February 2025 - 17:34:06
 */

let $nuxt = null
let $data = null

export const useGameStore = defineStore('game', {
  state: () => ({
    app: {
      is: {},
      id: {},
      genres: [],
    },
  }),

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Index of methods
  //
  // Retrieve data
  // * load()
  // * getFromAPI()
  //
  // Modify data
  // * create()
  // * update()
  // * normalize()
  //
  // Getters
  // * _score()
  // * _playtime()
  //
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Game Object
  // {
  //   uuid: '5c1c9b5a-1c02-4a56-85df-f0cf97929a48',
  //   name: 'DOOM',
  //   description: 'Lorem',
  //   state: 1, ⇢ State ID from states table
  //
  //   id: { 🔸 Added in this.normalize
  //     api: '5c1c9b5a-1c02-4a56-85df-f0cf97929a48', ⇢ UUID assigned by the API
  //     gog: 'ABC',
  //     xbox: 'C3QH42WRGM3R',
  //     epic: 'ABC',
  //     igdb: 7351,
  //     steam: 379720,
  //   },
  //
  //   is: {
  //     lib: 1726666517, ⇢ Timestamp of when the app was added to the library
  //     steam: 1726666517, ⇢ Timestamp of when the app was added to the steam library
  //     state: {
  //       state_1: 1726666517, ⇢ Timestamp of when assigned to state 1
  //       state_2: 1726666517, ⇢ Timestamp of when assigned to state 2...
  //     }
  //   },
  //
  //   dates: {
  //     created_at: 1726666517, ⇢ Timestamp of when the app was created
  //     updated_at: 1726666517, ⇢ Timestamp of when the app was updated
  //     released_at: 1726666517, ⇢ Timestamp of when the app was released
  //   },
  //
  //   genres: [], ⇢ Array of genres
  //
  //   scores: {
  //     igdb: 81, ⇢ Score from IGDB
  //     igdbCount: 748, ⇢ Amount of reviews on IGDB
  //     steamscore: 85, ⇢ Score from Steam
  //     steamCount: 1106232, ⇢ Amount of reviews on Steam
  //     steamscoreAlt: Very Positive, ⇢ Score from Steam
  //     userscore: 86, ⇢ Score from Steam
  //   },
  //
  //   playtime: {
  //     steam: 123, ⇢ Playtime (in minutes)
  //     steam_last: 1726666517, ⇢ Timestamp of last playtime
  //   },
  //
  //   cover: {
  //     igdb: 123, ⇢ Cover ID from IGDB
  //   },
  //
  //   log: [], ⇢ Array of logs
  // }
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  actions: {
    //+-------------------------------------------------
    // load()
    // Loads an item from datastore and sets this.app
    // Calls update() to check if the app needs to be updated
    // -----
    // Created on Thu Jan 11 2024
    //+-------------------------------------------------
    async load(uuid, update = true) {
      const game = $data.get(uuid)
      this.app = game

      if (update) this.update(game)
    },

    //+-------------------------------------------------
    // create()
    // Creates a new item and normalizes it
    // -----
    // Created on Wed Apr 10 2024
    // Created on Wed Dec 04 2024 - Mark uuid as local
    //+-------------------------------------------------
    create(data = {}) {
      let app = {}

      app = dataService.normalize({ ...data })
      app.uuid = app.uuid || `local::${$nuxt.$uuid()}`
      app.is.lib = app.is.lib || dates.stamp()

      return app
    },

    //+-------------------------------------------------
    // update()
    // Updates local data from API data
    // To modify the data by the user, use modify()
    // -----
    // Created on Sun Feb 11 2024
    // Created on Fri Jan 17 2025 - New update method
    //+-------------------------------------------------
    async update(uuid, data) {
      let game = null

      // Load the game by reference
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (typeof uuid === 'object') game = uuid
      else game = $data.get(uuid)

      console.trace('abc')
      // if (data && game.uuid == '4434fa13-4f18-44ec-ad80-db412ba28a96') debugger
      // if (data && game.uuid == '5c1c9b5a-1c02-4a56-85df-f0cf97929a48') debugger
      // if (data && game.uuid == 'b53cc15c-980a-4a2e-af37-0053f093eaef') debugger

      const update = gameService.needsUpdate(game, data)
      if (!update) return false

      // Update the game with the new data from the API
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (!data && update.indexOf(':api') > -1) {
        data = await this.getFromAPI(game.uuid)
        if (!data) return
      }

      // Create the new object with the updated data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      let updated = gameService.update(game, data)
      if (!updated.updated) return

      // TODO: Add entry in app log

      // Update local data, store and indexes
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      $data.toData(updated.app)
      // $data.process(updated.app, 'updated:app')

      if (this.app.uuid == updated.app.uuid) this.load(updated.app.uuid, false)
    },

    //+-------------------------------------------------
    // getFromAPI()
    // Gets more data from the API
    // -----
    // Created on Fri Feb 16 2024
    // Updated on Thu Jan 30 2025 - Get uuid from param
    //+-------------------------------------------------
    async getFromAPI(uuid) {
      if (uuid.includes('local:')) return
      let xhr = await $nuxt.$axios.get(`/get/${uuid}.json`)

      if (xhr.status == 200) {
        return xhr.data
      } else {
        console.error('🪝 Error loading data from API', xhr)
      }
    },

    async init() {
      if (!$nuxt) $nuxt = useNuxtApp()
      if (!$data) $data = useDataStore()

      if (window) window.$game = this
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}
