/*
 * @file:    \stores\gameStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 11th January 2024
 * Modified: Thu 30 January 2025 - 19:43:38
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
      if (uuid == '5c1c9b5a-1c02-4a56-85df-f0cf97929a48') {
        game.id.epic = '1245620'
        game.id.gog = 'dqwdqwd'
        game.has_demo = true

        game.scores = {
          metascore: '92',
          igdb: 81,
          igdbCount: 748,
          steamscore: '85',
          steamCount: '1106232',
          steamscoreAlt: 'Very Positive',
          userscore: 86,
        }

        game.languages = 'en,fr,de,pl,pt_BR,ru,es_ES,ja,zh_CN'

        game.hltb = {
          main: 109380,
          extras: 215280,
          comp: 527040,
        }

        game.screenshots = {
          base: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_',
          thumb: '.600x338.jpg',
          full: '.1920x1080.jpg',
          data: [
            '943bf6fe62352757d9070c1d33e50b92fe8539f1',
            'dcdac9e4b26ac0ee5248bfd2967d764fd00cdb42',
            '3c41384a24d86dddd58a8f61db77f9dc0bfda8b5',
            'e0316c76f8197405c1312d072b84331dd735d60b',
            'ef61b771ee6b269b1f0cb484233e07a0bfb5f81b',
            'b1b91299d7e4b94201ac840aa64de54d9f5cb7f3',
            '510a02cf3045e841e180f2b77fb87545e0c8b59d',
            'c494372930ca791bdc6221eca134f2270fb2cb9f',
            'fa6b881ef7c30522012ab2b2b83001e79baee093',
            'c2baf8aada6140beee79d701d14043899e91af47',
          ],
        }

        game.movies = [
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256875470/movie480_vp9.webm?t=1646770161',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256875470/movie_max_vp9.webm?t=1646770161',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256875470/movie480.mp4?t=1646770161',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256875470/movie_max.mp4?t=1646770161',
            },
          },
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256860549/movie480_vp9.webm?t=1646817731',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256860549/movie_max_vp9.webm?t=1646817731',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256860549/movie480.mp4?t=1646817731',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256860549/movie_max.mp4?t=1646817731',
            },
          },
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256845672/movie480_vp9.webm?t=1646817747',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256845672/movie_max_vp9.webm?t=1646817747',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256845672/movie480.mp4?t=1646817747',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256845672/movie_max.mp4?t=1646817747',
            },
          },
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256875472/movie480_vp9.webm?t=1646770169',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256875472/movie_max_vp9.webm?t=1646770169',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256875472/movie480.mp4?t=1646770169',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256875472/movie_max.mp4?t=1646770169',
            },
          },
          {
            webm: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256864455/movie480_vp9.webm?t=1646817701',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256864455/movie_max_vp9.webm?t=1646817701',
            },
            mp4: {
              480: 'http://video.akamai.steamstatic.com/store_trailers/256864455/movie480.mp4?t=1646817701',
              max: 'http://video.akamai.steamstatic.com/store_trailers/256864455/movie_max.mp4?t=1646817701',
            },
          },
        ]

        game.ratings = {
          esrb: {
            rating: 'm',
            descriptors: 'Blood and Gore\r\nLanguage\r\nSuggestive Themes\r\nViolence',
          },
          pegi: {
            rating: '16',
            descriptors: 'Violence',
          },
          usk: {
            rating: '16',
            descriptors: '',
          },
        }

        game.languages = 'en,fr,it,de,es_ES,ja,ko,pl,pt_BR,ru,zh_CN,es_LA,th'
      }

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

      app = this.normalize({ ...data })
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

      if (game.uuid == '4434fa13-4f18-44ec-ad80-db412ba28a96') debugger

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

    //+-------------------------------------------------
    // normalize()
    // Normalizes data for the game.
    // This is meant to be used when the game is used in the app
    // For preparing data to be stored, use process() or prepareToStore()
    // -----
    // Created on Tue Feb 20 2024
    // Created on Wed Dec 11 2024 - Normalize local uuids with API
    //+-------------------------------------------------
    normalize(game) {
      game.id = game.id || {}
      game.is = game.is || {}
      game.log = game.log || []

      game.dates = game.dates || {}
      game.scores = game.scores || {}
      game.genres = game.genres || []
      game.playtime = game.playtime || {}

      game = this.normalizeID(game)
      game = this.normalizeDates(game)
      game = this.cleanup(game)
      // game.updated_at = game.updated_at || 0

      return game
    },

    //+-------------------------------------------------
    // cleanup()
    // -----
    // Created on Tue Dec 31 2024
    //+-------------------------------------------------
    cleanup(game) {
      if (game.dates) delete game.date

      delete game.enabled
      delete game.data

      return game
    },

    //+-------------------------------------------------
    // normalizeID()
    // Normalizes multiple ID fields
    // -----
    // Created on Mon Dec 16 2024
    //+-------------------------------------------------
    normalizeID(game) {
      if (game.api_id) game.id.api = game.api_id
      if (game.igdb_id) game.id.igdb = game.igdb_id
      if (game.xbox_id) game.id.xbox = game.xbox_id
      if (game.epic_id) game.id.epic = game.epic_id
      if (game.steam_id) game.id.steam = game.steam_id
      if (game.igdb_slug) game.id.igdb_slug = game.igdb_slug

      if (game.id.steam) game.id.steam = Number(game.id.steam)

      if (!game.uuid || game.uuid?.indexOf('local:') > -1) {
        if (game.id.api) {
          // game.uuid = game.id.api
          game.uuid = $data.reIndex(game.uuid, game.id.api)
        }
        // if (game.is_api) {
        //   game.api_id = game.uuid
        //   game.uuid = game.api_id
        // }
      }

      delete game.api_id
      delete game.gog_id
      delete game.igdb_id
      delete game.xbox_id
      delete game.epic_id
      delete game.steam_id
      delete game.igdb_slug

      return game
    },

    //+-------------------------------------------------
    // normalizeDates()
    // - created_at -> Is the date the game was created in the API
    // - updated_at -> Is the date the game was updated in the API
    // - released_at -> Is the date the game was released
    // -----
    // Created on Tue Dec 31 2024
    //+-------------------------------------------------
    normalizeDates(game) {
      if (game.released_at) game.dates.released = game.released_at
      if (game.created_at) game.dates.created = game.created_at
      if (game.updated_at) game.dates.updated = game.updated_at

      delete game.created_at
      delete game.updated_at
      delete game.released_at

      return game
    },

    //+-------------------------------------------------
    // normalize_()
    // -----
    // Created on Mon Dec 16 2024
    // Updated on Tue Dec 17 2024 - Added owned_at
    //+-------------------------------------------------
    normalize_(game) {
      return {
        score: this._score(game),
        detail: gameService._detail(game),
        playtime: this._playtime(game),

        released: this._dateReleasedAt(game),
        releasedYear: this._dateReleasedAt(game, 'YYYY'),

        owned_at: this._dateOwnedAt(game),
        created_at: this._dateCreatedAt(game),
        updated_at: this._dateUpdatedAt(game),
      }
    },

    //+-------------------------------------------------
    // _score()
    // Generates a new score by taking context into account
    // -----
    // Created on Tue Feb 20 2024
    // Updated on Fri 08 Nov 2024 - Score is now handled in the API
    //+-------------------------------------------------
    _score(app) {
      return app.score || 0
      // let score = app.score || 0

      // // Avoid very high scores not verified
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (!app.scores) score = score - 25
      // if (app.score >= 96 && !app.scores) {
      //   score = 50
      // }

      // // Reduce the final score if the amount of reviews is low
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (app.scores?.steamCount < 100) score *= 0.7
      // else if (app.scores?.steamCount < 1000) score *= 0.8
      // else if (app.scores?.steamCount < 3000) score *= 0.9

      // if (app.score >= 95 && app.scores?.steamCount < 16000) score *= 0.8

      // // On games outside of steam...
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // if (app.scores.igdb > 0 && app.scores?.igdbCount < 90) score *= 0.8

      // // Only when there is only igdb
      // //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // // if (app.scores && !app.scores?.steamCount) {
      // //   if (app.scores?.igdb >= 90 && !app.scores.igdbCount) score *= 0.8
      // // }

      // return score
    },

    _playtime(app) {
      if (!app.playtime) return 0

      return Object.entries(app.playtime)
        .filter(([key]) => !key.endsWith('_last'))
        .reduce((total, [, num]) => total + num, 0)
    },

    _dateReleasedAt(app, format = 'LL') {
      if (!app.dates.released) return null
      return $nuxt.$moment(app.dates.released * 1000).format(format)
    },

    _dateCreatedAt(app) {
      if (!app.dates.created) return null
      return $nuxt.$moment(app.dates.created).format('LL')
    },

    _dateUpdatedAt(app) {
      if (!app.dates.updated) return null
      return $nuxt.$moment(app.dates.updated * 1000).format('LL')
    },

    _dateOwnedAt(app, format = 'LL') {
      if (!app.is.lib) return null
      return $nuxt.$moment(app.is.lib * 1000).format(format)
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
