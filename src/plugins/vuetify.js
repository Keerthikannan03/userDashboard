import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
    ssr: true,
  components,
  directives,
})

export default vuetify;
