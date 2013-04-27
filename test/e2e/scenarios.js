'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('i2037', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });

  it('should automatically redirect to /home when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/home");
  });

  describe('home page', function() {
    beforeEach(function() {
      browser().navigateTo('#/home');
    });

    it('should render home when user navigates to /home', function() {
      expect(element('[ng-view] h1:first').text()).toMatch(/Interface 2037/);
    });
  });

  describe('recipes page', function() {
    beforeEach(function() {
      browser().navigateTo('#/recipes');
    })

    it('should render a recipes header', function() {
      expect(element('[ng-view] h2:first').text()).toMatch(/Recipes/);
    })
  })

  describe('slickgrid page', function() {
    beforeEach(function() {
      browser().navigateTo('#/slickgrid');
    });

    it('should render slickgrid when user navigates to /slickgrid', function() {
      expect(element('#myGrid', 'grid div').count()).toEqual(1);
    });
  });

  describe('cellar page', function() {
    beforeEach(function() {
      browser().navigateTo('#/wineview');
    });

    it('should have a repeater with 10 wines', function() {
      expect(repeater('ul li').count()).toEqual(10);
    });

    it('should have an add button', function() {
      expect(element('#addWine', 'add wine button').count()).toEqual(1);
      element('#addWine', 'add wine button').click();
      expect(element('div.modal', 'wineform').count()).toEqual(1);
    });
  });
});
