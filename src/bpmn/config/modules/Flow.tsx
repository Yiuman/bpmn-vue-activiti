import { CommonGroupProperties, DocumentGroupProperties } from '../common';

export default {
  //顺序流
  'bpmn:SequenceFlow': [{ ...CommonGroupProperties }, { ...DocumentGroupProperties }],
};
