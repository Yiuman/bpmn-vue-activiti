import { defineComponent, onMounted, ref, watch } from 'vue';
import { useBpmnInject } from '../../bpmn/store';

export default defineComponent({
  name: 'Panel',
  setup() {
    const bpmnContext = useBpmnInject();
    const name = ref('');
    const state = bpmnContext.getState();

    onMounted(() => {
      watch(
        () => state.activeElement,
        function (newActive: any, preActive: any) {
          const elementRegistry = bpmnContext.getModeler().get('elementRegistry');
          const shape = elementRegistry.get(newActive.element.id);
          console.warn('shape', shape);
          console.warn('newActive', newActive, 'preActive', preActive);
          console.warn('modeling', bpmnContext.getModeling());
          name.value = JSON.stringify(shape);
        },
      );
    });

    return () => <div class="bpmn-panel">{name.value}</div>;
  },
});
