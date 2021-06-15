import { TableColumnCtx } from 'element-plus/lib/el-table/src/table-column/defaults';

/**
 * 状态
 */
export interface SubListState<T> {
  data: Array<T>;
  editing: boolean;
  editItem: T | undefined | null;
  editIndex: number | undefined;
  isNew: boolean;
  sublistForm: any | null;
}

/**
 * 扩展的的可编辑列
 */
export interface TableColumn extends TableColumnCtx<any> {
  editComponent?: (scope: any | undefined | null) => JSX.Element;
}
