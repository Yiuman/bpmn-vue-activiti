import { defineComponent } from 'vue';
import { useBpmnProvider } from './bpmn/store';
import Modeler from './components/modeler';
import Panel from './components/panel';
import BpmnActions from './components/bpmn-actions';
import './index.css';

export default defineComponent({
  name: 'App',
  setup() {
    useBpmnProvider();
    return () => (
      <div class="app-containers">
        <Modeler />
        <Panel />
        <BpmnActions />
      </div>
    );
  },
});
