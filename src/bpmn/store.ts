import { reactive, UnwrapRef, provide, inject, nextTick } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
const bpmnSymbol = Symbol();

export interface BpmnState {
  /**
   * 当前活动的节点
   */
  activeElement: any;
  /**
   * 当前活动节点的业务对象
   */
  businessObject: any;
  /**
   * 是否活动
   */
  isActive: boolean;
}

/**
 * 流程管理的上下文
 */
export interface BpmnContext {
  /**
   * 流程设计器
   */
  modeler: any;
  /**
   * 状态管理
   */
  state: UnwrapRef<BpmnState>;
  /**
   * 获取当前的状态
   */
  getState(): UnwrapRef<BpmnState>;
  /**
   * 初始化流程设计器
   * @param options 流程设计器参数
   */
  initModeler(options: unknown): void;
  /**
   *获取设计器
   */
  getModeler(): typeof Modeler;
  /**
   * 导入xml
   * @param xml xml字符串
   */
  importXML(xml: string): Promise<Array<string> | any>;
  /**
   * 获取流程xml
   */
  getXML(): Promise<{ xml: string }>;
  /**
   * 获取流程的SVG图
   */
  getSVG(): Promise<{ svg: string }>;

  /**
   * 获取当前节点的Shape对象，此对象用于操作节点与业务流程对象等
   */
  getShape(): any;
  /**
   * 获取当前的流程的业务对象
   */
  getBusinessObject(): any;
  /**
   * 获取当前的活动节点
   */
  getActiveElement(): any;
  /**
   * 获取当前节点的modeling
   */
  getModeling(): any;
  /**
   * 添加设计器事件监听
   * @param name 事件名称
   * @param func 触发事件的回调
   */
  addEventLisener(name: string, func: (e: any) => void): void;
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

      this.addEventLisener('element.click', function (elementAction) {
        refreshSate(elementAction);
      });
      this.addEventLisener('element.changed', function (elementAction: any) {
        //这里是处理修改shape中的label后导致的不及时更新问题
        //现将业务对象至为空对象，视图更新后，再重新进行渲染
        state.businessObject = {};
        nextTick(() => {
          refreshSate(elementAction);
        });
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
    getXML() {
      return new Promise((resolve, reject) => {
        this.getModeler()
          .saveXML({ format: true })
          .then((response: { xml: string }) => {
            resolve(response);
          })
          .catch((err: unknown) => {
            reject(err);
          });
      });
    },
    getSVG() {
      return new Promise((resolve, reject) => {
        this.getModeler()
          .saveSVG()
          .then((response: { svg: string }) => {
            resolve(response);
          })
          .catch((err: unknown) => {
            reject(err);
          });
      });
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
    addEventLisener(string, func) {
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
