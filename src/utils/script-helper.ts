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

export default ScriptHelper;
