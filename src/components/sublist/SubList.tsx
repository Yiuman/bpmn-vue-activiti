import { defineComponent, PropType, reactive } from 'vue';
import { ElInput, ElTable, ElTableColumn } from 'element-plus';
import { TableProps } from 'element-plus/lib/el-table/src/table.type';
import { TableColumn, SubListState } from './type';
import './sublist.css';

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
  function actionEdit(scope: any): void {
    state.editIndex = scope.$index;
    state.editing = true;
    state.editItem = deepCopy(scope.row);
  }

  function actionRemove(index: number): void {
    state?.data?.splice(index, 1);
  }

  function actionConfirm() {
    if (typeof state?.editIndex === 'number') {
      state.data.splice(state?.editIndex, 1, deepCopy(state.editItem));
    }
    state.editIndex = undefined;
    state.editItem = undefined;
    state.editing = false;
  }

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
    modelValue: {
      type: Array,
      default: () => [],
      required: true,
    },
    columns: {
      type: Array as PropType<Array<TableColumn>>,
      required: true,
    },
    model: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => Object.assign({}),
    },
    tableProps: {
      type: Object as PropType<TableProps>,
      default: () => Object.assign({}),
    },
    addTitle: {
      type: String as PropType<string>,
      default: () => '+ 添加',
    },
    activeItem: {
      type: Object as PropType<{ [key: string]: unknown }>,
      default: () => Object.assign({}),
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
