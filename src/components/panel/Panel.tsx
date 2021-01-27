import { defineComponent, onMounted, reactive, watch } from 'vue';
import { useBpmnInject } from '../../bpmn/store';
import DynamicBinder, { FieldDefine } from '../../components/dynamic-binder';
import { Input } from 'ant-design-vue';

export default defineComponent({
  name: 'Panel',
  setup() {
    const bpmnContext = useBpmnInject();
    const contextState = bpmnContext.getState();
    const state = reactive({
      businessObject: {},
    });

    onMounted(() => {
      watch(
        () => contextState.activeElement,
        function (newActive: any, preActive: any) {
          const elementRegistry = bpmnContext.getModeler().get('elementRegistry');
          const shape = elementRegistry.get(newActive.element.id);
          console.warn('shape', shape);
          console.warn('newActive', newActive, 'preActive', preActive);
          console.warn('modeling', bpmnContext.getModeling());
          state.businessObject = shape.businessObject;
        },
      );
    });

    return () => (
      <div class="bpmn-panel">
        <DynamicBinder fieldDefine={StartEventBindDefine} sourceModel={state.businessObject} />
      </div>
    );
  },
});

const StartEventBindDefine: FieldDefine = {
  id: {
    component: Input,
    placeholder: '节点ID',
  },
  name: {
    component: Input,
    placeholder: '节点名称',
  },
};
