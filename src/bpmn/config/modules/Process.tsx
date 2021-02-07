import {
  CommonGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
} from '../common';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };
const extensionProperties = { ...ExtensionGroupProperties };
export default {
  //流程
  'bpmn:Process': [idAndName, extensionProperties, documentation],
  //子流程
  'bpmn:SubProcess': [idAndName, extensionProperties, documentation],
};
