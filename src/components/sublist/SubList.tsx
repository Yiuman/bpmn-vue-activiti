import { defineComponent, PropType, reactive, watch } from 'vue';
import { ElInput, ElTable, ElTableColumn } from 'element-plus';
import { TableProps } from 'element-plus/lib/el-table/src/table.type';
import { TableColumn, SubListState } from './type';
import './sublist.css';
import _default from 'ant-design-vue/es/color-picker';

/**
 * 深拷贝
 * @param prototype 原型
 */
const deepCopy = (prototype: any): typeof prototype => {
  return JSON.parse(JSON.stringify(prototype));
};

/**
 * 创建执行操作的列（编辑、删除）
 */
const buildActionColumnProps = (state: SubListState<any>): any => {
  //编辑
  function actionEdit(scope: any): void {
    state.editIndex = scope.$index;
    state.editing = true;
    state.editItem = deepCopy(scope.row);
  }

  //移除
  function actionRemove(index: number): void {
    state?.data?.splice(index, 1);
  }

  //确认
  function actionConfirm() {
    if (typeof state?.editIndex === 'number') {
      state.data.splice(state?.editIndex, 1, deepCopy(state.editItem));
    }
    state.editIndex = undefined;
    state.editItem = undefined;
    state.editing = false;
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
              <span>|</span>
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
    /**
     * 表格的参数
     * @see TableProps
     */
    tableProps: {
      type: Object as PropType<TableProps>,
      default: () => Object.assign({}),
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
  setup(props) {
    const sublistState: SubListState<unknown> = reactive({
      data: props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : [],
      editing: false,
      editItem: undefined,
      editIndex: undefined,
      isNew: false,
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

    const tableProps = JSON.parse(JSON.stringify(props.tableProps));
    const actionColumnProps = buildActionColumnProps(sublistState);

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
    return () => (
      <div class="sublist-div">
        <ElTable {...tableProps} data={sublistState.data} v-slots={{ empty: () => '没有数据' }}>
          {props.columns.map((column) => {
            if (sublistState.editing && column.type !== 'index') {
              const editComponentBuilder =
                column.editComponent || getDefaultEditComponent(sublistState);
              const slots = {
                default: (scope: any) => {
                  return sublistState.editIndex === scope.$index
                    ? editComponentBuilder(scope)
                    : scope.row[scope.column.property];
                },
              };
              return <ElTableColumn v-slots={slots} {...column} />;
            } else {
              return <ElTableColumn {...column} />;
            }
          })}
          <ElTableColumn {...actionColumnProps} v-slots={actionColumnProps.vSlots} />
        </ElTable>
        {!sublistState.editing ? (
          <div class="sublist-add" onClick={() => addData()}>
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
 * 默认的编辑组件，ElInput 用于编辑或新增
 * @param state SubList状态管理
 */
function getDefaultEditComponent(state: SubListState<any>): (scope: any) => JSX.Element {
  return function (scope) {
    return (
      <ElInput
        label={scope.column.label}
        size="mini"
        v-model={state.editItem[scope.column.property]}
      />
    );
  };
}
