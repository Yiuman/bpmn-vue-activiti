import { defineComponent } from 'vue';
import Modeler from './components/modeler';
import Panel from './components/panel';
import './index.css';
export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <>
        <div class="app-containers">
          <Modeler />
          <Panel />
        </div>
      </>
    );
  },
});
