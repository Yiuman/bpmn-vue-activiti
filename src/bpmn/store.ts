import { reactive, toRaw, nextTick, isRef } from 'vue';
import BpmnGroupPropertiesConfig, { PropertiesMap } from './config';
import { resolveTypeName } from './config/TypeNameMapping';
import Modeler from 'bpmn-js/lib/Modeler';
import { BpmnState, BpmnContext, ModdleElement } from './type';

const bpmnState = reactive<BpmnState>({
  activeElement: null,
  businessObject: null,
  activeBindDefine: null,
  updatingProperties: false,
});

//刷新状态
function refreshState(elementRegistry: any, elementAction: any): void {
  if (!bpmnState || !elementAction) {
    return;
  }
  bpmnState.activeElement = elementAction;
  const element = elementAction.element;
  const shape = elementRegistry.get(element.id);
  bpmnState.businessObject = shape ? shape.businessObject : {};
  // 点击节点标签（比如事件的节点名称）时，会发生找不到BpmnGroupPropertiesConfig对应的情况，此时可能会导致属性面板关闭
  // 对比节点的Id，节点标签的id为对应节点Id+'_label'，此时，需要找到节点对应的BpmnGroupPropertiesConfig配置
  let type = element.type;
  if (element.type === 'label' && /_label$/.test(element.id)) {
    const replace = element.id.replace(/_label$/, '');
    type = elementRegistry._elements[replace]?.element.type;
  }
  bpmnState.activeBindDefine = shape ? BpmnGroupPropertiesConfig[type] : null;
}

export const BpmnStore: BpmnContext = {
  modeler: null,
  state: bpmnState,
  getState() {
    return this.state;
  },
  initModeler(options) {
    this.modeler = new Modeler(options);
    const elementRegistry = this.modeler.get('elementRegistry');
    //添加click、shapeAdd事件，属性更新后的事件，用于变更当前的业务对象，刷新属性配置栏
    ['element.click', 'shape.added', 'element.changed'].forEach((event) => {
      BpmnStore.addEventListener(event, function (elementAction) {
        const element = elementAction.element || elementAction.context.element;
        if (!element && !elementAction.type) {
          return;
        }

        //如果是为label的add事件不需要刷新属性配置栏，否则输入节点名称时，会造成输入中断焦点丢失
        if (element.type == 'label' && elementAction.type == 'shape.added') {
          return;
        }

        //当前上下文中更新属性 触发element.changed直接过  不刷新业务对象 防止属性表单丢失焦点
        if ('element.changed' == elementAction.type && bpmnState.updatingProperties) {
          return;
        }

        bpmnState.businessObject = null;
        nextTick().then(() => {
          refreshState(elementRegistry, elementAction);
        });
      });
    });
  },
  getModeler() {
    return this.modeler;
  },
  refresh() {
    bpmnState.businessObject = null;
    nextTick().then(() => {
      refreshState(this.modeler.get('elementRegistry'), bpmnState.activeElement);
    });
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
  createElement(nodeName, modelName, value, multiple) {
    const newElement = this.getBpmnFactory().create(nodeName, value);
    this.updateProperties(this.getShape(), {
      [modelName]: multiple ? [newElement] : newElement,
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
  updateExtensionElements(elementName, value) {
    const moddle = this.getModeler().get('moddle');
    const element = this.getShape();
    const extensionElements = this.getBusinessObject()?.extensionElements;
    // 截取不是扩展属性的属性
    const otherExtensions =
      extensionElements?.values
        ?.filter((ex: any) => ex.$type !== elementName)
        .map((item: ModdleElement) => toRaw(item)) || [];

    // 重建扩展属性
    const extensions = moddle.create('bpmn:ExtensionElements', {
      values: otherExtensions.concat(value instanceof Array ? value : [value]),
    });
    this.updateProperties(element, { extensionElements: extensions });
  },
  updateProperties(element: ModdleElement, properties: PropertiesMap<any>) {
    bpmnState.updatingProperties = true;
    this.getModeling().updateProperties(element, properties);
    bpmnState.updatingProperties = false;
  },
};
