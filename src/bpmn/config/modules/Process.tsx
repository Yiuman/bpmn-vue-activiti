import {
  CommonGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
  getElementTypeListenerProperties,
} from '../common';

//流程数据属性配置数组
const ProcessGroupPropertiesArray = [
  CommonGroupProperties,
  /**
   * 监听器组
   */
  getElementTypeListenerProperties({
    name: '全局监听器',
  }),
  ExtensionGroupProperties,
  DocumentGroupProperties,
];

export default {
  //流程
  'bpmn:Process': ProcessGroupPropertiesArray,
  //子流程
  'bpmn:SubProcess': ProcessGroupPropertiesArray,
  //转运
  'bpmn:Transaction': ProcessGroupPropertiesArray,
};
