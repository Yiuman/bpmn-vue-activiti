import { defineComponent, PropType, reactive, watch, ref, onMounted, toRaw } from 'vue';
import { ElInput, ElTable, ElTableColumn, ElForm, ElFormItem } from 'element-plus';
import { TableProps } from 'element-plus/lib/el-table/src/table.type';
import { TableColumn, SubListState } from './type';
import './sublist.css';
import { SetupContext } from '@vue/runtime-core';

/**
 * 深拷贝
 * @param prototype 原型
 */
const deepCopy = (prototype: any): typeof prototype => {
  return JSON.parse(JSON.stringify(prototype));
};

export default defineComponent({
  props: {
    /**
     * v-model
     */
    modelValue: {
      type: Array,
      default: () => [],
      required: true,
    },
    /**
     * 列的描述信息
     * @see TableColumn
     */
    columns: {
      type: Array as PropType<Array<TableColumn>>,
      required: true,
    },
    /**
     * 原型对象（用于new）
     */
    model: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => Object.assign({}),
    },
    rules: {
      type: Object as PropType<{ [key: string]: Array<ObjectConstructor> }>,
      default: () => null,
    },
    /**
     * 表格的参数
     * @see TableProps
     */
    tableProps: {
      type: Object as PropType<TableProps>,
      default: () => ({
        stripe: true,
        border: true,
        size: 'small',
        'empty-text': '没有数据',
      }),
    },
    /**
     * 添加按钮的标题
     */
    addTitle: {
      type: String as PropType<string>,
      default: () => '+ 添加',
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const sublistState: SubListState<any> = reactive({
      data: props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : [],
      editing: false,
      editItem: null,
      editIndex: undefined,
      isNew: false,
      sublistForm: null,
    });

    // SubList表单
    const form = ref();
    onMounted(() => {
      sublistState.sublistForm = form.value;
    });

    //重置状态
    const restoreState = () => {
      sublistState.data = props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : [];
      sublistState.editing = false;
      sublistState.editItem = undefined;
      sublistState.editIndex = undefined;
      sublistState.isNew = false;
    };

    watch(
      () => props.modelValue,
      () => {
        restoreState();
      },
    );

    /**
     * 添加数据项并进行编辑
     */
    const addData = (): void => {
      sublistState.data.push(deepCopy(props.model));
      sublistState.editIndex = sublistState.data.length - 1;
      sublistState.editing = true;
      sublistState.editItem = deepCopy(deepCopy(props.model));
      sublistState.isNew = true;
    };

    //创建操作列
    const actionColumnProps = buildActionColumnProps(sublistState, ctx);
    return {
      sublistState,
      addData,
      form,
      actionColumnProps,
    };
  },
  render() {
    const props = this.$props;
    const sublistState = this.sublistState;
    const tableProps = JSON.parse(JSON.stringify(props.tableProps));

    const formProps = {
      size: 'mini',
      inline: true,
      'inline-message': true,
      'show-message': true,
      rules: props.rules,
      model: sublistState.editItem,
    };
    return (
      <div class="sublist-div">
        <ElForm ref="form" {...formProps}>
          <ElTable {...tableProps} data={sublistState.data}>
            {props.columns.map((column) => {
              const rawColum = toRaw(column);
              if (sublistState.editing && rawColum.type !== 'index') {
                const editComponentBuilder = rawColum.editComponent || getDefaultEditComponent();
                const slots = {
                  default: (scope: any) => {
                    //获取列的像是方式，如果是正在编辑的行，则使用编辑组件，
                    const cellValue = scope.row[scope.column.property];
                    const getRowColumnValue = () => {
                      return scope.column.formatter
                        ? scope.column.formatter(scope.row, scope.column, cellValue, scope.$index)
                        : cellValue;
                    };

                    return sublistState.editIndex === scope.$index
                      ? editComponentBuilder(scope, sublistState)
                      : getRowColumnValue();
                  },
                };
                return <ElTableColumn v-slots={slots} {...rawColum} />;
              } else {
                // <ElTableColumn {...newColumn} />;
                return <ElTableColumn {...rawColum} />;
              }
            })}
            <ElTableColumn {...this.actionColumnProps} v-slots={this.actionColumnProps.vSlots} />
          </ElTable>
        </ElForm>

        {/*新增按钮*/}
        {!sublistState.editing ? (
          <div class="sublist-add" onClick={() => this.addData()}>
            {props.addTitle}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  },
});

/**
 * 创建执行操作的列（编辑、删除）
 */
const buildActionColumnProps = (state: SubListState<any>, ctx: SetupContext<any>): any => {
  //编辑
  function actionEdit(scope: any): void {
    state.editIndex = scope.$index;
    state.editing = true;
    state.editItem = deepCopy(scope.row);
  }

  //移除
  function actionRemove(index: number): void {
    state?.data?.splice(index, 1);
    ctx.emit('update:modelValue', state.data);
  }

  //确认
  function actionConfirm() {
    state.sublistForm.validate((valid: boolean): void | boolean => {
      if (valid) {
        if (typeof state?.editIndex === 'number') {
          state.data.splice(state?.editIndex, 1, deepCopy(state.editItem));
        }
        state.editIndex = undefined;
        state.editItem = undefined;
        state.editing = false;
        ctx.emit('update:modelValue', state.data);
      } else {
        return false;
      }
    });
  }

  //取消
  function actionCancel() {
    if (state.isNew) {
      state.data.splice(state.data.length - 1, 1);
    }
    state.editItem = undefined;
    state.editing = false;
    state.editIndex = undefined;
  }

  return {
    align: 'center',
    label: '操作',
    vSlots: {
      default: (scope: any) => (
        <div class="sublist-actions">
          {state.editing && scope.$index === state.editIndex ? (
            <div>
              <span class="sublist-confirm sublist-btn" onClick={() => actionConfirm()}>
                确认
              </span>
              <span class="sublist-split">|</span>
              <span class="sublist-cancel sublist-btn" onClick={() => actionCancel()}>
                取消
              </span>
            </div>
          ) : (
            <div>
              <span
                class={`${state.editing ? 'readonly' : ''} sublist-edit sublist-btn`}
                onClick={() => {
                  if (!state.editing) {
                    actionEdit(scope);
                  }
                }}
              >
                编辑
              </span>
              <span class={`${state.editing ? 'readonly' : ''} `}>|</span>
              <span
                class={`${state.editing ? 'readonly' : ''} sublist-delete sublist-btn`}
                onClick={() => {
                  if (!state.editing) {
                    actionRemove(scope.$index);
                  }
                }}
              >
                删除
              </span>
            </div>
          )}
        </div>
      ),
    },
  };
};

/**
 * 默认的编辑组件，ElInput 用于编辑或新增
 */
function getDefaultEditComponent(): (scope: any, state: SubListState<any>) => JSX.Element {
  return function (scope, state) {
    return (
      <ElFormItem
        size="mini"
        class="sublist-form-item"
        label={scope.column.name}
        prop={scope.column.property}
      >
        <ElInput
          label={scope.column.label}
          size="mini"
          v-model={state.editItem[scope.column.property]}
        />
      </ElFormItem>
    );
  };
}
