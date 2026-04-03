<template>
  <div :class="selectClass" :style="fieldStyle">
    <div class="e-field__control">
      <EMenu
        v-model="opened"
        full-width
        hold-focus
        check-offset
        :color="resolvedMenuColor"
        :close-on-content-click="false"
        aria-haspopup="listbox"
        :aria-controls="listboxId"
        content-role="presentation"
      >
        <template #activator="{ ref: activatorRef }">
          <div
            class="e-field__slot"
            :ref="activatorRef"
            @click="handleSelectSlotClick"
          >
            <div
              v-if="prependIcon"
              class="e-field__prepend-inner"
              aria-hidden="true"
              @click="handleClickPrependIcon"
            >
              <div class="e-field__icon e-field__icon--prepend-inner">
                <EIcon :icon="prependIcon" />
              </div>
            </div>
            <div class="e-field__overlay" aria-hidden="true"></div>
            <div
              class="e-select__slot e-field__field"
              @click="focusInput"
              @mouseenter="handleHover(true)"
              @mouseleave="handleHover(false)"
            >
              <label
                v-if="mounted"
                :for="id"
                :class="[
                  'e-label',
                  {
                    'e-label--floating': isLabelFloating,
                    'e-label--floated': shouldFloatSelectLabel,
                  },
                ]"
                :style="labelStyle"
              >
                <slot name="label"> {{ label }}</slot>
              </label>
              <div
                v-if="prefix"
                class="e-field__prefix"
                aria-hidden="true"
                @click="focus"
              >
                {{ prefix }}
              </div>
              <div
                class="e-select__selections e-field--selection-controls  e-field__field-control"
              >
                <div
                  v-if="showPlaceholderSelection"
                  class="e-select__selection"
                  :style="selectionStyle"
                >
                  <span class="e-select__selection-placeholder">
                    {{ resolvedPlaceholder }}
                  </span>
                </div>
                <template v-else-if="multiple && chip">
                  <div
                    v-for="(itemValue, index) in selectedItems"
                    class="e-select__selection"
                    :key="index"
                    :style="selectionStyle"
                  >
                    <slot
                      name="selection"
                      :selection="selectionItem(itemValue)"
                      :attrs="selectionAttrs(itemValue)"
                    >
                      <EChip
                        v-if="chip"
                        :closable="true"
                        :clickable="isSelectedChipIndex(index)"
                        :selected="isSelectedChipIndex(index)"
                        @click:close="handleItemClick(selectionItem(itemValue))"
                        :color="color"
                      >
                        {{ selectedText(itemValue) }}
                      </EChip>
                    </slot>
                  </div>
                </template>
                <div
                  v-else-if="multiple"
                  class="e-select__selection e-select__selection--text"
                  :style="selectionStyle"
                >
                  <span
                    class="e-select__selection-text"
                    :title="multipleSelectedText"
                  >
                    {{ multipleSelectedText }}
                  </span>
                </div>
                <div
                  v-else-if="!empty"
                  class="e-select__selection"
                  :style="selectionStyle"
                >
                  <slot
                    name="selection"
                    :selection="selectionItem()"
                    :attrs="selectionAttrs()"
                  >
                    <EChip
                      v-if="chip"
                      :closable="chipClosable"
                      :color="color"
                      @click:close="changeValue(null)"
                    >
                      {{ selectedText() }}
                    </EChip>
                    <span v-else>{{ selectedText() }}</span>
                  </slot>
                </div>
                <input
                  ref="input"
                  :value="search"
                  :id="id"
                  :readonly="inputReadonly"
                  :disabled="isDisabled"
                  class="input--text"
                  type="text"
                  role="combobox"
                  :aria-autocomplete="ariaAutocomplete"
                  :aria-controls="listboxId"
                  :aria-activedescendant="activeDescendantId"
                  :aria-expanded="opened"
                  :aria-invalid="hasError"
                  :aria-describedby="detailsId"
                  :aria-disabled="isDisabled"
                  :aria-readonly="inputReadonly"
                  :placeholder="resolvedPlaceholder"
                  autocomplete="off"
                  @blur="handleSelectBlur"
                  @focus="handleSelectFocus"
                  @input="changeSearchValue($event, true)"
                  @keydown="handleInputKeydown"
                />
              </div>

              <div
                v-if="suffix"
                class="e-field__suffix"
                aria-hidden="true"
                @click="focus"
              >
                {{ suffix }}
              </div>
              <transition name="scale">
                <div v-if="!empty && clearable" class="e-field__append-inner">
                  <div
                    class="e-field__icon e-field__icon--clear e-icon--size-default"
                  >
                    <EButton
                      text
                      :icon="icon.clear"
                      size="small"
                      aria-label="Clear selection"
                      @click.stop.prevent="clear"
                    />
                  </div>
                </div>
              </transition>
              <div class="e-field__append-inner" aria-hidden="true">
                <div class="e-field__icon e-field__icon--append">
                  <EIcon
                    :icon="arrowDown || icon.arrowDown"
                    class="flip-icon"
                    :color="color"
                  ></EIcon>
                </div>
              </div>
            </div>

            <div
              v-if="appendIcon"
              class="e-field__append-inner"
              @click="handleClickAppendIcon"
            >
              <div class="e-field__icon e-field__icon--append">
                <EIcon :icon="appendIcon" />
              </div>
            </div>
            <div
              v-if="!outlined"
              :style="lineStyle"
              class="e-field__line"
            ></div>

            <EProgressLinear
              v-if="loading"
              :color="color"
              :indeterminate="loading"
              height="3"
            />
          </div>
        </template>

        <div class="e-select__menu-content">
          <e-list
            :id="listboxId"
            role="listbox"
            :model-value="props.multiple ? multipleListModel : undefined"
            :aria-label="listAriaLabel"
            :style="listStyle"
          >
            <template v-for="(item, index) in items">
              <slot
                name="item"
                :attrs="slotItemAttrs(item, index)"
                :item="item"
              >
                <e-list-item
                  v-bind="slotItemAttrs(item, index)"
                  active-class="e-list-item--active"
                  :isActive="active(item)"
                  :key="index"
                  :value="getListItemValue(item)"
                >
                  {{ displayedText(item) }}
                </e-list-item>
              </slot>
            </template>
          </e-list>
        </div>
      </EMenu>
      <EDetails
        :id="detailsId"
        :details="details"
        :hasError="hasError"
        :showDetails="showDetails"
      ></EDetails>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "Select" };
