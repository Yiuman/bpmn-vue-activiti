import './modeler.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import { defineComponent, ref, onMounted } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
import createDefaultBpmnXml from '../../bpmn/defaultBpmnXml';
import activitiModdel from '../../bpmn/resources/activiti-moddel.json';
import translate from '../../bpmn/i18n';

export default defineComponent({
  name: 'Modeler',
  setup() {
    const bnpm = ref(null);
    onMounted(() => {
      const modeler = new Modeler({
        container: '#modeler-container',
        //添加控制板
        propertiesPanel: {
          parent: '#properties-panel',
        },
        additionalModules: [
          //添加翻译
          { translate: ['value', translate('zh')] },
        ],
        moddleExtensions: {
          activiti: activitiModdel,
        },
      });
      const defaultProcessIdAndName = '1';
      modeler
        .importXML(createDefaultBpmnXml(defaultProcessIdAndName, defaultProcessIdAndName))
        .then((result: Array<string>) => {
          if (result.length) {
            console.warn('importSuccess warrings', result);
          }
        })
        .catch((err: any) => {
          console.warn('importFail errors ', err);
        });
      addEventBusListener(modeler);
    });

    return () => (
      <>
        <div id="modeler-container" ref={bnpm}></div>
      </>
    );
  },
});

function addEventBusListener(bpmnModeler: typeof Modeler): void {
  console.warn('bpmnModeler', bpmnModeler);
  const eventBus = bpmnModeler.get('eventBus'); // 需要使用eventBus
  const eventTypes = ['element.click']; // 需要监听的事件集合
  const modeling = bpmnModeler.get('modeling');

  eventTypes.forEach(function (eventType) {
    eventBus.on(eventType, function (e: any) {
      if (!e || e.element.type == 'bpmn:Process') return; // 这里我的根元素是bpmn:Process
      console.log(e);
      const elementRegistry = bpmnModeler.get('elementRegistry');
      console.warn('modeling', modeling);
      const shape = elementRegistry.get(e.element.id); // 传递id进去
      if (shape.type.indexOf('StartEvent') > -1) {
        modeling.updateProperties(shape, { name: '哈哈哈哈' });
      }
      console.warn('businessObject', shape?.businessObject);
      bpmnModeler
        .saveXML({ format: true })
        .then((xml: string) => {
          console.warn('xml', xml);
        })
        .catch((err: any) => {
          console.warn('err', err);
        });
    });
  });
}
