import {
  CommonGroupProperties,
  BpmnUserGroupProperties,
  FormGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
} from '../common';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };
const extensionProperties = { ...ExtensionGroupProperties };
export default {
  //普通任务
  'bpmn:Task': [idAndName, FormGroupProperties, extensionProperties, documentation],
  //用户任务
  'bpmn:UserTask': [
    idAndName,
    { ...BpmnUserGroupProperties },
    FormGroupProperties,
    extensionProperties,
    documentation,
  ],
  //接收任务
  'bpmn:ReceiveTask': [idAndName, FormGroupProperties, extensionProperties, documentation],
  //发送任务
  'bpmn:SendTask': [idAndName, FormGroupProperties, extensionProperties, documentation],
  //手工任务
  'bpmn:ManualTask': [idAndName, FormGroupProperties, extensionProperties, documentation],
  //业务规则任务
  'bpmn:BusinessRuleTask': [idAndName, FormGroupProperties, extensionProperties, documentation],
  //服务任务
  'bpmn:ServiceTask': [idAndName, FormGroupProperties, extensionProperties, documentation],
  //脚本任务
  'bpmn:ScriptTask': [idAndName, FormGroupProperties, extensionProperties, documentation],
  //调用任务
  'bpmn:CallActivity': [idAndName, FormGroupProperties, extensionProperties, documentation],
};
