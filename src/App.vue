<template>
  <!-- From vuejs team -->
  <!-- One caveat is that browsers ignore any form of preventing the submit when the form contains only one input element. only god knows why, but that’s how it is. -->
  <form @submit.prevent="handleSubmit()">
    <autocomplete
      :initial-search="initialSearch"
      :items="locations"
      :clearable="true"
      :show-avatar="true"
      label="Locations"
      @search-update="getLocations"
      @result-update="(e) => (location = e)"
    >
      <template v-if="loading" v-slot:loading
        ><li>Loading results...</li>
      </template>
    </autocomplete>
  </form>
</template>

<script>
import _ from "lodash";
import Autocomplete from "@/components/inputs/Autocomplete.vue";
import { fetchLocation, fetchLocations } from "@/api";

export default {
  name: "App",
  components: {
    Autocomplete
  },

  data() {
    return {
      initialSearch: "",
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
        this.initialSearch = _.get(data, "display_name", "");
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
          const data = await fetchLocations(inputText);

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
    handleSubmit() {
      console.log("Subitting ->>", this.location);
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