</script>
<script lang="ts" setup>
import type {
  SelectEmits,
  SelectItemObject,
  SelectItemType,
  SelectModelValue,
  SelectProps,
} from "@/types";
import icon from "@/utils/icons";
import { useFieldActions } from "@/composables/field-actions";
import { useGridCol } from "@/composables/grid-col";
import { useField } from "@/composables/field";
import { useUtils } from "@/composables/utils";

import { computed, nextTick, ref, watch } from "vue";

import EButton from "@/components/button/index.vue";
import EIcon from "@/components/icon/index.vue";
import EDetails from "@/components/form/details.vue";
import EChip from "@/components/chip/index.vue";
import EList from "@/components/list/index.vue";
import EListItem from "@/components/list/item.vue";
import EMenu from "@/components/menu/index.vue";
import EProgressLinear from "@/components/progress/linear.vue";

const emit = defineEmits<SelectEmits>();

const input = ref<HTMLInputElement | null>(null);

const props = withDefaults(defineProps<SelectProps>(), {
  itemText: "text",
  itemValue: "value",
  inputAlign: "start",
  itemCol: 1,
});
const opened = ref<boolean>(false);
const {
  fieldClass,
  fieldStyle,
  id,
  focused,
  focus,
  blur,
  showDetails,
  color,
  mounted,
  details,
  labelStyle,
  handleHover,
  handleBlur,
  handleFocus,
  validate,
  reset,
  resetValidation,
  hasError,
  isDisabled,
  isLabelFloating,
  shouldFloatLabel,
} = useField();
const { handleClickPrependIcon, handleClickAppendIcon } = useFieldActions({
  emit,
  focus,
});
const { gridColClass } = useGridCol(props);
const { isObject } = useUtils();

