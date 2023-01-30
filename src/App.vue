<template>
  <autocomplete
    :items="locations"
    :initial-search="location"
    :clearable="true"
    :show-avatar="true"
    label="Locations"
    @search-update="getLocations"
    @result-update="setLocation"
  >
    <template v-slot:loading>
      <!-- content for the loading slot -->
      <loading v-if="loading">Loading results...</loading>
    </template>
  </autocomplete>
</template>

<script>
import Autocomplete from "@/components/inputs/Autocomplete.vue";
import { fetchLocations } from "@/api";

export default {
  name: "App",
  components: {
    Autocomplete
  },

  data() {
    return {
      locations: [],
      location: "",
      loading: false
    };
  },

  created() {
    // some initial pre-loaded data for example
    this.location = {
      display_name: "London, Greater London, England, SW1A 2DX, United Kingdom"
    };
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
    setLocation(result) {
      console.log(result);
      this.location = result;
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
