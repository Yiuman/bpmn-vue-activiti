import { reactive, UnwrapRef, provide, inject } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
const bpmnSymbol = Symbol();

interface BpmnState {
  activeElement: any;
}

interface BpmnContext {
  modeler: any;
  state: UnwrapRef<BpmnState>;
  getState(): UnwrapRef<BpmnState>;
  initModeler(options: any): void;
  importXML(xml: string): Promise<Array<string> | any>;
  getModeler(): typeof Modeler;
  getActiveElement(): any;
  getModeling(): any;
  addEvent(name: string, func: (e: any) => void): void;
}

export const useBpmnProvider = (): void => {
  const state = reactive<BpmnState>({
    activeElement: null,
  });
  const context: BpmnContext = {
    modeler: null,
    state: state,
    getState() {
      return state;
    },
    initModeler(options) {
      this.modeler = new Modeler(options);
      this.addEvent('element.click', function (e) {
        state.activeElement = e;
      });
    },
    getModeler() {
      return this.modeler;
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
    addEvent(string, func) {
      this.getModeler().on(string, function (e: any) {
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
