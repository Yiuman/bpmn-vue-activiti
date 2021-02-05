import { defineComponent, reactive, watch } from 'vue';
import { useBpmnInject } from '../../bpmn/store';
import DynamicBinder from '../../components/dynamic-binder';
import { ElCollapse, ElCollapseItem } from 'element-plus';
import { GroupProperties } from '../../bpmn/config';

import './panel.css';
import { set } from '../../utils/script-helper';

export default defineComponent({
  name: 'Panel',
  setup() {
    const bpmnContext = useBpmnInject();
    const contextState = bpmnContext.getState();

    //动态数据绑定器的字段变化后更新到xml，视图刷新
    function onFieldChange(key: string, value: unknown): void {
      const shape = bpmnContext.getShape();
      console.warn('key', key, value);
      if (~key.indexOf('.')) {
        if (key === 'documentation.text') {
          bpmnContext.createElement('bpmn:Documentation', 'documentation', { text: value });
        } else {
          const businessObject = bpmnContext.getBusinessObject();
          set(businessObject, key, value);
          console.warn('businessObjectbusinessObject', businessObject);
          // const firstKey = key.split('.')[0];
          // const secondKey = key.split('.')[1];
          // const businessObject = toRaw(bpmnContext.getBusinessObject());
          // const businessObjectElement = businessObject[firstKey];
          // console.warn('businessObjectElement', businessObjectElement, firstKey, secondKey);
          // if (businessObjectElement.id) {
          //   const businessObjectElementShape = bpmnContext.getShapeById(businessObjectElement.id);
          //   console.warn('businessObjectElementShape', businessObjectElementShape);
          //   bpmnContext.getModeling().updateProperties(businessObjectElementShape, {
          //     [secondKey]: value,
          //   });
          // }
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
