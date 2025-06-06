/*
 * @file:    \plugins\tippy.js
 * @desc:    ...
 * -------------------------------------------
 * Created Date: 16th December 2023
 * Modified: Wed 09 April 2025 - 12:18:21
 */

import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/svg-arrow.css'
// import 'tippy.js/dist/backdrop.css'

import 'tippy.js/animations/shift-away.css'
import 'tippy.js/animations/shift-away-subtle.css'
import 'tippy.js/animations/shift-away-extreme.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/animations/scale-subtle.css'
import 'tippy.js/animations/scale-extreme.css'

import 'tippy.js/themes/material.css'
import 'tippy.js/themes/translucent.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTippy, {
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
    defaultProps: {
      arrow: false,

      animateFill: false,
      theme: 'material',
      // theme: 'translucent',

      animation: 'shift-away',
    },
    flipDuration: 0,
  })
})
