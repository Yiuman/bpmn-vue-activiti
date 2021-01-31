import { defineComponent } from 'vue';
import { useBpmnInject } from '../../bpmn/store';
import DynamicBinder from '../../components/dynamic-binder';
import { ElInput } from 'element-plus';

import './panel.css';

export default defineComponent({
  name: 'Panel',
  setup() {
    const bpmnContext = useBpmnInject();
    const contextState = bpmnContext.getState();

    //动态数据绑定器的字段变化后更新到xml，视图刷新
    function onFieldChange(key: string, value: unknown): void {
      const shape = bpmnContext.getShape();
      bpmnContext.getModeling().updateProperties(shape, { [key]: value });
    }

    return () => (
      <div class="bpmn-panel">
        {contextState.isActive && contextState.businessObject != null ? (
          <DynamicBinder
            {...{ onFieldChange: onFieldChange }}
            fieldDefine={StartEventBindDefine}
            v-model={contextState.businessObject}
          />
        ) : (
          ''
        )}
      </div>
    );
  },
});

const StartEventBindDefine = {
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
