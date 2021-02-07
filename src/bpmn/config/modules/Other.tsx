import {
  CommonGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
} from '../common';
import { ElInput } from 'element-plus';

const idAndName = { ...CommonGroupProperties };
const documentation = { ...DocumentGroupProperties };
const extensionProperties = { ...ExtensionGroupProperties };

interface CategoryValueRef {
  value: string;
}

const BpmnGroupBaseProperties = {
  name: '基础信息',
  icon: 'el-icon-info',
  properties: {
    id: {
      component: ElInput,
      placeholder: '节点ID',
      vSlots: {
        prepend: (): JSX.Element => <div>节点ID</div>,
      },
    },
    name: {
      component: ElInput,
      // prefix: '节点名称',
      placeholder: '节点名称',
      vSlots: {
        prepend: (): JSX.Element => <div>节点名称</div>,
      },
      getValue: (obj: { categoryValueRef: CategoryValueRef }): string => {
        return obj?.categoryValueRef?.value;
      },
    },
  },
};

export default {
  //池
  'bpmn:Participant': [idAndName, extensionProperties, documentation],
  //分组
  'bpmn:Group': [BpmnGroupBaseProperties, extensionProperties, documentation],
  //数据存储
  'bpmn:DataStoreReference': [idAndName, extensionProperties, documentation],
  //数据对象
  'bpmn:DataObjectReference': [idAndName, extensionProperties, documentation],
};
