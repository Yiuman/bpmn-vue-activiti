const ScriptHelper = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  execute(scriptStr: string, options: any): any {
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + scriptStr + ')')()(options);
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  executeEl(callObject: any, logicStr: string): any {
    return Function('"use strict";return (function(){ return ' + logicStr + '})')().call(
      callObject,
    );
  },
};

/**
 * 多层级嵌套赋值
 * @param obj 赋值的对象
 * @param path 需要赋值的属性 如：aaa.bbb
 * @param value 值
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const set = (obj: any, path: string, value: unknown) => {
  let schema = obj;
  const pList = path.split('.');
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = String(pList[i]);
    schema = schema[elem] || {};
  }

  schema[pList[len - 1]] = value;
};

export default ScriptHelper;
