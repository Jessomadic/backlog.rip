<template>
  <div class="row g-2 align-items-center">
    <div class="col">
      <h3>Your account</h3>
    </div>
  </div>

  <ul class="nav nav-pills nav-vertical">
    <!--

      <li>Account history</li>

      <li>Give Feedback</li>

      <li>---</li> -->
    <li class="nav-item">
      <NuxtLink
        to="/account/me"
        class="nav-link"
        :style="
          $route.path.includes('me') ? 'color: var(--tblr-nav-link-hover-color); ' : ''
        ">
        <Icon class="me-2">Fingerprint</Icon>
        Your account
      </NuxtLink>
    </li>

    <li class="nav-item">
      <NuxtLink
        to="/account/preferences"
        class="nav-link"
        :style="
          $route.path.includes('preferences')
            ? 'color: var(--tblr-nav-link-hover-color); '
            : ''
        ">
        <Icon class="me-2">Settings</Icon>
        Preferences
      </NuxtLink>
    </li>

    <li v-if="$app.wip" class="nav-item">
      <NuxtLink
        to="/account/community"
        class="nav-link"
        :style="
          $route.path.includes('community')
            ? 'color: var(--tblr-nav-link-hover-color); '
            : ''
        ">
        <Icon class="me-2">Components</Icon>
        Community
      </NuxtLink>
    </li>

    <li class="nav-item">
      <NuxtLink
        to="/account/cloud"
        class="nav-link"
        :style="
          isCloud
            ? 'color: var(--tblr-nav-link-hover-color); padding-bottom: 0.25rem;'
            : ''
        ">
        <Icon class="me-2">CloudRain</Icon>
        Cloud sync
      </NuxtLink>
    </li>

    <template v-if="isCloud">
      <li>
        <a href="#settings" class="nav-link ms-2 pb-0">
          <Icon size="6" width="1" class="me-2">PointFilled</Icon>
          Cloud settings
        </a>
      </li>

      <li>
        <a href="#status" class="nav-link ms-2 pb-0">
          <Icon size="6" width="1" class="me-2">PointFilled</Icon>
          Synchronization status
        </a>
      </li>
      <li>
        <a href="#quota" class="nav-link ms-2">
          <Icon size="6" width="1" class="me-2">PointFilled</Icon>
          Used quota
        </a>
      </li>
    </template>

    <li class="nav-item">
      <NuxtLink to="/account/linked" class="nav-link">
        <Icon class="me-2">LayersIntersect</Icon>
        Integrations
      </NuxtLink>
    </li>

    <!-- <li class="nav-item">
      <NuxtLink to="/account/history" class="nav-link">
        <Icon class="me-2">Clock</Icon>
        history
      </NuxtLink>
    </li> -->
  </ul>

  <div class="hr-text">※※※</div>

  <div class="row g-2 align-items-center">
    <div class="col">
      <h3>Your data</h3>
    </div>
  </div>

  <ul class="nav nav-pills nav-vertical">
    <li class="nav-item">
      <NuxtLink
        to="/account/lists"
        class="nav-link"
        :style="
          $route.path.includes('lists')
            ? 'color: var(--tblr-nav-link-hover-color); padding-bottom: 0.25rem;'
            : ''
        ">
        <Icon class="me-2">Mist</Icon>
        Lists
      </NuxtLink>
    </li>

    <template v-if="$route.path.includes('lists')">
      <li @click.prevent="$mitt.emit('list:create')">
        <a href="#" class="nav-link ms-2">
          <Icon size="14" width="1" class="me-2">SquareRoundedPlus</Icon>
          Create a new list
        </a>
      </li>
    </template>

    <li class="nav-item">
      <NuxtLink to="/account/states" class="nav-link">
        <Icon class="me-2">Background</Icon>
        States
      </NuxtLink>
    </li>

    <li class="nav-item">
      <NuxtLink to="/account/database" class="nav-link">
        <Icon class="me-2">Database</Icon>
        Database
      </NuxtLink>
    </li>

    <li v-if="$app.dev" class="nav-item">
      <NuxtLink to="/account/logs" class="nav-link">
        <Icon class="me-2">Bug</Icon>
        Application logs
      </NuxtLink>
    </li>
    <!-- <li class="nav-item">
        <a
          href="#menu-base"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Getting started
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-base" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/getting-started.html" class="nav-link">Getting Started</a>
          </li>
          <li class="nav-item">
            <a href="../docs/download.html" class="nav-link">Download</a>
          </li>
          <li class="nav-item">
            <a href="../docs/browser-support.html" class="nav-link">Browser Support</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-content"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Content
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-content" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/colors.html" class="nav-link">Colors</a>
          </li>
          <li class="nav-item">
            <a href="../docs/typography.html" class="nav-link">Typography</a>
          </li>
          <li class="nav-item">
            <a href="../docs/icons.html" class="nav-link">Icons</a>
          </li>
          <li class="nav-item">
            <a href="../docs/customize.html" class="nav-link">Customize Tabler</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-layout"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Layout
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-layout" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/page-headers.html" class="nav-link">Page headers</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-forms"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Form components
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-forms" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/form-elements.html" class="nav-link">Form elements</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-helpers.html" class="nav-link">Form helpers</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-validation.html" class="nav-link">Validation states</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-image-check.html" class="nav-link">Image check</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-color-check.html" class="nav-link">Color check</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-selectboxes.html" class="nav-link">Form selectboxes</a>
          </li>
          <li class="nav-item">
            <a href="../docs/form-fieldset.html" class="nav-link">Form fieldset</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-components"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Components
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-components" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/alerts.html" class="nav-link">Alerts</a>
          </li>
          <li class="nav-item">
            <a href="../docs/avatars.html" class="nav-link">Avatars</a>
          </li>
          <li class="nav-item">
            <a href="../docs/badges.html" class="nav-link">Badges</a>
          </li>
          <li class="nav-item">
            <a href="../docs/breadcrumb.html" class="nav-link">Breadcrumb</a>
          </li>
          <li class="nav-item">
            <a href="../docs/buttons.html" class="nav-link">Buttons</a>
          </li>
          <li class="nav-item">
            <a href="../docs/cards.html" class="nav-link">Cards</a>
          </li>
          <li class="nav-item">
            <a href="../docs/carousel.html" class="nav-link">Carousel</a>
          </li>
          <li class="nav-item">
            <a href="../docs/datagrid.html" class="nav-link">Data grid</a>
          </li>
          <li class="nav-item">
            <a href="../docs/dropdowns.html" class="nav-link">Dropdowns</a>
          </li>
          <li class="nav-item">
            <a href="../docs/divider.html" class="nav-link">Divider</a>
          </li>
          <li class="nav-item">
            <a href="../docs/empty.html" class="nav-link">Empty states</a>
          </li>
          <li class="nav-item">
            <a href="../docs/modals.html" class="nav-link">Modals</a>
          </li>
          <li class="nav-item">
            <a href="../docs/page-headers.html" class="nav-link">Page headers</a>
          </li>
          <li class="nav-item">
            <a href="../docs/progress.html" class="nav-link">Progress</a>
          </li>
          <li class="nav-item">
            <a href="../docs/range-slider.html" class="nav-link">Range slider</a>
          </li>
          <li class="nav-item">
            <a href="../docs/ribbons.html" class="nav-link">Ribbons</a>
          </li>
          <li class="nav-item">
            <a href="../docs/placeholder.html" class="nav-link">Placeholder</a>
          </li>
          <li class="nav-item">
            <a href="../docs/spinners.html" class="nav-link">Spinners</a>
          </li>
          <li class="nav-item">
            <a href="../docs/statuses.html" class="nav-link">Statuses</a>
          </li>
          <li class="nav-item">
            <a href="../docs/steps.html" class="nav-link">Steps</a>
          </li>
          <li class="nav-item">
            <a href="../docs/switch-icon.html" class="nav-link">Switch icon</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tables.html" class="nav-link">Tables</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tabs.html" class="nav-link">Tabs</a>
          </li>
          <li class="nav-item">
            <a href="../docs/timelines.html" class="nav-link">Timelines</a>
          </li>
          <li class="nav-item">
            <a href="../docs/toasts.html" class="nav-link">Toasts</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tracking.html" class="nav-link">Tracking</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tooltips.html" class="nav-link">Tooltips</a>
          </li>
          <li class="nav-item">
            <a href="../docs/popover.html" class="nav-link">Popover</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-utils"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Utilities
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-utils" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/borders.html" class="nav-link">Borders</a>
          </li>
          <li class="nav-item">
            <a href="../docs/cursors.html" class="nav-link">Cursors</a>
          </li>
          <li class="nav-item">
            <a href="../docs/interactions.html" class="nav-link">Interactions</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a
          href="#menu-plugins"
          class="nav-link"
          data-bs-toggle="collapse"
          aria-expanded="false">
          Plugins
          <span class="nav-link-toggle"></span>
        </a>
        <ul id="menu-plugins" class="nav nav-pills collapse">
          <li class="nav-item">
            <a href="../docs/autosize.html" class="nav-link">Autosize</a>
          </li>
          <li class="nav-item">
            <a href="../docs/input-mask.html" class="nav-link">Form input mask</a>
          </li>
          <li class="nav-item">
            <a href="../docs/flags.html" class="nav-link">Flags</a>
          </li>
          <li class="nav-item">
            <a href="../docs/payments.html" class="nav-link">Payments</a>
          </li>
          <li class="nav-item">
            <a href="../docs/charts.html" class="nav-link">Charts</a>
          </li>
          <li class="nav-item">
            <a href="../docs/dropzone.html" class="nav-link">Dropzone</a>
          </li>
          <li class="nav-item">
            <a href="../docs/inline-player.html" class="nav-link">Inline player</a>
          </li>
          <li class="nav-item">
            <a href="../docs/tinymce.html" class="nav-link">TinyMCE</a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a href="../changelog.html" class="nav-link">
          Changelog
          <span class="badge bg-primary-lt ms-auto">1.0.0-beta16</span>
        </a>
      </li> -->
  </ul>
</template>

<script>
export default {
  name: 'AccountSidebar',

  data() {
    return {}
  },

  computed: {
    isCloud() {
      return this.$route.path.includes('cloud') && this.$auth.hasCloud
    },
  },

  methods: {},
}
</script>
