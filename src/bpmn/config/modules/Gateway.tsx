import { CommonGroupProperties, DocumentGroupProperties } from '../common';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };
export default {
  //互斥网关
  'bpmn:ExclusiveGateway': [idAndName, documentation],
  //并行网关
  'bpmn:ParallelGateway': [idAndName, documentation],
  //复杂网关
  'bpmn:ComplexGateway': [idAndName, documentation],
  //事件网关
  'bpmn:EventBasedGateway': [idAndName, documentation],
};
