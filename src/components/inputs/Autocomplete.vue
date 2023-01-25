<template>
  <div class="autocomplete">
    <label v-if="label" for="autcomplete">{{ label }}</label>
    <input
      name="autocomplete"
      type="text"
      v-model="search"
      @input="onChange"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
    />
    <ul v-show="isOpen && items" class="autocomplete-results">
      <li v-if="loading" class="loading">Loading results...</li>
      <template v-else>
        <li
          v-for="(result, i) in results"
          :key="result"
          class="autocomplete-result"
          :class="{ 'is-active': i === arrowCounter }"
          @click="setResult(result)"
        >
          {{ result }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "AutocompleteInput",

  props: {
    initialSearch: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      search: "",
      result: null,
      results: [],
      isOpen: false,
      arrowCounter: -1
    };
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);

    if (this.initialSearch) {
      this.search = this.initialSearch;
      this.isOpen = true;
    }
  },

  unmounted() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  watch: {
    items(value) {
      this.results = value;
    }
  },

  methods: {
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.arrowCounter = -1;
        this.isOpen = false;
      }
    },

    filterResults() {
      this.results = this.items.filter(
        (item) => item.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      );
    },

    onChange: _.debounce(function () {
      if (this.search) {
        this.$emit("search-update", this.search);
        this.filterResults();
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    }, 500),

    setResult(val) {
      this.search = val;
      this.isOpen = false;
      this.$emit("result-update", val);
    },

    onArrowDown() {
      if (this.arrowCounter < this.results.length - 1) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },

    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },

    onEnter() {
      const search = this.results[this.arrowCounter];
      this.setResult(search);
      this.arrowCounter = -1;
    }
  }
};
</script>

<style scoped lang="scss">
.autocomplete {
  position: relative;
  width: 400px;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 12px;
  overflow: auto;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;

  &.is-active,
  &:hover {
    background-color: #4aae9b;
    color: white;
  }
}
</style>
