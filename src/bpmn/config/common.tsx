import { ElInput } from 'element-plus';
import { FieldDefine } from '../../components/dynamic-binder';
import { PropertiesMap, GroupProperties } from './index';

/**
 * 所有通用节点的属性（每个节点都有的）
 */
const commonProperties: PropertiesMap<FieldDefine> = {
  id: {
    component: ElInput,
    placeholder: '节点ID',
    vSlots: {
      prepend: () => <div>节点ID</div>,
    },
  },
  name: {
    component: ElInput,
    // prefix: '节点名称',
    placeholder: '节点名称',
    vSlots: {
      prepend: () => <div>节点名称</div>,
    },
  },
};

/**
 * （基础信息）每个节点都有的
 */
export const CommonGroupProperties: GroupProperties = {
  name: '基础信息',
  icon: 'el-icon-info',
  properties: { ...commonProperties },
};

/**
 * 用户任务属性配置
 */
export const BpmnUserGroupProperties: GroupProperties = {
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

export const DocumentGroupProperties: GroupProperties = {
  name: '元素文档',
  icon: 'el-icon-document',
  properties: {
    'documentation.text': {
      component: ElInput,
      type: 'textarea',
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      getValue: (obj) => {
        return obj['documentation']?.[0]?.['text'];
      },
    },
  },
};

const formProperties: PropertiesMap<FieldDefine> = {
  formKey: {
    component: ElInput,
    placeholder: '表单key',
    vSlots: {
      prepend: () => <div>表单key</div>,
    },
  },
};
/**
 * （基础信息）表单
 */
export const FormGroupProperties: GroupProperties = {
  name: '表单信息',
  icon: 'el-icon-edit',
  properties: { ...formProperties },
};
