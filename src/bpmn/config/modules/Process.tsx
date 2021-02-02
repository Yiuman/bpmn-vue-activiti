import { CommonGroupProperties, DocumentGroupProperties } from '../common';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };
export default {
  //流程
  'bpmn:Process': [idAndName, documentation],
  //子流程
  'bpmn:SubProcess': [idAndName, documentation],
};
