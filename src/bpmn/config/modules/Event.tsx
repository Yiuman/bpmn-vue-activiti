import {
  CommonGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
} from '../common';

const idAndName = { ...CommonGroupProperties };
const document = { ...DocumentGroupProperties };
const extensionProperties = { ...ExtensionGroupProperties };

export default {
  //开始事件、消息开始事件、定时开始事件、条件开始事件（这些都属于开始事件bpmn:StartEvent）
  'bpmn:StartEvent': [idAndName, extensionProperties, document],
  //结束事件，也包含类似开始事件的所有结束事件
  'bpmn:EndEvent': [idAndName, extensionProperties, document],
  //中间抛出事件（包含：消息抛出、升级抛出、链接抛出、补偿抛出、信号抛出等）
  'bpmn:IntermediateThrowEvent': [idAndName, extensionProperties, document],
  //中间捕获事件（包含：小心捕获、定时捕获、条件捕获、信号捕获等）
  'bpmn:IntermediateCatchEvent': [idAndName, extensionProperties, document],
};
