import {
  CommonGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
} from '../common';

import { GroupProperties } from '../index';
import SubList from '../../../components/sublist/SubList';
import { ElFormItem, ElSelect, ElOption } from 'element-plus';
import { SubListState } from '../../../components/sublist/type';
import { ModdleElement } from '../../type';

/**
 * 流程事件类型选项
 */
const EVENT_OPTIONS = [
  { label: '开始', value: 'start' },
  { label: '结束', value: 'end' },
];

/**
 * 监听器类型选项
 */
const TYPE_OPTIONS = [
  { label: 'java类', value: 'class' },
  { label: '调用表达式', value: 'expression' },
  { label: '注入表达式', value: 'delegateExpression' },
];

/**
 * 监听器组
 */
export const ListenerGroupProperties: GroupProperties = {
  name: '全局监听器',
  icon: 'el-icon-bell',
  properties: {
    'extensionElements.listeners': {
      component: SubList,
      columns: [
        {
          type: 'index',
          label: '序号',
          align: 'center',
        },
        {
          prop: 'event',
          label: '事件',
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
          formatter: (row: any, column: any) => {
            return EVENT_OPTIONS.filter((item) => item.value === row[column.property])[0].label;
          },
          // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
          editComponent: function (scope: any, state: SubListState<any>): JSX.Element {
            return (
              <ElFormItem
                size="mini"
                class="sublist-form-item"
                label={scope.column.name}
                prop={scope.column.property}
              >
                <ElSelect v-model={state.editItem.event}>
                  {EVENT_OPTIONS.map((option) => {
                    return (
                      <ElOption key={option.value} label={option.label} value={option.value} />
                    );
                  })}
                </ElSelect>
              </ElFormItem>
            );
          },
        },
        {
          prop: 'type',
          label: '执行类型',
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
          formatter: (row: any, column: any) => {
            return TYPE_OPTIONS.filter((item) => item.value === row[column.property])[0].label;
          },
          // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
          editComponent: function (scope: any, state: SubListState<any>): JSX.Element {
            return (
              <ElFormItem
                size="mini"
                class="sublist-form-item"
                label={scope.column.name}
                prop={scope.column.property}
              >
                <ElSelect v-model={state.editItem.type}>
                  {TYPE_OPTIONS.map((option) => {
                    return (
                      <ElOption key={option.value} label={option.label} value={option.value} />
                    );
                  })}
                </ElSelect>
              </ElFormItem>
            );
          },
        },
        {
          prop: 'content',
          label: '执行内容',
          align: 'center',
        },
      ],
      rules: {
        event: [{ required: true, message: '事件不能为空' }],
        type: [{ required: true, message: '类型不能为空' }],
        content: [{ required: true, message: '执行内容不能为空' }],
      },
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      getValue: (businessObject: any): Array<any> => {
        return businessObject?.extensionElements?.values
          ?.filter((item: ModdleElement) => item.$type === 'activiti:ExecutionListener')
          ?.map((item: ModdleElement) => {
            const type = item.expresion
              ? 'expresion'
              : item.delegateExpression
              ? 'delegateExpression'
              : 'class';
            return {
              event: item.event,
              type: type,
              content: item[type],
            };
          });
      },
    },
  },
};

//流程数据属性配置数组
const ProcessGroupPropertiesArray = [
  CommonGroupProperties,
  ListenerGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
];

export default {
  //流程
  'bpmn:Process': ProcessGroupPropertiesArray,
  //子流程
  'bpmn:SubProcess': ProcessGroupPropertiesArray,
};
