import { defineComponent, reactive, watch } from 'vue';
import { useBpmnInject } from '../../bpmn/store';
import DynamicBinder from '../../components/dynamic-binder';
import { ElCollapse, ElCollapseItem } from 'element-plus';
import { GroupProperties } from '../../bpmn/config';

import './panel.css';

export default defineComponent({
  name: 'Panel',
  setup() {
    const bpmnContext = useBpmnInject();
    const contextState = bpmnContext.getState();
    //属性处理适配器，用于处理特别字段
    const fieldChangeAdapter: { [key: string]: (key: string, value: any) => void } = {
      //文档属性处理
      'documentation.text': (key, value) =>
        bpmnContext.createElement('bpmn:Documentation', 'documentation', { text: value }),
      //扩展属性处理
      'extensionElements.properties': (key, value) => {
        const moddle = bpmnContext.getModeler().get('moddle');
        const properties = moddle.create(`activiti:Properties`, {
          values: value.map((attr: { name: string; value: unknown }) => {
            return moddle.create(`activiti:Property`, { name: attr.name, value: attr.value });
          }),
        });
        bpmnContext.updateExtensionElements('activiti:Properties', properties);
      },
      //监听器
      'extensionElements.listeners': (key, value) => {
        const moddle = bpmnContext.getModeler().get('moddle');
        bpmnContext.updateExtensionElements(
          'activiti:ExecutionListener',
          value.map((attr: { event: string; type: string; content: string }) => {
            return moddle.create(`activiti:ExecutionListener`, {
              event: attr.event,
              [attr.type]: attr.content,
            });
          }),
        );
      },
      //顺序流类型
      'sequenceFlow.type': (key, value) => {
        const line = bpmnContext.getShape();
        const sourceShape = bpmnContext
          .getModeler()
          .get('elementRegistry')
          .get(line.businessObject.sourceRef.id);
        const modeling = bpmnContext.getModeling();
        if (!value || value === 'normal') {
          modeling.updateProperties(line, { conditionExpression: null });
          delete line.businessObject.conditionExpression;
        }

        if (value === 'default') {
          modeling.updateProperties(sourceShape, { default: line });
          delete line.businessObject.conditionExpression;
        }

        if (value === 'condition') {
          modeling.updateProperties(line, {
            conditionExpression: bpmnContext
              .getModeler()
              .get('moddle')
              .create('bpmn:FormalExpression'),
          });
        }
      },
      //条件表达式
      'conditionExpression.body': (key, value) => {
        const moddle = bpmnContext.getModeler().get('moddle');
        bpmnContext.getModeling().updateProperties(bpmnContext.getShape(), {
          conditionExpression: moddle.create('bpmn:FormalExpression', { body: value }),
        });
      },
    };

    //动态数据绑定器的字段变化后更新到xml，视图刷新
    function onFieldChange(key: string, value: any): void {
      const shape = bpmnContext.getShape();
      const fieldChangeAdapterElement = fieldChangeAdapter[key];
      if (fieldChangeAdapterElement) {
        fieldChangeAdapterElement(key, value);
      } else {
        bpmnContext.getModeling().updateProperties(shape, { [key]: value });
      }
    }

    const panelState = reactive({
      //活动的数据配置组
      elCollapses: Object.assign([]),
      //panel面板的开关
      shrinkageOff: false,
    });

    //打开所有抽屉
    watch(
      () => contextState.activeBindDefine,
      () => {
        if (contextState.activeBindDefine) {
          panelState.elCollapses = contextState.activeBindDefine.map((groupItem) => groupItem.name);
        }
      },
    );

    /**
     * 获取字段配置组的插槽
     * @param groupItem 组对象项
     */
    function getSlotObject(groupItem: GroupProperties) {
      return {
        title: () => (
          <div class="group-title-block">
            {groupItem.icon ? <i class={groupItem.icon} /> : ''}
            {groupItem.name}
          </div>
        ),
        default: () => (
          <DynamicBinder
            {...{ onFieldChange: onFieldChange }}
            fieldDefine={groupItem.properties}
            v-model={contextState.businessObject}
          />
        ),
      };
    }

    return () => (
      <>
        {contextState.isActive && contextState.businessObject && contextState.activeBindDefine ? (
          <>
            <div
              class="bpmn-panel-shrinkage"
              onClick={() => (panelState.shrinkageOff = !panelState.shrinkageOff)}
            >
              {panelState.shrinkageOff ? (
                <i class="el-icon-s-fold" />
              ) : (
                <i class="el-icon-s-unfold" />
              )}
            </div>
            <div class="bpmn-panel" v-show={!panelState.shrinkageOff}>
              <div class="title">{bpmnContext.getActiveElementName()}</div>
              <ElCollapse v-model={panelState.elCollapses}>
                {contextState.activeBindDefine.map((groupItem) => {
                  return (
                    <ElCollapseItem name={groupItem.name} v-slots={getSlotObject(groupItem)} />
                  );
                })}
              </ElCollapse>
            </div>
          </>
        ) : (
          ''
        )}
      </>
    );
  },
});
