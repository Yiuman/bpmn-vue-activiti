import { Component } from 'vue';
import DynamicBinder from './DynamicBinder';

/**
 * 绑定的定义
 */
export interface FieldDefine extends Map {
  //用于断言此绑定的组件是否是否显示
  predicate?: string | ((obj: any) => boolean);
  component?: string | Component | JSX.Element;
  //获取value的值,根据绑定的对象获取对象的值
  getValue?: (sourceObject: any) => any;
  setValue?: (sourceObject: any, key: string, value: any) => void | (() => void);
}

export interface Map {
  [key: string]: any;

  [index: number]: any;
}

export default DynamicBinder;
