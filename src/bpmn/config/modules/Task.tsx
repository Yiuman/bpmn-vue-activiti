import {
  CommonGroupProperties,
  BpmnUserGroupProperties,
  FormGroupProperties,
  DocumentGroupProperties,
} from '../common';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };

export default {
  //普通任务
  'bpmn:Task': [idAndName, FormGroupProperties, documentation],
  //用户任务
  'bpmn:UserTask': [idAndName, { ...BpmnUserGroupProperties }, FormGroupProperties, documentation],
  //接收任务
  'bpmn:ReceiveTask': [idAndName, FormGroupProperties, documentation],
  //发送任务
  'bpmn:SendTask': [idAndName, FormGroupProperties, documentation],
  //手工任务
  'bpmn:ManualTask': [idAndName, FormGroupProperties, documentation],
  //业务规则任务
  'bpmn:BusinessRuleTask': [idAndName, FormGroupProperties, documentation],
  //服务任务
  'bpmn:ServiceTask': [idAndName, FormGroupProperties, documentation],
  //脚本任务
  'bpmn:ScriptTask': [idAndName, FormGroupProperties, documentation],
  //调用任务
  'bpmn:CallActivity': [idAndName, FormGroupProperties, documentation],
};
