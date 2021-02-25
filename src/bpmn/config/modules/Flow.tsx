import {
  CommonGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
  getElementTypeListenerProperties,
} from '../common';

import { ElInput, ElOption } from 'element-plus';
import PrefixLabelSelect from '../../../components/prefix-label-select';
import { ModdleElement } from '../../type';

const FLOW_TYPE_OPTIONS = [
  { label: '普通顺序流', value: 'normal' },
  { label: '默认顺序流', value: 'default' },
  { label: '条件顺序流', value: 'condition' },
];

//获取顺序流的类型
const getSequenceFlowType = (businessObject: ModdleElement) => {
  if (businessObject?.conditionExpression) {
    return 'condition';
  }

  if (businessObject?.sourceRef?.default) {
    return 'default';
  }

  return 'normal';
};

/**
 * 常规配置
 */
const BaseProperties = {
  ...CommonGroupProperties,
  properties: {
    ...CommonGroupProperties.properties,
    //条件类型
    'sequenceFlow.type': {
      component: PrefixLabelSelect,
      prefixTitle: '顺序流类型',
      predicate: (businessObject: ModdleElement): boolean => {
        return businessObject?.sourceRef?.$type !== 'bpmn:StartEvent';
      },
      vSlots: {
        default: (): JSX.Element => {
          return FLOW_TYPE_OPTIONS.map((item) => {
            return <ElOption {...item} />;
          });
        },
      },
      getValue(businessObject: ModdleElement): string {
        return getSequenceFlowType(businessObject);
      },
    },
    'conditionExpression.body': {
      component: ElInput,
      placeholder: '条件表达式',
      vSlots: {
        prepend: (): JSX.Element => <div>条件表达式</div>,
      },
      predicate: (businessObject: ModdleElement): boolean => {
        console.warn('获取顺序流的类型', businessObject, getSequenceFlowType(businessObject));
        return 'condition' === getSequenceFlowType(businessObject);
      },
      getValue(businessObject: ModdleElement): string {
        return businessObject?.conditionExpression?.body;
      },
    },
  },
};

export default {
  //顺序流
  'bpmn:SequenceFlow': [
    BaseProperties,
    getElementTypeListenerProperties({
      name: '条件监听器',
      eventOptions: [{ label: 'take', value: 'take' }],
    }),
    ExtensionGroupProperties,
    DocumentGroupProperties,
  ],
};
