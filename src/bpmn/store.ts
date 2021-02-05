import { reactive, UnwrapRef, provide, inject, nextTick } from 'vue';
import BpmnGroupPropertiesConfig, { GroupProperties } from './config';
import { resolveTypeName } from './config/TypeNameMapping';
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

  /**
   * 当前活动节点的绑定字段配置
   */
  activeBindDefine: Array<GroupProperties> | null | never;
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

  getShapeById(id: string): any;

  /**
   * 获取当前的流程的业务对象
   */
  getBusinessObject(): any;

  /**
   * 获取当前的活动节点
   */
  getActiveElement(): any;

  /**
   * 获取当前节点的名称
   */
  getActiveElementName(): string;

  /**
   * 获取当前节点的modeling
   */
  getModeling(): any;

  /**
   * 获取bpmnFactory
   */
  getBpmnFactory(): any;

  /**
   * 创建节点
   * @param nodeName 节点名称
   * @param modelName 模型名称
   * @param value 几点值
   */
  createElement(nodeName: string, modelName: string, value: { [key: string]: any }): void;

  /**
   * 添加设计器事件监听
   * @param name 事件名称
   * @param func 触发事件的回调
   */
  addEventListener(name: string, func: (e: any) => void): void;
}

export const useBpmnProvider = (): void => {
  const bpmnState = reactive<BpmnState>({
    activeElement: null,
    businessObject: null,
    activeBindDefine: null,
    isActive: false,
  });
  const context: BpmnContext = {
    modeler: null,
    state: bpmnState,
    getState() {
      return this.state;
    },
    initModeler(options) {
      this.modeler = new Modeler(options);
      const elementRegistry = this.modeler.get('elementRegistry');

      //刷新状态
      function refreshState(elementAction: any): void {
        if (!bpmnState || !elementAction) {
          return;
        }
        bpmnState.activeElement = elementAction;
        const shape = elementRegistry.get(elementAction.element.id);
        bpmnState.businessObject = shape ? shape.businessObject : {};
        bpmnState.isActive = true;
        bpmnState.activeBindDefine = shape
          ? BpmnGroupPropertiesConfig[elementAction.element.type]
          : null;
        console.warn('currentShape', shape);
      }

      this.addEventListener('element.click', function (elementAction) {
        refreshState(elementAction);
      });
      this.addEventListener('element.changed', function (elementAction: any) {
        //这里是处理修改shape中的label后导致的不及时更新问题
        //现将业务对象至为空对象，视图更新后，再重新进行渲染
        bpmnState.businessObject = {};
        nextTick(() => {
          refreshState(elementAction);
        });
      });
    },
    getModeler() {
      return this.modeler;
    },
    getShape() {
      return this.getShapeById(this.getState().activeElement.element.id);
    },
    getShapeById(id) {
      const elementRegistry = this.getModeler().get('elementRegistry');
      return elementRegistry.get(id);
    },
    getBpmnFactory() {
      return this.modeler.get('bpmnFactory');
    },
    createElement(nodeName, modelName, value) {
      this.getModeling().updateProperties(this.getShape(), {
        [modelName]: [this.getBpmnFactory().create(nodeName, value)],
      });
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
      return this.getState().activeElement;
    },
    getActiveElementName() {
      const businessObject = this.getBusinessObject();
      return businessObject ? resolveTypeName(businessObject) : '';
    },
    getBusinessObject() {
      return this.getState().businessObject;
    },
    addEventListener(string, func) {
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
