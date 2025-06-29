/*
 * @file:    \plugins\mitt.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 13th March 2023
 * Modified: Tue Jun 17 2025
 */

import synchronizationService from '../services/synchronizationService'

const emitter = mitt()

//+-------------------------------------------------
// Codex: List of events
// ⇢ Initial lifecycle
// |- app:start
//   |- aw $user.authenticate()
//   |- aw $data.init()
//   |- $list.init()
//   |- $state.init()
//   |- $search.init()
//   |- apiService.init()
// |- user:ready
//   |- $libs.init()
//   |- $sync.init()
// |- app:ready
//   |- overview() to display the state of the app and the user
//   |- synchronizationService.sync()

//   |- $guild.ping() <- CHANGE TO EVENT on user:ready
//   |- $cloud.connect() <- CHANGE TO EVENT on user:ready
//
// NOTES: if a store or service need to be init but does not require of others or clients, just do it on server render
// after init, emit module:ready
// keep firing until all is ready
// importer.client.autosync fired by event
// add imoprter.client.autosync achievements
// until the library and achievements are not synced, do not sync cloud
//
//+-------------------------------------------------

import mitt from 'mitt'
import queueService from '../services/queueService'

let $nuxt = null
let $user = null
let $libs = null
let $data = null
let $game = null
let $guild = null
let $list = null
let $state = null
let $search = null

//+-------------------------------------------------
// handle()
// Handles some callbacks for mitt events
// -----
// Created on Thu Jan 30 2025
//+-------------------------------------------------
function handle(event, payload) {
  switch (event) {
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Application start
    // Calls for stores and services to initialize
    // This is the first event fired by mitt
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'app:start':
      $data ??= useDataStore()
      $user ??= useUserStore()
      $list ??= useListStore()
      $state ??= useStateStore()
      $search ??= useSearchStore()

      Promise.all([$data.init(), $list.init(), $state.init(), $user.authenticate()])
        .then(() => {
          $nuxt.$app.ready = true
          emitter.emit('app:ready')
        })
        .catch((error) => {
          console.error('Error initializing stores and services:', error)
        })

      $search.init()
      apiService.getApiStatus()
      break

    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Application is ready
    // All major services are initialized and ready to be used
    // This event is listened by most components directly
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'app:ready':
      overview()
      synchronizationService.sync()
      if (document?.body && $nuxt.$app.dev) document.body.classList.add('has-debug')
      break

    // User hooks
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'user:ready':
      $nuxt ??= useNuxtApp()
      $libs ??= useLibraryStore()
      $guild ??= useGuildStore()

      $libs.init()
      $nuxt.$sync.connect()
      $nuxt.$app.has.push('user')
      $guild.init('ping')
      break

    // Data hooks
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'data:ready':
      $nuxt ??= useNuxtApp()
      $data ??= useDataStore()

      $data.countLibrary()
      $nuxt.$app.has.push('data')
      break

    case 'data:updated':
      break

    case 'data:deleted':
      $data ??= useDataStore()
      $data.countLibrary()

      queueService.queue('library', 'cloud')
      break

    // A game has been added to the library
    // Similar to data changes but specific to library or owned
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'library:added':
      $data ??= useDataStore()
      $data.countLibrary()
      break

    // A game has changed its state
    case 'state:change':
      $data ??= useDataStore()
      $state ??= useStateStore()

      $data.countLibrary()
      $state.indexLibrary('all')
      break

    // A game dialog is opened
    // case 'game:modal':
    //   break

    // States have been changed
    case 'state:created':
    case 'state:updated':
    case 'state:deleted':
      $state ??= useStateStore()

      $state.load('reload')
      queueService.queue('states', 'cloud')
      break

    // The user data has been updated
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'config:updated':
    case 'account:updated':
      queueService.queue('account', 'cloud')
      break

    // Game events
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // case 'game:modal':
    //   break

    // The game data has been changed
    // Used on game components not tied to scripts
    // case 'game:data':
    //   break

    // Real time events
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    case 'sync:message':
      console.log('Received message:', payload)
      if (payload.event == 'queue') {
        synchronizationService.syncAchievements()
      }
      break

    default:
      break
  }
}

//+-------------------------------------------------
// function()
//
// -----
// Created on Mon Mar 24 2025
//+-------------------------------------------------
function overview() {
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Overview state of the application
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  let state = {
    app: {
      ready: $nuxt.$app.ready,
      dev: $nuxt.$app.dev || $nuxt.$app.wip,
    },

    cron: JSON.parse(JSON.stringify($nuxt.$auth.cron)),

    user: $nuxt.$auth.user,
    config: $nuxt.$auth.config,

    data: {
      count: $nuxt.$app.count,
    },
  }

  log('🗞️ Overview state', state)
}

export default defineNuxtPlugin(() => {
  window.$mitt = emitter

  emitter.on('*', (e, payload) => {
    handle(e, payload)

    const blacklist = ['app:start', 'user:ready', 'data:ready']
    if (blacklist.includes(e)) return
    // log('✨ ' + e, payload)
    // console.info(`🔸 "${e}"`, payload ?? null)
  })

  return {
    provide: {
      mitt: emitter,
    },
  }
})
