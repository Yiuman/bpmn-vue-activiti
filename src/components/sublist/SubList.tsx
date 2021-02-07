import { defineComponent, PropType, reactive } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';
import { TableColumnCtx, TableProps } from 'element-plus/lib/el-table/src/table.type';
import './sublist.css';

/**
 * 创建执行操作的列（编辑、删除）
 */
const buildActionColumnProps = (): any => {
  return {
    align: 'center',
    vSlots: {
      header: () => '操作',
      default: () => (
        <div class="sublist-actions">
          <span class="sublist-edit">编辑</span>
          <span>|</span>
          <span class="sublist-delete">删除</span>
        </div>
      ),
    },
  };
};

const deepCopy = (prototype: any): any => {
  return JSON.parse(JSON.stringify(prototype));
};

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => [],
      required: true,
    },
    columns: {
      type: Array as PropType<Array<TableColumnCtx>>,
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
  setup(props, context) {
    const extensionState = reactive({
      data: JSON.parse(JSON.stringify(props.modelValue)),
      editing: false,
      activeIndex: null,
    });
    // watch(
    //   () => extensionState.data,
    //   () => {
    //     context.emit('update:modelValue', extensionState.data);
    //   },
    // );
    const tableProps = JSON.parse(JSON.stringify(props.tableProps));
    const actionColumnProps = buildActionColumnProps();
    const vSlot = context.slots;
    const DefaultSlot = vSlot.default;

    const addData = (): void => {
      extensionState.data.push(deepCopy(props.model));
    };
    return () => (
      <div class="sublist-div">
        <ElTable {...tableProps} data={extensionState.data}>
          {props.columns.map((column) => {
            return <ElTableColumn {...column} />;
          })}
          <ElTableColumn {...actionColumnProps} v-slots={actionColumnProps.vSlots} />
        </ElTable>
        {DefaultSlot ? <DefaultSlot /> : ''}
        <div class="sublist-add" onClick={() => addData()}>
          {props.addTitle}
        </div>
      </div>
    );
  },
});
