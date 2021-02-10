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
    function onFieldChange(key: string, value: any): void {
      const shape = bpmnContext.getShape();
      if (~key.indexOf('.')) {
        if (key === 'documentation.text') {
          bpmnContext.createElement('bpmn:Documentation', 'documentation', { text: value });
        }
        if (key === 'extensionElements.properties') {
          const moddle = bpmnContext.getModeler().get('moddle');
          const properties = moddle.create(`activiti:Properties`, {
            values: value.map((attr: { name: string; value: unknown }) => {
              return moddle.create(`activiti:Property`, { name: attr.name, value: attr.value });
            }),
          });
          const element = bpmnContext.getShape();
          const extensionElements = element.businessObject.get('extensionElements');
          // 截取不是扩展属性的属性
          const otherExtensions =
            extensionElements
              ?.get('values')
              ?.filter((ex: any) => ex.$type !== `activiti:Properties`) || [];

          // 重建扩展属性
          const extensions = moddle.create('bpmn:ExtensionElements', {
            values: otherExtensions.concat([properties]),
          });
          bpmnContext.getModeling().updateProperties(element, { extensionElements: extensions });
        }
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
