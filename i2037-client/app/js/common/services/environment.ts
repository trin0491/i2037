///<reference path="../../../../typings/tsd.d.ts" />

const BUILD_PREFIX = '/* @echo i2037_SVC_PREFIX */';

export default angular.module('i2037.environment', [])
      .constant('version', 'dev')
      .constant('svcPrefix', BUILD_PREFIX)
    ;

