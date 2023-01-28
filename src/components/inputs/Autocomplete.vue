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
    <span
      v-if="clearable"
      class="material-symbols-outlined autocomplete__clear"
      @click.stop="onClear()"
    >
      close
    </span>
    <ul v-show="isOpen && items" class="autocomplete__results">
      <li v-if="loading" class="loading">Loading results...</li>
      <template v-else>
        <li
          v-for="item in items"
          :key="item.place_id"
          class="autocomplete__result"
          :class="{ 'is-active': item.place_id === getActiveId }"
          @click="setResult(item)"
        >
          {{ item.display_name }}
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
      type: Object,
      default: () => {
        return {};
      }
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
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      search: "",
      result: null,
      isOpen: false,
      arrowCounter: -1
    };
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);

    if (this.initialSearch) {
      this.search = this.initialSearch.display_name;
    }
  },

  unmounted() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  computed: {
    getActiveId() {
      return _.get(this.items[this.arrowCounter], "place_id", null);
    }
  },

  methods: {
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.arrowCounter = -1;
        this.isOpen = false;
      }
    },

    // debounce to optimize API calls
    onChange: _.debounce(function () {
      this.$emit("search-update", this.search);

      if (this.search) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    }, 500),

    setResult(val) {
      this.search = _.get(val, "display_name", null);
      this.isOpen = false;
      this.$emit("result-update", val);
    },

    // Keyboard actions
    onArrowDown() {
      if (this.arrowCounter < this.items.length - 1) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },

    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },

    onEnter() {
      const search = this.items[this.arrowCounter];
      this.setResult(search);
      this.arrowCounter = -1;
    },

    onClear() {
      this.setResult(null);
    }
  }
};
</script>

<style scoped lang="scss">
.autocomplete {
  position: relative;
  width: 400px;

  &__clear {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(-30px, 30px);
    cursor: pointer;
  }

  &__results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    min-height: 12px;
    overflow: auto;
  }

  &__result {
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
}
</style>
