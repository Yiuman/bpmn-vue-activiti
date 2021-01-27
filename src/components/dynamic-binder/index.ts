import DynamicBinder from './DynamicBinder';

/**
 * 绑定的定义
 */
export interface FieldDefine extends Map {
  //用于断言此绑定的组件是否是否显示
  predicate?: string | ((obj: any) => boolean);
}

export interface Map {
  [key: string]: any;
  [index: number]: any;
}
export default DynamicBinder;
