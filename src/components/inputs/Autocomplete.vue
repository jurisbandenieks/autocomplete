<template>
  <div class="autocomplete">
    <label v-if="label" for="autcomplete" class="autocomplete__label">
      {{ label }}
    </label>
    <input
      v-model="search"
      name="autocomplete"
      type="text"
      class="autocomplete__input"
      :class="{ autocomplete__clearable: clearable }"
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
      <slot name="loading"></slot>
      <li
        v-for="item in items"
        :key="item.id"
        class="autocomplete__result"
        :class="{ 'is-active': item.id === getActiveId }"
        @click="setResult(item)"
      >
        <span>{{ item.label }}</span>
      </li>
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
    label: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showAvatar: {
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
  },

  unmounted() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  computed: {
    getActiveId() {
      return _.get(this.items[this.arrowCounter], "id", null);
    }
  },

  watch: {
    initialSearch(val) {
      if (!this.search && val) {
        this.search = val;
      }
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
      this.search = _.get(val, "label", null);
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
$hl-color: #2196f3;
$width: 100%;

.autocomplete {
  position: relative;
  width: 400px;

  &__label {
    font-size: 12px;
  }

  &__input {
    background: none;
    font-size: 18px;
    padding: 10px 10px 10px 5px;
    margin: 6px 0 0 0;
    display: block;
    width: $width;
    border: none;
    border-radius: 5px;
    border: 1px solid black;
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

  &__clear {
    position: absolute;
    right: 6px;
    top: 0;
    transform: translate(0, 33px);
    cursor: pointer;
  }

  &__clearable {
    padding: 10px 40px 10px 5px;
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
    display: flex;
    align-items: center;
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;

    &.is-active,
    &:hover {
      background-color: #004762;
      color: white;
    }
  }
}
</style>
