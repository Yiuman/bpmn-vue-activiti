import {
  CommonGroupProperties,
  BpmnUserGroupProperties,
  FormGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
} from '../common';

const CommonGroupPropertiesArray = [
  CommonGroupProperties,
  FormGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
];

export default {
  //普通任务
  'bpmn:Task': CommonGroupPropertiesArray,
  //用户任务
  'bpmn:UserTask': [
    CommonGroupProperties,
    BpmnUserGroupProperties,
    FormGroupProperties,
    ExtensionGroupProperties,
    DocumentGroupProperties,
  ],
  //接收任务
  'bpmn:ReceiveTask': CommonGroupPropertiesArray,
  //发送任务
  'bpmn:SendTask': CommonGroupPropertiesArray,
  //手工任务
  'bpmn:ManualTask': CommonGroupPropertiesArray,
  //业务规则任务
  'bpmn:BusinessRuleTask': CommonGroupPropertiesArray,
  //服务任务
  'bpmn:ServiceTask': CommonGroupPropertiesArray,
  //脚本任务
  'bpmn:ScriptTask': CommonGroupPropertiesArray,
  //调用任务
  'bpmn:CallActivity': CommonGroupPropertiesArray,
};