const isItemObject = (value: unknown): value is SelectItemObject =>
  isObject(value);

const getItemValue = (
  item: SelectItemType | SelectModelValue | undefined,
): SelectItemType | undefined => {
  if (!isItemObject(item)) return item as SelectItemType | undefined;
  return item[props.itemValue] as SelectItemType | undefined;
};

const getItemText = (item: SelectItemType | undefined): string => {
  if (!isItemObject(item)) {
    return item == null ? "" : String(item);
  }

  const result = item[props.itemText];
  return result == null ? "" : String(result);
};

const getListItemValue = (
  item: SelectItemType,
): string | number | undefined => {
  const value = getItemValue(item) ?? item;
  return typeof value === "string" || typeof value === "number"
    ? value
    : undefined;
};

watch(
  () => props.items,
  () => {
    syncHighlightedIndex();
  },
  { deep: true },
);

watch(
  () => opened.value,
  async (value: boolean) => {
    if (!value) {
      highlightedIndex.value = -1;
      if (props.autocomplete && hasSearchValue.value) {
        setSearchValue("", false);
      }
      return;
    }

    focus();
    syncHighlightedIndex();
    await scrollHighlightedOptionIntoView();
  },
);

watch(
  () => props.loading,
  (val: boolean) => {
    if (val) closeMenu();
    else {
      opened.value = true;
      focusInput();
    }
  },
);

const lineStyle = computed(() => {
  return props.lineWidth
    ? { "--v-field-border-width": `${props.lineWidth}px` }
    : {};
});

const resolvedMenuColor = computed(() => {
  return props.menuColor ?? color.value;
});

const selectClass = computed(() => {
  const result = [...fieldClass.value, "e-select", ...gridColClass.value];
  opened.value && result.push("e-select--is-open");
  shouldFloatSelectLabel.value && result.push("e-field--label-floated");
  props.itemCol && result.push("e-select--columns-variant");
  props.multiple && result.push("e-select--multiple");
  props.chip && result.push("e-select--chip");
  props.autocomplete && result.push("e-select--autocomplete");
  props.loading && result.push("e-select--loading");
  return result;
});

const inputReadonly = computed((): boolean => {
  if (!props.autocomplete) return true;
  if (!props.multiple) return !empty.value;
  return false;
});

const listboxId = computed((): string => `${id}-listbox`);

const detailsId = computed((): string | undefined => {
  return showDetails.value ? `${id}-details` : undefined;
});

const listAriaLabel = computed((): string | undefined => {
  const value = props.label ?? props.placeholder;
  return value == null ? undefined : String(value);
});

const ariaAutocomplete = computed((): "list" | "none" => {
  return props.autocomplete ? "list" : "none";
});

const hasSearchValue = computed((): boolean => {
  return `${props.search ?? ""}`.length > 0;
});

const shouldFloatSelectLabel = computed((): boolean => {
  return (
    isLabelFloating.value &&
    (focused.value || hasSearchValue.value || !empty.value)
  );
});

const resolvedPlaceholder = computed(() => {
  if (!props.placeholder) return undefined;
  if (!isLabelFloating.value) return props.placeholder;

  return shouldFloatSelectLabel.value ? props.placeholder : undefined;
});

const hasObjectItems = computed((): boolean => isItemObject(props.items[0]));

const selectedItems = computed<Array<SelectItemType>>(() => {
  return props.multiple
    ? (props.modelValue as Array<SelectItemType>) || []
    : [];
});

