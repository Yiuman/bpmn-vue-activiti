import {
  CommonGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
} from '../common';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };
const extensionProperties = { ...ExtensionGroupProperties };
export default {
  //互斥网关
  'bpmn:ExclusiveGateway': [idAndName, extensionProperties, documentation],
  //并行网关
  'bpmn:ParallelGateway': [idAndName, extensionProperties, documentation],
  //复杂网关
  'bpmn:ComplexGateway': [idAndName, extensionProperties, documentation],
  //事件网关
  'bpmn:EventBasedGateway': [idAndName, extensionProperties, documentation],
};
