/**
 * Created by richard on 10/09/2015.
 */
///<reference path="../../../typings/tsd.d.ts" />

import testController = require('./testController');

export = TestModule;

class TestModule {
  public static NAME:string = "test";

  private static _instance:TestModule = new TestModule();

  constructor() {
    var m = angular.module(TestModule.NAME, ['rx']);
    m.controller('test', testController);
  }
}