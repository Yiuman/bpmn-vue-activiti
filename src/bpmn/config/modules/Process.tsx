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
  //流程
  'bpmn:Process': CommonGroupPropertiesArray,
  //子流程
  'bpmn:SubProcess': CommonGroupPropertiesArray,
};