watch(selectedItems, (items) => {
  if (items.length === 0) {
    clearSelectedChip();
    return;
  }

  if (selectedChipIndex.value >= items.length) {
    selectedChipIndex.value = items.length - 1;
  }
});

const selectedChipIndex = ref<number>(-1);

const highlightedIndex = ref<number>(-1);

const multipleModel = computed<Array<SelectItemType>>(() => {
  return props.multiple ? [...selectedItems.value] : [];
});

const multipleListModel = computed<Array<string | number>>(() => {
  return multipleModel.value
    .map((item) => getListItemValue(item))
    .filter(
      (value): value is string | number =>
        typeof value === "string" || typeof value === "number",
    );
});

const isSearchEmpty = computed((): boolean => {
  return `${props.search ?? ""}`.length === 0;
});

const areSameItems = (left: SelectItemType, right: SelectItemType): boolean => {
  return JSON.stringify(left) === JSON.stringify(right);
};

const getComparableValue = (
  item: SelectItemType | SelectModelValue | undefined,
): SelectItemType | undefined => {
  return props.returnObject
    ? getItemValue(item)
    : (getItemValue(item) ?? (item as SelectItemType | undefined));
};

const getEmittedItemValue = (item: SelectItemType): SelectItemType => {
  if (props.returnObject || !isItemObject(item)) return item;
  return getItemValue(item) as SelectItemType;
};

const findSelectedIndex = (
  items: Array<SelectItemType>,
  item: SelectItemType,
): number => {
  if (isItemObject(item)) {
    if (props.returnObject) {
      return items.findIndex((candidate) => areSameItems(candidate, item));
    }

    const comparableValue = getComparableValue(item);
    return items.findIndex((candidate) => candidate === comparableValue);
  }

  return items.findIndex((candidate) => candidate === item);
};

const getOptionId = (index: number): string => `${id}-option-${index}`;

const activeDescendantId = computed((): string | undefined => {
  if (!opened.value || highlightedIndex.value < 0) return undefined;
  return getOptionId(highlightedIndex.value);
});

const findHighlightedIndex = (): number => {
  if (props.items.length === 0) return -1;

  const selectedIndex = props.items.findIndex((item) => active(item));
  return selectedIndex >= 0 ? selectedIndex : 0;
};

const syncHighlightedIndex = (): void => {
  highlightedIndex.value = findHighlightedIndex();
};

const scrollHighlightedOptionIntoView = async (): Promise<void> => {
  if (highlightedIndex.value < 0) return;

  await nextTick();
  const option = document.getElementById(getOptionId(highlightedIndex.value));
  option?.scrollIntoView({ block: "nearest" });
};

const moveHighlightedIndex = async (step: number): Promise<void> => {
  if (!props.items.length) return;

  if (!opened.value) {
    openMenu();
  }

  if (highlightedIndex.value < 0) {
    highlightedIndex.value = findHighlightedIndex();
  } else {
    highlightedIndex.value = Math.min(
      props.items.length - 1,
      Math.max(0, highlightedIndex.value + step),
    );
  }

  await scrollHighlightedOptionIntoView();
};

const setHighlightedBoundary = async (
  position: "first" | "last",
): Promise<void> => {
  if (!props.items.length) return;

  openMenu();
  highlightedIndex.value = position === "first" ? 0 : props.items.length - 1;
  await scrollHighlightedOptionIntoView();
};

const clearSelectedChip = (): void => {
  selectedChipIndex.value = -1;
};

const isSelectedChipIndex = (index: number): boolean => {
  return selectedChipIndex.value === index;
};

const selectLastChip = (): boolean => {
  if (
    !props.multiple ||
    !props.chip ||
    !selectedItems.value.length ||
    !isSearchEmpty.value
  ) {
    return false;
  }

  selectedChipIndex.value = selectedItems.value.length - 1;
  return true;
};

