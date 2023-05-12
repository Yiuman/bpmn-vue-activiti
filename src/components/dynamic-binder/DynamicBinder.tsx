import { defineComponent, PropType, reactive, toRaw, watch, ref } from 'vue';
import ScriptHelper, { resolve } from '../../utils/script-helper';
import { FieldDefine } from './index';
import DataBinder from './DataBinder';
import { PropertiesMap } from '@/bpmn/config';

/**
 * 动态绑定组件
 * 传入源对象及数据绑定的定义，根据组件名动态渲染出组件进行数据绑定
 */
export default defineComponent({
  name: 'DynamicBinder',
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
    fieldDefineProps: {
      type: Object as PropType<PropertiesMap<FieldDefine>>,
      required: true,
    },
    //绑定数据的转换器
    bindTransformer: {
      type: Function,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'fieldChange'],
  setup(props, context) {
    const flatFieldDefine = flatObject(props.fieldDefineProps);
    // const state = reactive({
    //   flatFieldDefine: flatObject(props.fieldDefine || {}, {}),
    //   handingModel: Object.assign({}),
    // });
    // watchEffect(() => {
    //   state.handingModel = props.modelValue;
    //   state.flatFieldDefine = flatObject(props.fieldDefine, {});
    // });

    //绑定转换函数赋值，然props有则用props的否则用默认的
    // const bindTransformer = props.bindTransformer || defaultTransformer;
    // const dataBindTransformer = function (key: string, value: unknown) {
    //   return bindTransformer(props.modelValue, key, value);
    // };
    const rawModelValue = toRaw(props.modelValue);
    const bindDataMap: PropertiesMap<any> = {};
    Object.keys(flatFieldDefine).forEach((key) => {
      const define = flatFieldDefine[key];
      const valueRef = ref(
        define.getValue ? define.getValue(rawModelValue) : resolve(key, props.modelValue) || '',
      );
      bindDataMap[key] = valueRef;

      watch(
        () => valueRef.value,
        () => {
          //如果有setValue还是则直接使用独立的setValue
          if (define.setValue) {
            //setValue有返回值，值进行赋值后执行
            const setValueCallBack = define.setValue(rawModelValue, key, valueRef.value);
            if (setValueCallBack) {
              setValueCallBack();
            }
          } else {
            context.emit('fieldChange', key, valueRef.value);
          }
        },
      );
    });

    return () => (
      <div class="dynamic-binder">
        {Object.keys(flatFieldDefine).map((key) => {
          const define = flatFieldDefine[key];
          return (
            <DataBinder
              bindKey={key}
              fieldDefine={define}
              v-model={bindDataMap[key].value}
              v-if={predicate(define, rawModelValue)}
            />
          );

          // if (define && predicate(define, toRaw(props.modelValue))) {
          //   const bindData = dataBindTransformer(key, define);
          //   //组件不能是代理对象，这里直接用目标对象
          //   const Component = toRaw(define.component);
          //
          //   watch(
          //     () => bindData.value,
          //     () => {
          //       // state.handingModel[bindData.bindKey] = bindData.value;
          //       context.emit('update:modelValue', state.handingModel);
          //
          //       //如果有setValue还是则直接使用独立的setValue
          //       if (bindData.setValue) {
          //         //setValue有返回值，值进行赋值后执行
          //         const setValueCallBack = bindData.setValue(
          //           toRaw(props.modelValue),
          //           bindData.bindKey,
          //           bindData.value,
          //         );
          //         if (setValueCallBack) {
          //           setValueCallBack();
          //         }
          //       } else {
          //         context.emit('fieldChange', bindData.bindKey, bindData.value);
          //       }
          //     },
          //   );
          //
          //   return (
          //     <Component
          //       {...bindData}
          //       v-model={bindData.value}
          //       v-slots={bindData.vSlots}
          //       class={`${Component.name}-${key} dynamic-binder-item`}
          //     />
          //   );
          // }
          // return null;
        })}
      </div>
    );
  },
});

/**
 * 将对象结构扁平化
 * 例如：
 *
 const obj = {
                    a: {
                    b: {
                    c: 'xxx',
                },
                },
                };
 出来的对象会变成，{a.b.c:'xxx'}
 *
 * @param source 源对象
 * @param prefix 前缀
 */
function flatObject(source: PropertiesMap<FieldDefine>, prefix = ''): FieldDefine {
  const result: FieldDefine = {};
  Object.keys(source).forEach((key) => {
    const currentKeyObj = source[key];
    if (!currentKeyObj || !(typeof currentKeyObj === 'object')) {
      return;
    }
    const component = currentKeyObj.component;
    if (component) {
      result[prefix + key] = currentKeyObj;
    } else {
      flatObject(currentKeyObj, `${key}.`);
    }
  });
  return result;
}

/**
 * 断言
 * 若对象中有predicate断言属性，则执行断言 返回true/false
 * 1.若属性为string,则使用脚本处理器执行，如 predicate='obj.a ===1' 则会传入当前对象进行判断；
 * 2.若属性为function，则直接传入目标对象直接执行
 * @param fieldDefine 断言的对象
 * @param modelValue 模式值
 */
function predicate(fieldDefine: FieldDefine, modelValue: unknown): boolean {
  const bindDefinePredicate = fieldDefine.predicate;
  if (bindDefinePredicate) {
    if (typeof bindDefinePredicate === 'string') {
      return ScriptHelper.executeEl(modelValue, bindDefinePredicate) as boolean;
    }

    if (typeof bindDefinePredicate === 'function') {
      return bindDefinePredicate(modelValue);
    }
  }
  return true;
}

/**
 * 默认的转换函数
 * @param sourceModel 源模型对象
 * @param bindKey 绑定数据的Key
 * @param bindDefine 绑定定义
 */
function defaultTransformer(
  sourceModel: unknown,
  bindKey: string,
  bindDefine: FieldDefine,
): unknown {
  return reactive({
    bindKey,
    ...bindDefine,
    sourceModel,
    value: bindDefine.getValue
      ? bindDefine.getValue(toRaw(sourceModel))
      : resolve(bindKey, sourceModel) || '',
  });
}
