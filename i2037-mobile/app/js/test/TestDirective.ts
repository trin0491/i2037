/**
 * Created by richard on 10/09/2015.
 */

export = testController;

function testController() {
  this.onClick = function () {
    window.open("", "", "width=200, height=100, titlebar=0");
  }
}