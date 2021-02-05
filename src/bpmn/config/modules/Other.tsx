import { CommonGroupProperties, DocumentGroupProperties } from '../common';
import { ElInput } from 'element-plus';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };

const BpmnGroupBaseProperties = {
  name: '基础信息',
  icon: 'el-icon-info',
  properties: {
    id: {
      component: ElInput,
      placeholder: '节点ID',
      vSlots: {
        prepend: () => <div>节点ID</div>,
      },
    },
    categoryValueRef: {
      value: {
        component: ElInput,
        // prefix: '节点名称',
        placeholder: '节点名称',
        vSlots: {
          prepend: () => <div>节点名称</div>,
        },
      },
    },
  },
};

export default {
  //池
  'bpmn:Participant': [idAndName, documentation],
  //分组
  'bpmn:Group': [BpmnGroupBaseProperties, documentation],
  //数据存储
  'bpmn:DataStoreReference': [idAndName, documentation],
  //数据对象
  'bpmn:DataObjectReference': [idAndName, documentation],
};
