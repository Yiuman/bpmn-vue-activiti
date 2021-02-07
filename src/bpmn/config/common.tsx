import { ElInput } from 'element-plus';
import { FieldDefine } from '../../components/dynamic-binder';
import { PropertiesMap, GroupProperties } from './index';
import SubList from '../../components/sublist/SubList';

/**
 * 所有通用节点的属性（每个节点都有的）
 */
const commonProperties: PropertiesMap<FieldDefine> = {
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
        prepend: (): JSX.Element => <div>处理人</div>,
      },
    },
    candidateUsers: {
      component: ElInput,
      placeholder: '候选人',
      vSlots: {
        prepend: (): JSX.Element => <div>候选人</div>,
      },
    },
  },
};

interface Documentation {
  text: string;
}

export const DocumentGroupProperties: GroupProperties = {
  name: '元素文档',
  icon: 'el-icon-document',
  properties: {
    'documentation.text': {
      component: ElInput,
      type: 'textarea',
      getValue: (obj: { documentation: Array<Documentation> }): string => {
        return obj['documentation']?.[0]?.['text'];
      },
    },
  },
};

/**
 * （基础信息）表单
 */
export const FormGroupProperties: GroupProperties = {
  name: '表单信息',
  icon: 'el-icon-edit',
  properties: {
    formKey: {
      component: ElInput,
      placeholder: '表单key',
      vSlots: {
        prepend: () => <div>表单key</div>,
      },
    },
  },
};

/**
 * 扩展属性组配置
 */
export const ExtensionGroupProperties: GroupProperties = {
  name: '扩展属性',
  icon: 'el-icon-document-add',
  properties: {
    'extensionElements.properties': {
      component: SubList,
      tableProps: {
        stripe: true,
        border: true,
        size: 'small',
      },
      columns: [
        {
          type: 'index',
          label: '序号',
          align: 'center',
        },
        {
          prop: 'name',
          label: '属性名',
          align: 'center',
        },
        {
          prop: 'value',
          label: '属性值',
          align: 'center',
        },
      ],
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      getValue: (businessObject: any): Array<any> => {
        return businessObject?.extensionElements?.values;
      },
    },
  },
};
