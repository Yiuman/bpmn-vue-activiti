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
  //互斥网关
  'bpmn:ExclusiveGateway': CommonGroupPropertiesArray,
  //并行网关
  'bpmn:ParallelGateway': CommonGroupPropertiesArray,
  //复杂网关
  'bpmn:ComplexGateway': CommonGroupPropertiesArray,
  //事件网关
  'bpmn:EventBasedGateway': CommonGroupPropertiesArray,
  //相容网关
  'bpmn:InclusiveGateway': CommonGroupPropertiesArray,
};
