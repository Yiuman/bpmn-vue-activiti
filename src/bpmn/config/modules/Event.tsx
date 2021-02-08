import {
  CommonGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
} from '../common';

const CommonGroupPropertiesArray = [
  CommonGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
];

export default {
  //开始事件、消息开始事件、定时开始事件、条件开始事件（这些都属于开始事件bpmn:StartEvent）
  'bpmn:StartEvent': CommonGroupPropertiesArray,
  //结束事件，也包含类似开始事件的所有结束事件
  'bpmn:EndEvent': CommonGroupPropertiesArray,
  //中间抛出事件（包含：消息抛出、升级抛出、链接抛出、补偿抛出、信号抛出等）
  'bpmn:IntermediateThrowEvent': CommonGroupPropertiesArray,
  //中间捕获事件（包含：小心捕获、定时捕获、条件捕获、信号捕获等）
  'bpmn:IntermediateCatchEvent': CommonGroupPropertiesArray,
};