const removeSelectedChip = (): boolean => {
  if (
    !props.multiple ||
    selectedChipIndex.value < 0 ||
    selectedChipIndex.value >= selectedItems.value.length
  ) {
    return false;
  }

  handleItemClick(selectedItems.value[selectedChipIndex.value]);
  clearSelectedChip();
  focusInput();
  return true;
};

const selectionAttrs = (item?: SelectItemType) => {
  const chipIndex = item ? findSelectedIndex(selectedItems.value, item) : -1;
  const attrs: Record<string, unknown> = {
    closable: Boolean(props.chip && (props.chipClosable || props.multiple)),
    clickable: chipIndex >= 0 ? isSelectedChipIndex(chipIndex) : undefined,
    selected: chipIndex >= 0 ? isSelectedChipIndex(chipIndex) : undefined,
  };

  if (item) {
    attrs["onClick:close"] = () => handleItemClick(selectionItem(item));
  } else {
    attrs["onClick:close"] = () => changeValue(null);
  }
  return attrs;
};

const selectionItem = (value?: SelectItemType): SelectItemType => {
  let item: SelectItemType | undefined;
  const localValue = value || props.modelValue;

  if (props.returnObject) {
    const compareItem = getComparableValue(localValue);
    item = props.items.find(
      (candidate) => getComparableValue(candidate) === compareItem,
    );
  } else if (hasObjectItems.value) {
    item = props.items.find(
      (candidate) => getComparableValue(candidate) == localValue,
    );
  } else {
    item = props.items.find((candidate) => candidate === localValue);
  }

  return item || (isItemObject(localValue) ? localValue : {});
};

const handleSelectFocus = (event: FocusEvent): void => {
  opened.value = true;
  handleFocus(event);
};

const handleSelectBlur = (event: Event): void => {
  clearSelectedChip();
  handleBlur(event);
};

const focusInput = (): void => {
  input.value?.focus();
};

const empty = computed((): boolean => {
  if (props.multiple) {
    return (props.modelValue as Array<SelectItemType>)?.length === 0;
  }
  return (
    props.modelValue === undefined ||
    props.modelValue === null ||
    props.modelValue === ""
  );
});

const showPlaceholderSelection = computed((): boolean => {
  return (
    empty.value && !props.autocomplete && Boolean(resolvedPlaceholder.value)
  );
});

const slotItemAttrs = (
  item: SelectItemType,
  index: number,
): Record<string, unknown> => {
  const attrs: Record<string, unknown> = {};
  attrs.class = {
    "e-list-item--active": active(item),
    "e-select__option--highlighted": index === highlightedIndex.value,
  };
  attrs.value = getListItemValue(item);
  attrs.id = getOptionId(index);
  attrs.onClick = () => handleItemClick(item);
  attrs.key = index;
  return attrs;
};

const getEventInputValue = (value: Event): string => {
  return (value.target as HTMLInputElement | null)?.value || "";
};

const setSearchValue = (value: string | number, openMenu = true): void => {
  clearSelectedChip();

  if (props.autocomplete && openMenu) {
    opened.value = true;
  }

  emit("update:search", value);
};

const changeSearchValue = (
  value: Event | string | number,
  isEvent = false,
): void => {
  const valueResult: string | number =
    isEvent || value instanceof Event
      ? getEventInputValue(value as Event)
      : value;

  setSearchValue(valueResult);
};

const openMenu = (): void => {
  if (props.disabled || props.readonly || props.loading) return;
  opened.value = true;
};

const closeMenu = (): void => {
  opened.value = false;
  focused.value = false;
  clearSelectedChip();
};
const displayedText = (item: SelectItemType): string => {
  return getItemText(item);
};
const changeValue = (
  value: Event | SelectModelValue | undefined,
  isEvent = false,
) => {
  const valueResult: SelectModelValue = isEvent
    ? getEventInputValue(value as Event)
    : (value as SelectModelValue);
  emit("update:modelValue", valueResult);
};

