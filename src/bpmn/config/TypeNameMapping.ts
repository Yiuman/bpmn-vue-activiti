//流程类型名称匹配
import { ModdleElement } from '../type';

export const ProcessNameMapping = {
  //流程
  'bpmn:Process': '流程',
  //子流程
  'bpmn:SubProcess': '子流程',
};

// 事件名字匹配
export const EventNameMapping = {
  'bpmn:StartEvent': '开始事件',
  'bpmn:EndEvent': '结束事件',
  'bpmn:MessageEventDefinition': '消息',
  'bpmn:TimerEventDefinition': '定时',
  'bpmn:ConditionalEventDefinition': '条件',
  'bpmn:SignalEventDefinition': '信号',
};

//流名称匹配
export const FlowNameMapping = {
  'bpmn:SequenceFlow': (businessObject: ModdleElement) => {
    const defaultName = '顺序流';
    if (businessObject.conditionExpression) {
      return '条件' + defaultName;
    }

    if (businessObject.sourceRef.default) {
      return '默认' + defaultName;
    }

    return defaultName;
  },
};

//网关类型名称匹配
export const GatewayNameMapping = {
  //互斥网关
  'bpmn:ExclusiveGateway': '互斥网关',
  //并行网关
  'bpmn:ParallelGateway': '并行网关',
  //复杂网关
  'bpmn:ComplexGateway': '复杂网关',
  //事件网关
  'bpmn:EventBasedGateway': '事件网关',
};

//任务类型名称匹配
export const TaskNameMapping = {
  //普通任务
  'bpmn:Task': '普通任务',
  //用户任务
  'bpmn:UserTask': '用户任务',
  //接收任务
  'bpmn:ReceiveTask': '接收任务',
  //发送任务
  'bpmn:SendTask': '发送任务',
  //手工任务
  'bpmn:ManualTask': '手工任务',
  //业务规则任务
  'bpmn:BusinessRuleTask': '业务规则任务',
  //服务任务
  'bpmn:ServiceTask': '服务任务',
  //脚本任务
  'bpmn:ScriptTask': '脚本任务',
  //调用任务
  'bpmn:CallActivity': '调用任务',
};

//其他类型名称匹配
export const OtherNameMapping = {
  //池
  'bpmn:Participant': '池/参与者',
  //分组
  'bpmn:Group': '分组',
  //数据存储
  'bpmn:DataStoreReference': '数据存储',
  //数据对象
  'bpmn:DataObjectReference': '数据对象',
};

export const NameMapping: { [key: string]: ((obj: any) => string) | string } = {
  ...ProcessNameMapping,
  ...EventNameMapping,
  ...FlowNameMapping,
  ...GatewayNameMapping,
  ...TaskNameMapping,
  ...OtherNameMapping,
};

/**
 * 根据流程类型节点业务对象解析业务对象节点类型的名称
 * @param businessObject 节点的业务流程对象
 */
export const resolveTypeName = (businessObject: ModdleElement): string => {
  const eventDefinitions = businessObject.eventDefinitions;
  const nameMappingElement = NameMapping[businessObject.$type];
  if (typeof nameMappingElement === 'function') {
    return nameMappingElement(businessObject);
  }
  return eventDefinitions
    ? NameMapping[eventDefinitions[0].$type] + nameMappingElement
    : nameMappingElement;
};
