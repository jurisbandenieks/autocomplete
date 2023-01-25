<template>
  <autocomplete
    :items="locations"
    :loading="loading"
    :initial-search="initialLocation"
    label="Locations"
    @search-update="getLocations"
    @result-update="setLocation"
  />
</template>

<script>
import Autocomplete from "@/components/inputs/Autocomplete.vue";
import { fetchLocations } from "@/api";
import _ from "lodash";

export default {
  name: "App",
  components: {
    Autocomplete
  },

  data() {
    return {
      locations: [],
      location: "",
      initialLocation: "London",
      loading: false
    };
  },

  mounted() {
    if (this.initialLocation) {
      this.getLocations(this.initialLocation);
    }
  },

  methods: {
    async getLocations(inputText) {
      this.loading = true;

      try {
        const { data } = await fetchLocations(inputText);

        if (data && data.length > 0) {
          this.locations = data
            .map((location) => _.get(location, "display_name", null))
            .filter((location) => location);
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
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
$bg-color: #424242;
$hl-color: #2196f3;
$width: 320px;
$trans-time: 300ms;

*,
:before,
:after {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

input {
  background: none;
  font-size: 18px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: $width;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid black;
  &:focus {
    outline: none;
  }
  &:focus ~ label,
  &:valid ~ label {
    top: -14px;
    font-size: 12px;
    color: $hl-color;
  }
  &:focus ~ .bar:before {
    width: $width;
  }
}
</style>
