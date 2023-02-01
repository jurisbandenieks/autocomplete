<template>
  <!-- From vuejs team -->
  <!-- One caveat is that browsers ignore any form of preventing the submit when the form contains only one input element. only god knows why, but that’s how it is. -->
  <!-- <form> -->
  <autocomplete
    v-model="search"
    :items="locations"
    :clearable="true"
    :show-avatar="true"
    :is-object="true"
    key-text="place_id"
    value-text="display_name"
    label="Locations"
    @search-update="getLocations"
    @result-update="setLocation"
  >
    <template v-if="loading" v-slot:loading
      ><li>Loading results...</li>
    </template>
  </autocomplete>
  <!-- </form> -->
</template>

<script>
import Autocomplete from "@/components/inputs/Autocomplete.vue";
import { fetchLocation, fetchLocations } from "@/api";

export default {
  name: "App",
  components: {
    Autocomplete
  },

  data() {
    return {
      search: null,
      locations: [],
      location: {},
      loading: false
    };
  },

  async mounted() {
    // some initial pre-loaded data for example
    try {
      const { data } = await fetchLocation();

      if (data) {
        this.search = data;
      }
    } catch (err) {
      console.error(err);
    }
  },

  methods: {
    async getLocations(inputText) {
      if (inputText) {
        this.loading = true;

        try {
          const { data } = await fetchLocations(inputText);

          if (data && data.length > 0) {
            this.locations = data;
          }
        } catch (err) {
          console.error(err);
        } finally {
          this.loading = false;
        }
      } else {
        this.locations = [];
      }
    },
    setLocation(val) {
      this.location = val;
      console.log("Location ->>", this.location);
    }
  }
};
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
