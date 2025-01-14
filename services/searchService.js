/*
 * @file:    \services\searchService.js
 * @desc:    ...
 * ----------------------------------------------
 * Created Date: 9th January 2024
 * Modified: Tue 14 January 2025 - 14:14:18
 */

export default {
  //+-------------------------------------------------
  // filter()
  // Filters out apps based on criteria
  // -----
  // Created on Tue Jan 09 2024
  // Updated on Wed Jul 24 2024 - Added fav
  //+-------------------------------------------------
  filter(source, filters) {
    let items = []
    let toSort = []
    let filtered = []

    let now = dates.stamp()
    let re = /(?:^|[ ]):([a-zA-Z]+)/gm
    let searchString = filters?.string?.toLowerCase().replace(re, '').trim()

    for (const index in source) {
      const app = source[index]
      const appName = this.cleanAppName(app.name)

      // ✨ Filter: Backlog state
      // Match with app.state
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters?.states?.length) {
        const { states } = filters

        // Special case: check if -1 is in the states array
        const withNoState = states.includes(-1)

        if (!states.includes(app.state) && !(withNoState && !app.state)) {
          filtered.push(app.uuid)
          continue
        }
      }

      // ✨ App is...
      // Filter apps based on filters.is
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters?.is) {
        if (filters.is == 'favorites' && !app.is?.fav) {
          filtered.push(app.uuid)
          continue
        }

        if (filters.is == 'pinned' && !app.is?.pinned) {
          filtered.push(app.uuid)
          continue
        }

        if (filters.is == 'hidden' && !app.is?.hidden) {
          filtered.push(app.uuid)
          continue
        }
      }

      // ✨ Filter: Hidden games
      // Remove any games hidden
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (app.is?.hidden && filters.is !== 'hidden') {
        filtered.push(app.uuid)
        // console.warn('🛑 Skipping hidden app', app.name, app)
        continue
      }

      // This should be a check "Show only owned games"
      // if (extra?.source == 'library' && filters?.state == null) {
      //   if (!app._?.owned) {
      //     if (logged > 0) {
      //       console.warn('🛑 Skipping because game is not owned', app.name)
      //       logged--
      //     }

      //     continue
      //   }
      // }

      // ✨ Filter: Name
      // Match with on app.name and store IDs
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters?.string?.length > 0) {
        if (
          appName.indexOf(searchString) === -1 &&
          app.id.steam?.toString() !== searchString
        ) {
          // counters.skip++
          // data.hidden.string.push(id.steam)

          filtered.push(app.uuid)
          // console.warn(
          //   '🛑 Skipping: String not found in name',
          //   searchString,
          //   app.name
          // )

          continue
        }
      }

      // ✨ Filter: Genres
      // Include only apps with genres
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters?.genres?.length) {
        if (!app.genres?.some((item) => filters?.genres.includes(item))) {
          filtered.push(app.uuid)
          // console.warn('🛑 Skipping because has not genre', filters.genres, app.genres)

          continue
        }
      }

      // ✨ Sort By: Released at
      // Include only apps with release date
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters?.released > 0 || filters?.sortBy == 'released') {
        if (!app.released_at) {
          filtered.push(app.uuid)
          // console.warn('🛑 Skipping because has no release date', filters.genres, app.genres)

          continue
        }

        if (app.released_at > now) {
          filtered.push(app.uuid)
          // console.warn('🛑 Skipping because released in the future', filters.released, app.released_at

          continue
        }

        if (app.released_at < filters.released) {
          filtered.push(app.uuid)
          // console.warn('🛑 Skipping because released before', filters.released, app.released_at)

          continue
        }
      }

      // ✨ Sort By: HLTB
      // Include only apps with HLTB time
      // Sort by HLTB.main
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters?.sortBy == 'hltb') {
        if (!app.hltb?.main) {
          filtered.push(app.uuid)
          // console.warn('🛑 Skipping because has not genre', filters.genres, app.genres)

          continue
        }
      }

      // ✨ Sort By: Scores
      // Include only apps with data
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (['score', 'metascore', 'steamscore'].includes(filters?.sortBy)) {
        if (filters.sortBy == 'score' && filters.sortDir == 'asc' && !app.score) {
          filtered.push(app.uuid)
          // console.warn('🛑 Skipping because has no score', filters.sortBy, app.score)
          continue
        }

        if (filters.sortBy == 'metascore' && !app.scores.metascore) {
          filtered.push(app.uuid)
          // console.warn('🛑 Skipping because has no metascore', filters.sortBy, app.metascore)
          continue
        }

        if (filters.sortBy == 'steamscore' && !app.scores.steamscore) {
          filtered.push(app.uuid)
          // console.warn('🛑 Skipping because has no steamscore', filters.sortBy, app.steamscore)
          continue
        }
      }

      // Finally,
      // Modify and add the app to items
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      items.push(app.uuid)

      // Index: toSort
      // Create an index of elements to sort
      //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      if (filters?.sortBy == 'rand') {
        toSort.push({ uuid: app.uuid, val: Math.random() })
      }

      if (filters?.sortBy == 'name') {
        toSort.push({ uuid: app.uuid, val: appName || '' })
      }

      if (filters?.sortBy == 'score') {
        toSort.push({ uuid: app.uuid, val: app.score || 0 })
      }

      if (filters.sortBy == 'metascore') {
        toSort.push({ uuid: app.uuid, val: app.scores.metascore || 0 })
      }

      if (filters.sortBy == 'steamscore') {
        toSort.push({ uuid: app.uuid, val: app.scores.steamscore || 0 })
      }

      if (filters?.sortBy == 'released') {
        toSort.push({ uuid: app.uuid, val: app.released_at || 0 })
      }

      if (filters?.sortBy == 'playtime') {
        toSort.push({ uuid: app.uuid, val: app.playtime?.steam || 0 })
      }

      if (filters?.sortBy == 'hltb') {
        toSort.push({ uuid: app.uuid, val: app.hltb?.main || 0 })
      }

      if (!filters?.sortBy || filters?.sortBy == 'user') {
        toSort.push({ uuid: app.uuid })
      }
    }

    // log(
    //   '✅ Filter done (amount, first, data[first])',
    //   items.length,
    //   items[0],
    //   window.db?.d?.[items[0]]
    // )

    let sorted = this.sort(toSort, filters)

    return {
      items: sorted,
      results: items.length,
      filtered: filtered.length,
    }
  },

  //+-------------------------------------------------
  // sort()
  // Sorts the items based on the sortBy criteria
  // -----
  // Created on Wed Jan 10 2024
  //+-------------------------------------------------
  sort(items, filters) {
    const { sortBy, sortDir } = filters
    // log('⇢ Sorting by', sortBy, sortDir)

    // SortBy: name
    // Using app.name
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (filters?.sortBy == 'name') {
      return items
        .sort((a, b) => {
          const A = a.val || ''
          const B = b.val || ''
          const compare = A.localeCompare(B)
          return filters?.sortDir === 'desc' ? -compare : compare
        })
        .map((item) => item.uuid)
    }

    // SortBy: numeric value
    // Using app.playtime // score // rand
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (
      [
        'rand',
        'hltb',
        'score',
        'metascore',
        'steamscore',
        'playtime',
        'released',
      ].includes(sortBy)
    ) {
      return items
        .sort((a, b) => {
          const A = a.val || 0
          const B = b.val || 0
          return filters?.sortDir === 'desc' ? B - A : A - B
        })
        .map((item) => item.uuid)
    }

    // SortBy: user
    // Just return the items
    //+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return items.map((item) => item.uuid)
  },

  //+-------------------------------------------------
  // paginate()
  //
  // -----
  // Created on Mon Feb 12 2024
  //+-------------------------------------------------
  paginate(items, options) {
    if (!options) return items

    if (!items || items.length == 0) return []

    const { page, perPage } = options
    const start = (page - 1) * perPage
    const end = start + perPage

    return items.slice(0, end)
  },

  //+-------------------------------------------------
  // makeHash()
  // Generates an unique hash to identify a search instance
  // -----
  // Created on Sun Jan 05 2025
  //+-------------------------------------------------
  makeHash(source, filters) {
    if (source.type == 'array') return null

    let f = {
      string: filters.string,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      released: filters.released,
      genres: filters.genres,
      states: filters.states,
    }

    let json = JSON.stringify(f)
    let base = btoa(json)
    let hash = source.type + '#' + Object.keys(source.apps).length + ':' + base

    return hash
  },

  //+-------------------------------------------------
  // searchHash()
  // Sanitizes and creates a hash for the search to API
  // -----
  // Created on Wed May 01 2024
  // Created on Tue Jan 14 2025 - Moved to searchService
  //+-------------------------------------------------
  makeApiHash(f = {}) {
    f.string = f.string?.trim()

    let emptyString = !f.string || f.string?.length < 3
    let dirty = ['genres', 'anotherArrayProperty'].some(
      (prop) => Array.isArray(f[prop]) && f[prop].length > 0
    )

    if (f.sortBy == 'rand') return null
    if (f.sortBy == 'score' && f.sortDir == 'desc' && emptyString && !dirty) return null
    if (f.sortBy == 'playtime' && emptyString) return null

    delete f.is
    delete f.mods
    delete f.show
    delete f.source
    delete f.states

    if (emptyString) delete f.string
    if (!f.released) delete f.released
    if (f.genres?.length == 0) delete f.genres

    const json = JSON.stringify(f)
    const slug = btoa(json)
    const hash = 'API' + ':' + slug

    return { hash, slug, json }
  },

  //+-------------------------------------------------
  // cleanAppName()
  // Returns a clean app name
  // -----
  // Created on Wed Jan 08 2025
  //+-------------------------------------------------
  cleanAppName(name) {
    let appName = name ? name : ''
    appName = appName.toString().toLowerCase()
    appName = appName.trim()

    // Characters to remove
    // prettier-ignore
    let chars = [
      '(', ')', '[', ']', '{', '}', '|', ':', '"',
      "'", '<', '>', '!', '?', ',', ';'
    ]

    for (const char of chars) {
      appName = appName.replace(char, '')
    }

    return appName
  },

  //+-------------------------------------------------
  // visibleProps()
  // Returns a an array of properties for game items
  // based on the user selection and the sortBy
  // -----
  // Created on Tue Dec 31 2024
  //+-------------------------------------------------
  visibleProps(filters) {
    let selected = JSON.parse(JSON.stringify(filters?.show?.card ?? []))

    if (selected.length == 1 && selected.includes('default')) {
      selected.push(filters.sortBy)
    }

    return selected
  },

  //+-------------------------------------------------
  // calcNextPage()
  // Calcs the amount of games that will be shown in the next page
  // -----
  // Created on Thu Jan 09 2025
  //+-------------------------------------------------
  calcNextPage(filters, results) {
    if (!filters.show) return 0

    const { page, perPage } = filters.show
    const start = page * perPage
    return Math.min(perPage, results - start)
  },

  //+-------------------------------------------------
  // calcShowing()
  // Calcs the amount of games being shown
  // -----
  // Created on Thu Jan 09 2025
  //+-------------------------------------------------
  calcShowing(filters, results) {
    if (!filters.show) return 0

    const { page, perPage } = filters.show
    const start = page * perPage
    return Math.min(start + perPage, results)
  },
}
