import { ElInput } from 'element-plus';
import { GroupProperties } from '../index';
import { CommonGroupProperties } from '../common';
/**
 * 用户任务属性配置
 */
const BpmnUserTaskGroupPropertis: GroupProperties = {
  name: '人员设置',
  icon: 'el-icon-user-solid',
  properties: {
    assignee: {
      component: ElInput,
      placeholder: '处理人',
      vSlots: {
        prepend: () => <div>处理人</div>,
      },
    },
    candidateUsers: {
      component: ElInput,
      placeholder: '候选人',
      vSlots: {
        prepend: () => <div>候选人</div>,
      },
    },
  },
};

const BpmnGroupPropertisConfig = {
  'bpmn:UserTask': [{ ...CommonGroupProperties }, BpmnUserTaskGroupPropertis],
};

export default BpmnGroupPropertisConfig;
