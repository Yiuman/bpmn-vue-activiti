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

    //动态数据绑定器的字段变化后更新到xml，视图刷新
    function onFieldChange(key: string, value: unknown): void {
      const shape = bpmnContext.getShape();
      if (~key.indexOf('.')) {
        if (key === 'documentation.text') {
          bpmnContext.createElement('bpmn:Documentation', 'documentation', { text: value });
        }
      } else {
        bpmnContext.getModeling().updateProperties(shape, { [key]: value });
      }
    }

    const panelState = reactive({
      //活动的数据配置组
      elCollapses: Object.assign([]),
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
          <div class="bpmn-panel">
            <div class="title">{bpmnContext.getActiveElementName()}</div>
            <ElCollapse v-model={panelState.elCollapses}>
              {contextState.activeBindDefine.map((groupItem) => {
                return <ElCollapseItem name={groupItem.name} v-slots={getSlotObject(groupItem)} />;
              })}
            </ElCollapse>
          </div>
        ) : (
          ''
        )}
      </>
    );
  },
});
