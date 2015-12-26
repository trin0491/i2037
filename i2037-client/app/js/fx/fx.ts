///<reference path="../../../typings/tsd.d.ts" />

import pricingServices from "./services/pricing";

export default angular.module('i2037.fx', [
  'i2037.fx.directives.quotePanel',
  pricingServices.name
])
;
