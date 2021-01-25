import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BpmnPanel',
  setup() {
    return () => (
      <>
        <div class="bpmn-panel"></div>
      </>
    );
  },
});