const handleItemClick = (item: SelectItemType): void => {
  clearSelectedChip();

  if (props.autocomplete) changeSearchValue("");

  if (props.multiple) {
    const result: Array<SelectItemType> = [...multipleModel.value];
    const index = findSelectedIndex(result, item);
    const value = getEmittedItemValue(item);
    index < 0 ? result.push(value) : result.splice(index, 1);
    changeValue(result);
    syncHighlightedIndex();
    return;
  }

  changeValue(getEmittedItemValue(item));
  closeMenu();
};

const selectHighlightedItem = (): void => {
  if (
    highlightedIndex.value < 0 ||
    highlightedIndex.value >= props.items.length
  )
    return;
  handleItemClick(props.items[highlightedIndex.value]);
};

const active = (item: SelectItemType): boolean => {
  if (props.multiple) {
    return findSelectedIndex(multipleModel.value, item) !== -1;
  }

  if (!isItemObject(item)) {
    return item === props.modelValue;
  }

  if (props.returnObject) {
    return JSON.stringify(item) === JSON.stringify(props.modelValue);
  }

  return getComparableValue(item) === props.modelValue;
};

const selectedText = (itemValue?: SelectItemType): string => {
  if (empty.value) {
    return "";
  }

  return getItemText(selectionItem(itemValue));
};

const multipleSelectedText = computed((): string => {
  return selectedItems.value
    .map((itemValue) => selectedText(itemValue))
    .filter((value) => value.length > 0)
    .join(", ");
});

const selectionStyle = computed((): Record<string, string> => {
  return { textAlign: props.inputAlign };
});

const listStyle = computed((): Record<string, string> => {
  const col = `${props.itemCol}`;
  const percent = (1 / parseInt(col, 10)) * 100;
  return { "--list-item-percent": `${percent}%`, "--list-item-col": col };
});

const clear = (): void => {
  clearSelectedChip();
  changeValue(props.multiple ? [] : undefined);
  changeSearchValue("");
  emit("click:clear");
  openMenu();
  focusInput();
};

const handleSelectSlotClick = (evt: Event): void => {
  evt.stopPropagation();
  clearSelectedChip();
  openMenu();
  focusInput();
};

const handleInputKeydown = async (evt: KeyboardEvent): Promise<void> => {
  if (
    evt.key === "Backspace" &&
    props.multiple &&
    props.chip &&
    isSearchEmpty.value
  ) {
    evt.preventDefault();

    if (selectedChipIndex.value >= 0) {
      removeSelectedChip();
    } else {
      selectLastChip();
    }

    return;
  }

  if (evt.key === "Escape") {
    evt.preventDefault();
    closeMenu();
    return;
  }

  if (evt.key === "Tab") {
    closeMenu();
    return;
  }

  if (evt.key === "ArrowDown") {
    evt.preventDefault();
    clearSelectedChip();
    await moveHighlightedIndex(1);
    return;
  }

  if (evt.key === "ArrowUp") {
    evt.preventDefault();
    clearSelectedChip();
    await moveHighlightedIndex(-1);
    return;
  }

  if (evt.key === "Home") {
    evt.preventDefault();
    clearSelectedChip();
    await setHighlightedBoundary("first");
    return;
  }

  if (evt.key === "End") {
    evt.preventDefault();
    clearSelectedChip();
    await setHighlightedBoundary("last");
    return;
  }

  if (evt.key === "Enter") {
    evt.preventDefault();
    clearSelectedChip();

    if (!opened.value) {
      openMenu();
      return;
    }

    selectHighlightedItem();
    return;
  }

  if (evt.key === " " && inputReadonly.value) {
    evt.preventDefault();
    clearSelectedChip();
    openMenu();
  }
};

defineExpose({
  focus,
  blur,
  validate,
  reset,
  resetValidation,
  input,
});
</script>
<style lang="scss" src="./style.scss"></style>
