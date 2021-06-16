import { ElAutocomplete } from 'element-plus';
import { defineComponent, PropType, computed, toRaw } from 'vue';
import '../prefix-label-select/prefix-label-select.css';

/**
 * 带前缀Label的AutoComplete
 */
const PrefixAutoComplete = defineComponent({
  props: {
    ...ElAutocomplete.props,
    prefixTitle: {
      type: String as PropType<string>,
      default: () => '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const computedModelValue = computed({
      get: () => props.value,
      set: (val) => ctx.emit('update:modelValue', val),
    });
    return () => (
      <div class="prefix-label-select-container">
        {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}
        <ElAutocomplete
          class="prefix-label-select"
          v-model={computedModelValue.value}
          {...props}
          v-slots={toRaw(ctx.slots)}
        />
      </div>
    );
  },
});

export default PrefixAutoComplete;
