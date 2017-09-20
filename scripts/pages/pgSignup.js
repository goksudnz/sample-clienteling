/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgSignupDesign = require('ui/ui_pgSignup');
const Screen = require('sf-core/device/screen');

const PgSignup = extend(PgSignupDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    this.onOrientationChange = onOrientationChange.bind(this);
  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
}

function onOrientationChange(e) {
  console.log("Device.Screen.orientation: " + Screen.orientation);
}

module && (module.exports = PgSignup);
