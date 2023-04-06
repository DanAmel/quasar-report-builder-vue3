<template>
  <span>  <q-spinner-ios color="primary" size="2em"/> </span>
</template>

<script>

import {QSpinnerIos} from 'quasar'

export default {

  name: "LoadingComponent",
  // eslint-disable-next-line vue/no-unused-components
  components: {
   QSpinnerIos
  },

  async preFetch({store, currentRoute, previousRoute, redirect, ssrContext}) {
  },
  mixins: [],

  data() {
    return {
    }
  },

  computed: {

  },

  async mounted() {

  },

}
</script>

