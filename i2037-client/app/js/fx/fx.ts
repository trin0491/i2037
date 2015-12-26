///<reference path="../../../typings/tsd.d.ts" />

import pricingServices from "./services/pricing";
import quotePanel from "./directives/quote-panel";


export default angular.module('i2037.fx', [
  quotePanel.name,
  pricingServices.name
])
;
