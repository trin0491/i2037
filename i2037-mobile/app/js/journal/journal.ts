///<reference path="../../../typings/tsd.d.ts" />

import CalendarModule = require('common/directives/calendar');

export = JournalModule;

class JournalModule {
  public static NAME:string = 'i2037.journal';

  private static _instance:JournalModule = new JournalModule();

  public get instance():JournalModule {
    return JournalModule._instance;
  }

  constructor() {
    angular.module(JournalModule.NAME, [CalendarModule.NAME]);
  }
}

