import { defineComponent, PropType, watch, toRaw, ref } from 'vue';
import { FieldDefine } from '@/components/dynamic-binder/index';

export default defineComponent({
  name: 'DataBinder',
  props: {
    //传进来的源对象，这里需要通过动态组件修改源对象的值进行数据动态绑定
    modelValue: {
      type: Object as PropType<unknown>,
      default: () => Object.assign({}),
      required: true,
    },
    /**
     * 组件的需要绑定数据的定义
     */
    bindKey: {
      type: String,
      required: true,
    },
    fieldDefine: {
      type: Object as PropType<FieldDefine>,
      default: () => ({}),
      required: true,
    },
  },
  emits: ['update:modelValue', 'fieldChange'],
  setup(props, context) {
    const fieldDefine = toRaw(props.fieldDefine);
    const Component = toRaw(fieldDefine.component) as any;
    const rawValue = toRaw(props.modelValue);

    const bindValue = ref(fieldDefine.getValue ? fieldDefine.getValue(rawValue) : rawValue);
    watch(
      () => bindValue.value,
      () => {
        context.emit('update:modelValue', bindValue.value);
      },
    );
    return () => (
      <Component
        v-key={`field-binder-${props.bindKey}`}
        {...fieldDefine}
        v-model={bindValue.value}
        v-slots={fieldDefine.vSlots}
        class={`${Component.name}-${props.bindKey} dynamic-binder-item`}
      />
    );
  },
});
