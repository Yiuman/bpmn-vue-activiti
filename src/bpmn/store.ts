import { reactive, UnwrapRef, provide, inject, nextTick } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
const bpmnSymbol = Symbol();

interface BpmnState {
  activeElement: any;
  businessObject: any;
  isActive: boolean;
}

interface BpmnContext {
  modeler: any;
  state: UnwrapRef<BpmnState>;
  getState(): UnwrapRef<BpmnState>;
  initModeler(options: unknown): void;
  importXML(xml: string): Promise<Array<string> | any>;
  getModeler(): typeof Modeler;
  getShape(): any;
  getBusinessObject(): any;
  getActiveElement(): any;
  getModeling(): any;
  addEvent(name: string, func: (e: any) => void): void;
}

export const useBpmnProvider = (): void => {
  const state = reactive<BpmnState>({
    activeElement: null,
    businessObject: null,
    isActive: false,
  });
  const context: BpmnContext = {
    modeler: null,
    state: state,
    getState() {
      return state;
    },
    initModeler(options) {
      this.modeler = new Modeler(options);
      const elementRegistry = this.modeler.get('elementRegistry');

      function refreshSate(elementAction: any): void {
        state.activeElement = elementAction;
        const shape = elementRegistry.get(elementAction.element.id);
        state.businessObject = shape.businessObject;
        state.isActive = true;
      }

      this.addEvent('element.click', function (elementAction) {
        refreshSate(elementAction);
      });
      this.addEvent('element.changed', function (elementAction: any) {
        state.businessObject = null;
        state.isActive = false;
        nextTick(() => {
          refreshSate(elementAction);
        });
        // state.businessObject = labelCreated.context.labelTarget.businessObject;
      });
    },
    getModeler() {
      return this.modeler;
    },
    getShape() {
      const elementRegistry = this.getModeler().get('elementRegistry');
      return elementRegistry.get(state.activeElement.element.id);
    },
    importXML(string) {
      return this.modeler.importXML(string);
    },
    getModeling() {
      return this.getModeler().get('modeling');
    },
    getActiveElement() {
      return state.activeElement;
    },
    getBusinessObject() {
      return state.businessObject;
    },
    addEvent(string, func) {
      this.getModeler()
        .get('eventBus')
        .on(string, function (e: any) {
          func(e);
        });
    },
  };

  provide(bpmnSymbol, context);
};

export const useBpmnInject = (): BpmnContext => {
  const bpmnContext = inject<BpmnContext>(bpmnSymbol);
  if (!bpmnContext) {
    throw new Error('The bpmnContext without useProvider, can not inject!!');
  }
  return bpmnContext;
};
