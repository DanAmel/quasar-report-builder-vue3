<template>
  <span>  <q-btn color="white" flat text-color="black" label="Erreur de chargement" disable />  </span>
</template>

<script>


//Import composants quasar


export default {

  name: "error",

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

