import { defineComponent, PropType, reactive, toRaw, watchEffect, watch } from 'vue';
import ScriptHelper from '../../utils/script-helper';
import { FieldDefine } from './index';

/**
 * 动态绑定组件
 * 传入源对象及数据绑定的定义，根据组件名动态渲染出组件进行数据绑定
 */
export default defineComponent({
  name: 'DynamicBinder',
  props: {
    //传进来的源对象，这里需要通过动态组件修改源对象的值进行数据动态绑定
    modelValue: {
      type: Object as PropType<any>,
      default: () => Object.assign({}),
      required: true,
    },
    /**
     * 组件的需要绑定数据的定义
     */
    fieldDefine: {
      type: Object as PropType<FieldDefine>,
      default: () => ({}),
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
    const state = reactive({
      flatfieldDefine: flatObject(props.fieldDefine || {}, {}),
      handingModel: Object.assign({}),
    });
    watchEffect(() => (state.handingModel = JSON.parse(JSON.stringify(props.modelValue))));
    watchEffect(() => (state.flatfieldDefine = flatObject(props.fieldDefine, {})));

    const bindTransformer = props.bindTransformer || defaultTransformer;
    //绑定转换函数赋值，然props有则用props的否则用默认的
    const dataBindTransformer = function (key: string, value: any) {
      return bindTransformer(state.handingModel, key, value);
    };

    return () => (
      <div class="dynamic-binder">
        {Object.keys(state.flatfieldDefine).map((key) => {
          const define = state.flatfieldDefine[key];
          const bindData = dataBindTransformer(key, define);

          //组件不能是代理对象，这里直接用目标对象
          const Component = toRaw(define.component);
          console.warn(Component);

          watch(
            () => bindData.value,
            () => {
              state.handingModel[bindData.bindKey] = bindData.value;
              context.emit('update:modelValue', state.handingModel);
              context.emit('fieldChange', bindData.bindKey, bindData.value);
            },
          );
          if (define && predicate(define)) {
            Component.slots = toRaw(bindData.slots);
            return (
              <Component
                {...bindData}
                v-model={bindData.value}
                class={`${Component.name}-${key} dynamic-binder-item`}
              ></Component>
            );
          }
          return null;
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
 * @param target 目标对象
 * @param prefix 前缀
 */
function flatObject(source: FieldDefine, target: FieldDefine, prefix = ''): FieldDefine {
  Object.keys(source).forEach((key) => {
    const currentKeyObj = source[key];
    if (!currentKeyObj || !(typeof currentKeyObj === 'object')) {
      return;
    }
    const component = currentKeyObj.component;
    if (component) {
      target[prefix + key] = currentKeyObj;
    } else {
      flatObject(currentKeyObj, target, `${key}.`);
    }
  });
  return target;
}

/**
 * 断言
 * 若对象中有predicate断言属性，则执行断言 返回true/false
 * 1.若属性为string,则使用脚本处理器执行，如 predicate='obj.a ===1' 则会传入当前对象进行判断；
 * 2.若属性为function，则直接传入目标对象直接执行
 * @param obj 断言的对象
 */
function predicate(obj: FieldDefine): boolean {
  const bindDefinePredicate = obj.predicate;
  if (bindDefinePredicate) {
    if (typeof bindDefinePredicate === 'string') {
      return ScriptHelper.executeEl(obj, bindDefinePredicate);
    }

    if (typeof bindDefinePredicate === 'function') {
      return bindDefinePredicate(obj);
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
function defaultTransformer(sourceModel: any, bindKey: string, bindDefine: any): any {
  return reactive({
    bindKey,
    ...bindDefine,
    sourceModel,
    value: resolve(bindKey, sourceModel) || '',
  });
}

/**
 * 根据路径获取目标对象的值
 * 如:{a:{b:{c:'xxxx'}}} 路径为:a.b.c ,则获取的则为xxxx
 * @param path 对象深度属性路径
 * @param obj 取值的对象
 */
const resolve = (path: string, obj: any) => {
  return path.split('.').reduce(function (prev, curr) {
    return prev ? prev[curr] : null;
  }, obj || self);
};
