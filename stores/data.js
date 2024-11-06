/* eslint-disable no-unused-vars */

/*
 * @file:    \stores\DataStore.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 14th November 2023
 * Modified: Wed 06 November 2024 - 11:54:23
 */

let $nuxt = null
let $game = null
let $cloud = null

//+-------------------------------------------------
// Data sources
// ---
// Data is the complete list of games loaded by the app
// Updated every time a repository is loaded or a game is added
// ---
// Buffer is a top-list of games fetch from the api
// ---
// All items are indexed by uuid
//+-------------------------------------------------

let data = {}
let buffer = {}

//+-------------------------------------------------
// Repos
// Repositories are searches and preset filters
// They are stored in the database and can be updated
//+-------------------------------------------------

let repos = {}
let search = {}

//+-------------------------------------------------
// index (ed, api, epic, igdb, steam)
// Hold index values for each app in every store
// ---
// Indexed has uuids, if an api uuid is indexed, just skip it
// Stores index have the store ID as key and the data[uuid] as value
//+-------------------------------------------------

let index = {
  ed: [],
  lib: [],
  api: {},
  igdb: {},
  epic: {},
  steam: {},

  fav: [],
  pinned: [],
  hidden: [],
}

export const useDataStore = defineStore('data', {
  state: () => ({
    // version defining data integrity
    v: 10,

    queue: [],
    loaded: [],
    indexes: [],
  }),

  getters: {
    libLatest() {
      // let games = await $nuxt.$db.games
      //   .orderBy('created_at')
      //   .reverse()
      //   .limit(10)
      //   .toArray()
      return index.lib.sort((a, b) => b.created_at - a.created_at).slice(0, 30)
    },
  },

  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Methods to load data
  // * loadLibrary()
  // * loadApiStatus()
  //
  // Methods to retrieve data
  // * list() <-- Returns the whole data object
  // * library() <-- Returns the library object
  // * pinned() <-- Returns the pinned games
  // * hidden() <-- Returns the hidden games
  // * get() <-- Get an element by uuid
  // * getRandom() <-- Get random elements
  //
  // Methods to Query the API
  // * search()
  //
  // Methods to persist data
  // * store() <-- Stores an array of items and updates indexes
  // * storeQueue() <-- Stores the queue calling store()
  // * delete() <-- Deletes an item from the database
  //
  // Utilities to manage data
  // * process() <- entry point for new data
  // * prepareToStore()
  // * toData()
  // * toIndex()
  // * setIndex()
  // * isIndexed()
  // * inInLibrary()
  // * countLibrary()
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  actions: {
    status() {
      console.warn('Data satus')
      console.log('Data', data)

      console.table({
        'Loaded': this.loaded.join(', '),
        'Indexes': this.indexes.join(', '),
        '-- Data --': '----',
        // 'Api': JSON.stringify(this.api),
        'Data': Object.keys(data).length,
        'Library': index.lib.length,
        // 'Wishlist': Object.keys(wishlist).length,
        '-- Repos --': '----',
        'Repos': Object.keys(repos).join(', '),
        'Search': Object.keys(search).join(', '),
        '-- Index --': '----',
        'Indexed': index.ed.length,
        // Temporary disabled
        // 'API': Object.keys(index.api).length,
        // 'GOG': Object.keys(index.gog).length,
        // 'IGDB': Object.keys(index.igdb).length,
        // 'Epic': Object.keys(index.epic).length,
        'Steam': Object.keys(index.steam).length,
      })

      console.warn(index['steam'][440], data[index['steam'][440]])
    },

    //+-------------------------------------------------
    // list()
    // Returns the whole data object
    // -----
    // Created on Tue Nov 21 2023
    // Updated on Wed Jul 24 2024 - Return as array
    //+-------------------------------------------------
    list(as = 'object') {
      if (as == 'array') return Object.values(data).filter(Boolean)

      return data
    },

    //+-------------------------------------------------
    // library()
    // Returns the library as an array or object
    // -----
    // Created on Mon Dec 25 2023
    // Updated on Wed Feb 14 2024 - Library is now an index
    // Created on Wed Jul 24 2024 - Work with other indexes
    //+-------------------------------------------------
    library(as = 'array', key = 'lib') {
      let library = [...index[key]]

      if (as == 'object') {
        return Object.fromEntries(
          library.filter((uuid) => Boolean(data[uuid])).map((uuid) => [uuid, data[uuid]])
        )
      }

      return library.map((uuid) => data[uuid]).filter(Boolean)
    },

    //+-------------------------------------------------
    // steam_library()
    // Returns the library of steam games
    // -----
    // Created on Fri Sep 20 2024
    //+-------------------------------------------------
    steam_library(as = null) {
      let library = this.library()
      return library.filter((item) => item.id.steam)
    },

    //+-------------------------------------------------
    // pinned and hidden()
    // Returns a list of apps marked as pinned
    // -----
    // Created on Wed Jul 24 2024
    //+-------------------------------------------------
    pinned(as = null) {
      return this.library(as, 'pinned')
    },

    hidden(as = null) {
      return this.library(as, 'hidden')
    },

    //+-------------------------------------------------
    // countLibrary()
    // Counts the library filtering out hidden and non library items
    // -----
    // Created on Tue Jul 23 2024
    //+-------------------------------------------------
    countLibrary() {
      let library = this.library()
      let active = library.filter((item) => {
        if (!item.is) {
          // console.warn('🔒1', item)
          return false
        }
        if (!item.is.lib) {
          // console.warn('🔒2', item)
          return false
        }
        if (item.is.hidden) {
          // console.warn('🔒3', item)
          return false
        }
        return true
      })

      // console.log('🚀 ~ countLibrary ~ library:', library)
      // console.log('🚀 ~ active ~ active:', active)

      return active.length
    },

    //+-------------------------------------------------
    // get()
    // Get an element by uuid Maybe move to a getter
    // -----
    // Created on Tue Nov 14 2023
    //+-------------------------------------------------
    get(uuid) {
      if (!uuid) return
      if (data[uuid]) return data[uuid]
      if (index.api[uuid] && data[index.api[uuid]]) return data[index.api[uuid]]

      return {
        uuid: uuid,
        character: 'pikachu',
        face: 'surprised',
        error: 'missing',
      }
    },

    //+-------------------------------------------------
    // getRandom()
    // Get random elements from the data object
    // -----
    // Created on Thu Apr 18 2024
    //+-------------------------------------------------
    getRandom(amount = 1) {
      console.warn(Object.values(data).length)
      let items = Object.values(data)
        .sort(() => Math.random() - 0.5)
        .slice(0, amount)

      return items
    },

    getRecentlyAdded(amount = 30, as = 'uuid') {
      let items = Object.values(data)
        .sort((a, b) => {
          const libA = a.is?.lib ?? 0
          const libB = b.is?.lib ?? 0
          return libB - libA // Sort in ascending order
        })
        .slice(0, amount)

      if (as == 'array') return items

      return items.map((item) => item.uuid)
    },

    //+-------------------------------------------------
    // searchHash()
    // Sanitizes and creates a hash for the search to API
    // -----
    // Created on Wed May 01 2024
    //+-------------------------------------------------
    searchHash(f = {}) {
      f.string = f.string?.trim()

      let emptyString = !f.string || f.string?.length < 3
      let dirty = ['genres', 'anotherArrayProperty'].some(
        (prop) => Array.isArray(f[prop]) && f[prop].length > 0
      )

      if (f.sortBy == 'rand') return null
      if (f.sortBy == 'score' && f.sortDir == 'desc' && emptyString && !dirty) return null
      if (f.sortBy == 'playtime' && emptyString) return null

      delete f.mods
      delete f.show
      delete f.source
      delete f.states

      if (emptyString) delete f.string
      if (!f.released) delete f.released
      if (f.genres?.length == 0) delete f.genres

      const json = JSON.stringify(f)
      const hash = btoa(json)

      return hash
    },

    //+-------------------------------------------------
    // search(hash)
    // Performs a search against the api
    // -----
    // Created on Fri Nov 24 2023
    //+-------------------------------------------------
    async search(filters) {
      let hash = this.searchHash(filters)
      if (!hash) return

      if (search[hash]) {
        log('🛑 Search', hash, 'already done')
        return
      } else log('🪂 Searching hash', hash, filters)

      search[hash] = true
      const xhr = await $nuxt.$axios.get(`search/${hash}.json`)
      if (xhr.status) {
        log('🪂 Data from API', xhr.data)
        await this.process(xhr.data, 'api')
      }

      return true
    },

    //+-------------------------------------------------
    // process()
    // Main entry point to process data
    // -----
    // Created on Fri Feb 16 2024
    //+-------------------------------------------------
    async process(apps, context) {
      if (!apps.length) apps = [apps]

      apps.forEach((item) => {
        if (item === true || (Array.isArray(item) && item.length === 0)) {
          console.error('🔥', item, context)
          return
        }

        // Debug on
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (false && item.uuid == '3861490d-f31a-43a2-a3cc-2e8e2ae6dab7') {
          // if (item.name == 'DOOM') {
          //   // if (item.steam_id == '292030') {
          // if (context == 'add:new') {
          //   console.warn('✨ ' + item.name, item, context)
          debugger
        }

        // Flag games coming from API as is_api
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (context == 'api') {
          item.is_api = true
          item.api_id = item.api_id || item.uuid
          // item.id.api = item.id.api || item.uuid
          if (!item.uuid) item.uuid = `local:${format.stringToSlug(item.name)}`
        }

        // Games coming from the library
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (context == 'library') {
          this.toData(item)
          return
        }

        // Importing games
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (context == 'import') {
          this.toData(item)
          return
        }

        if (!context.includes) {
          console.warn(item, context)
          debugger
        }

        if (context?.includes('update:')) {
          if (item.is?.lib) item.is.dirty = true
          this.toData(item)
          return
        }

        if (context?.includes('store:')) {
          item.is.dirty = true
          this.toData(item)
          return
        }

        // Adding games manually
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (context?.includes('add:')) {
          item.is.dirty = true
          this.toData(item)
          return
        }

        // Populate the data from a list
        //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // if (context?.includes('list:')) {
        //   this.toData(item)
        //   return
        // }

        if (item.trigger) {
          console.log('this shouldnt happen, delete trigger here and under', item)
          debugger
        }

        let appUUID = this.isIndexed(item)
        if (appUUID === true) return

        if (!appUUID) this.toData(item)
        else $game.update(appUUID, { ...item, trigger: true })
      })

      $nuxt.$app.count.data = Object.keys(data).length || 0
      $nuxt.$app.count.library = this.countLibrary() // index.lib.length || 0

      if (!$nuxt.$app.ready) return
      if (context.includes('list:')) return
      if (context.includes('update:')) return

      $nuxt.$mitt.emit('data:updated', 'loaded:' + apps.length)
    },

    //+-------------------------------------------------
    // prepareToStore()
    // to ensure consistency, add base values to the item
    // and remove unwanted values before returning back
    // -----
    // Created on Thu Dec 14 2023
    // Updated on Tue Feb 27 2024
    // updated on Thu Jul 11 2024 - Clone the object
    //+-------------------------------------------------
    prepareToStore(data) {
      if (!data) {
        console.error('🔥 Called prepareToStore without item', item)
        return
      }

      let item = JSON.parse(JSON.stringify(data))
      item.uuid = item.uuid || $nuxt.$uuid()

      item.is.lib = item.is.lib === 0 ? 0 : item.is.lib || dates.stamp()

      // item.is = item.is || {}

      // item.log = item.log || []

      // // Default created at timestamp, should come from api
      // // But sometimes it doesn't or the game is created locally
      // item.created_at = item.created_at || dates.now()

      // Delete internal flags
      // Those are used for application logic
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      delete item.will_import
      delete item.will_update
      delete item.will_ignore

      delete item.is_api
      delete item.is.dirty

      delete item._
      delete item.data
      delete item.source

      return item
    },

    //+-------------------------------------------------
    // store()
    // Stores an array of items in games table
    // Updates indexes, library and data arrays
    // -----
    // Created on Fri Dec 22 2023
    //+-------------------------------------------------
    store(items) {
      if (!items.length) items = [items]

      let prepared = []
      items = items.forEach((item) => {
        let prep = null

        // if (typeof item == 'string') {
        //   prep = this.prepareToStore(data[item])
        // }

        // if (typeof item == 'object') {
        //   prep = this.prepareToStore(item)
        // }

        // prettier-ignore
        prep = this.prepareToStore(
          typeof item == 'string'
          ? {...data[item]}
          : item)

        prepared.push(prep)
      })

      if (prepared.length == 1) $nuxt.$db.games.put(prepared[0])
      else $nuxt.$db.games.bulkPut(prepared)

      log(
        '🎴 updated games stored',
        prepared[Math.floor(Math.random() * prepared.length)]
      )
    },

    //+-------------------------------------------------
    // storeQueue()
    // A debounced call to store()
    // -----
    // Created on Sun Feb 25 2024
    //+-------------------------------------------------
    async storeQueue() {
      await delay(4000, true)

      let amount = this.queue.length
      if (!amount) return

      console.warn('🪝 Storing', amount, 'games')
      this.store(this.queue)
      this.queue = []

      let text = 'Details have been updated in ' + amount
      text += amount > 1 ? ' games' : ' game'
      $nuxt.$toast.success(text, {
        // description: 'Monday, January 3rd at 6:00pm',
      })

      await delay(1000, true)
      this.storeQueue()
      $cloud.update('library')
    },

    //+-------------------------------------------------
    // delete()
    // deletes an item from the database
    // -----
    // Created on Wed Feb 14 2024
    //+-------------------------------------------------
    async delete(uuid) {
      if (!uuid) return
      let item = data[uuid]
      console.warn('🔥 Deleting', uuid)

      delete data[uuid]
      $nuxt.$db.games.delete(uuid)

      // Delete indexes
      delete index.ed[index.ed.indexOf(uuid)]
      delete index.lib[index.lib.indexOf(uuid)]
      delete index.igdb[item.id.igdb]
      delete index.steam[item.id.steam]

      // update counters
      $nuxt.$app.count.data = Object.keys(data).length || 0
      $nuxt.$app.count.library = index.lib.length || 0

      // Emits event
      $nuxt.$mitt.emit('data:deleted', { uuid })
    },

    //+-------------------------------------------------
    // toIndex()
    // Adds item IDs to various indexes.
    // Those indexes are then used to find the game by the ref
    // -----
    // Created on Thu Nov 30 2023
    // Updated on Thu Apr 25 2024 - Added id.api ref
    //+-------------------------------------------------
    toIndex(item) {
      if (item.id.api) index.api[item.id.api] = item.uuid
      if (item.id.igdb) index.igdb[item.id.igdb] = item.uuid
      if (item.id.steam) index.steam[item.id.steam] = item.uuid

      if ((this.isLibrary(item) || item.is.dirty) && !index.lib.includes(item.uuid)) {
        index.lib.push(item.uuid)
      }

      index.ed.push(item.uuid)

      // index.api[item.id.api] = index.api[item.id.api] || item.uuid
      // index.steam[item.id.steam] = index.steam[item.id.steam] || item.uuid
    },

    //+-------------------------------------------------
    // setIndex()
    // Replaces an index with a new array
    // -----
    // Created on Wed Jul 24 2024
    //+-------------------------------------------------
    setIndex(key, data) {
      index[key] = data
    },

    //+-------------------------------------------------
    // isLibrary()
    // Returns true when an item belongs to, or should
    // belong to the library. The library is the list of apps
    // that are stored in the local database, owned or not
    // -----
    // Created on Sun Feb 25 2024
    //+-------------------------------------------------
    isLibrary(item) {
      // if (index.lib.includes(item.uuid)) return false

      // Games in local library have:
      // Different id.api and uuid (not always)
      // state
      // is.lib
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (item.state) return true
      if (item.is?.lib) return true
      if (!item.is_api && item?.uuid !== item.id.api) return true

      return false
    },

    //+-------------------------------------------------
    // isIndexed()
    // Tries to find an item in data
    // Returns uuid of data when found
    // -----
    // Created on Thu Jan 11 2024
    //+-------------------------------------------------
    isIndexed(item) {
      let exists = false
      if (index.ed.includes(item.uuid)) return true

      for (const store of this.indexes) {
        if (
          (item.id?.store && index[store][item.id[store]]) ||
          (item[store + '_id'] && index[store][item[store + '_id']])
        ) {
          // console.warn(
          //   `🔥 ${item.name} is already indexed on ${store}`,
          //   index[store][item[store + '_id']],
          //   item
          // )

          return index[store][item[store + '_id']] || index[store][item.id[store]]
        }
      }

      return false
      // console.warn(item)
    },

    //+-------------------------------------------------
    // isInLibrary()
    // Tries to determine if an item is in the libraryeteryrhgjfgjj
    // -----
    // Created on Fri Jul 05 2024
    //+-------------------------------------------------
    isInLibrary(item, deep = false) {
      if (!deep) return index.lib.includes(item.uuid)
      else {
        let isIndexed = this.isIndexed(item)

        return isIndexed && index.lib.includes(isIndexed)
      }
    },

    //+-------------------------------------------------
    // prepareToData()
    // Prepares an item before adding it to data
    // -----
    // Created on Thu Mar 07 2024
    //+-------------------------------------------------
    prepareToData(item) {
      item = $game.normalize(item)

      item._ = {
        score: $game._score(item),
        playtime: $game._playtime(item),
        released_at: $game._dateReleasedAt(item),

        // owned: $game._owned(item), // WIP -> should return true if is[store] is there
        // date_owned: $game._dateOwned(item), // remove as makes no sense, just use is.lib
      }

      if (item.is?.dirty) {
        item.uuid = item.uuid || $nuxt.$uuid()
      }

      if (item.api_id) item.id.api = item.api_id
      if (item.igdb_id) item.id.igdb = item.igdb_id
      if (item.xbox_id) item.id.xbox = item.xbox_id
      if (item.steam_id) item.id.steam = item.steam_id

      delete item.api_id
      delete item.igdb_id
      delete item.xbox_id
      delete item.platforms

      return item
    },

    //+-------------------------------------------------
    // toData()
    // Adds apps to window.data and updates indexes
    // -----
    // Created on Tue Nov 21 2023
    // updated on Fri Feb 16 2024
    // Created on Sun Feb 25 2024 - Adds to queue
    //+-------------------------------------------------
    async toData(item) {
      let game = this.prepareToData({ ...item })

      data[game.uuid] = game
      this.toIndex(game)

      if (game.is?.dirty) {
        delete game.is.dirty
        if (this.queue.includes(game.uuid)) return

        console.warn('🔥 Queueing', game.uuid, 'to be stored, having ', this.queue.length)
        this.queue.push(game.uuid)
        this.storeQueue()
      }
    },

    //+-------------------------------------------------
    // loadLibrary()
    // Loads the entire library from indexedDB into memory
    // -----
    // Created on Fri Nov 17 2023
    // Updated on Sun Feb 25 2024
    //+-------------------------------------------------
    async loadLibrary(reload = false) {
      if (this.loaded.includes('library') && !reload) return

      let games = await $nuxt.$db.games.toArray()
      this.process(games, 'library')
      this.loaded.push('library')

      log(
        '🎴 Library loaded',
        `${games.length} apps in local DB`,
        games[Math.floor(Math.random() * games.length)]
      )
    },

    //+-------------------------------------------------
    // emptyLibrary()
    // Empties the library, clearing Dexie DB and related indexes
    // -----
    // Created on Fri Sep 13 2024
    //+-------------------------------------------------
    async emptyLibrary() {
      let library = this.library()

      library.forEach((item) => {
        delete data[item.uuid]

        // Delete indexes
        delete index.ed[index.ed.indexOf(item.uuid)]
        delete index.igdb[item.id.igdb]
        delete index.steam[item.id.steam]
      })

      // Clear Dexie DB
      await $nuxt.$db.games.clear()

      // Clear related indexes
      index.lib = []
      index.fav = []
      index.pinned = []
      index.hidden = []

      // Update counters
      $nuxt.$app.count.data = Object.keys(data).length || 0
      $nuxt.$app.count.library = 0

      // Emit event
      $nuxt.$mitt.emit('library:emptied')
      console.warn('🗑️ Library emptied')

      this.loaded = this.loaded.filter((item) => item !== 'library')
    },

    //+-------------------------------------------------
    // loadApiStatus()
    // Just load some status from API
    // NOTE: Might be moved to apiStore
    // -----
    // Created on Fri Dec 22 2023
    //+-------------------------------------------------
    async loadApiStatus() {
      if (this.loaded.includes('api')) return

      try {
        const xhr = await $nuxt.$axios.get(`get/status.json`)
        if (xhr.status) {
          $nuxt.$app.api = xhr.data
          $nuxt.$app.count.api = xhr.data?.games?.total || 0
        }
      } catch (error) {
        log('Could not establish connection with the API, working on offline mode')
        $nuxt.$app.api = {}
        $nuxt.$app.offline = true
        $nuxt.$app.count.api = 0
      }

      this.loaded.push('api')
    },

    //+-------------------------------------------------
    // updateMissing()
    // Builds an array of IDs that should be updated
    // Tries to follow similar logic than $game.needsUpdate()
    // -----
    // Created on Thu Apr 11 2024
    //+-------------------------------------------------
    async updateMissing() {
      let missing = Object.values(data)
        .filter((game) => {
          // const needsUpdate = $game.needsUpdate(game)
          // return needsUpdate !== false

          if (!game.id.steam) return false
          if (!game.id.api) return true
          // if (game.description == undefined) return true

          return false
        })
        .map((game) => game.id.steam)
      console.warn('🔥 Updating missing games', missing)

      const xhr = await $nuxt.$axios.post(`get/batch`, { steam: missing })
      if (xhr.status) {
        log('🪂 Data from API', xhr.data)
        await this.process(xhr.data, 'api')
        return true
      }

      return false
    },

    //+-------------------------------------------------
    // init()
    // Initialize the data store
    // -----
    // Created on Wed Nov 29 2023
    //+-------------------------------------------------
    async init() {
      if (this.loaded.includes('init')) return

      $nuxt ??= useNuxtApp()
      $game ??= useGameStore()
      $cloud ??= useCloudStore()

      this.loaded.push('init')
      this.indexes = Object.keys(index)

      // Load and index local library
      await this.loadLibrary()
      await this.loadApiStatus()

      // Expose data to the window
      window.db = {
        x: this,
        d: data,
        index,

        get: this.get,
        api: this.search,
        status: this.status,
        updateMissing: this.updateMissing,
      }

      // Finally, data is ready
      $nuxt.$mitt.emit('data:ready', '🟢 Go!')

      log('💽 Data is ready to use', {
        data: Object.keys(data).length,
        library: index.lib.length,
      })
    },
  },
})

//+-------------------------------------------------
//| 🔃 HMR
//| https://pinia.vuejs.org/cookbook/hot-module-replacement.html
//+-------------------------------------------------
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}
