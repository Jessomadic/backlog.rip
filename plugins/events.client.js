/*
 * @file:    \plugins\eventListener.client.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 22nd February 2024
 * Modified: Thu 27 March 2025 - 11:42:53
 */

import { useMagicKeys, whenever } from '@vueuse/core'

let keys = null
let $nuxt = null
let $tree = {
  'game-manager': {
    element: '.game-manager',
    enabled: false,
    emit: 'game:manager',
    payload: 'uuid',
  },
}

//+-------------------------------------------------
// function()
//
// -----
// Created on Thu Mar 21 2024
//+-------------------------------------------------

async function init() {
  if (!$nuxt) $nuxt = useNuxtApp()
  // log('🔅 Registering interface interactions')

  registerMagicKeys()

  document.addEventListener('contextmenu', function (event) {
    console.log('Right-clicked ', event)

    let trigger =
      event.target.closest('.card-game') || event.target.closest('.game--list')
    let attr = trigger?.getAttribute('uuid') || null
    let disabled = trigger?.classList.contains('is-disabled') || false

    if (trigger && attr && !disabled) {
      console.log('Right-clicked on an element with class ".card-game"')

      $nuxt.$mitt.emit('game:manager', {
        $ev: event,
        app: attr,
      })

      event.preventDefault()
    }
  })
}

//+-------------------------------------------------
// register()
// Registers a component with the plugin, so the
// plugin can call the component's methods
// -----
// Created on Thu Mar 21 2024
//+-------------------------------------------------
function register(component, methods) {
  log('🔅 ' + component + ' component registered')
  $tree[component] = methods
}

function registerMagicKeys() {
  keys = useMagicKeys({
    passive: false,
    onEventFired: (e) => {
      if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') e.preventDefault()
      if (e.ctrlKey && e.key === 'p' && e.type === 'keydown') e.preventDefault()
    },
  })

  // Search:palette
  // CTRL + K to open the palette
  // CTRL + P to open the palette
  // ESC to close the palette
  // Arrows to navigate the palette
  //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // whenever(keys['control+K'], () => {
  //   $tree.palette.show()
  // })

  // whenever(keys['control+P'], () => {
  //   $tree.palette.show()
  // })

  // whenever(keys['Escape'], () => {
  //   $tree.palette.hide()
  // })

  // whenever(keys['backspace'], () => {
  //   $tree.palette.back()
  // })

  // whenever(keys['control+K'], () => {
  //   console.log('Control + K pressed')
  // })
}

export default defineNuxtPlugin(() => {
  init()

  $tree.register = register

  window.$ev = $tree
  return {
    provide: {
      ev: $tree,
    },
  }
})
