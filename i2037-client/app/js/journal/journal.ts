///<reference path="../../../typings/tsd.d.ts" />

import journalCalendar from "./journal-calendar";
import journalDate from "./journal-date";

export var journal = angular.module('i2037.journal', [
    'ngRoute',  
    journalCalendar.name,
    journalDate.name
    ])
  ;


