///<reference path="../../../typings/tsd.d.ts" />

import journalCalendar from "./journal-calendar";
import journalDate from "./journal-date";

export default angular.module('i2037.journal', [
    'ngRoute',  
    journalCalendar.name,
    journalDate.name
    ])
  ;


