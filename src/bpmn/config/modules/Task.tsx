import { CommonGroupProperties, BpmnUserGroupProperties, DocumentGroupProperties } from '../common';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };

export default {
  //普通任务
  'bpmn:Task': [idAndName, documentation],
  //用户任务
  'bpmn:UserTask': [idAndName, { ...BpmnUserGroupProperties }, documentation],
  //发送任务
  'bpmn:SendTask': [idAndName, documentation],
  //手工任务
  'bpmn:ManualTask': [idAndName, documentation],
  //业务规则任务
  'bpmn:BusinessRuleTask': [idAndName, documentation],
  //服务任务
  'bpmn:ServiceTask': [idAndName, documentation],
  //脚本任务
  'bpmn:ScriptTask': [idAndName, documentation],
  //调用任务
  'bpmn:CallActivity': [idAndName, documentation],
};
