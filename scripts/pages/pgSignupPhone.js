const extend = require('js-base/core/extend');
const PgSignupPhoneDesign = require('ui/ui_pgSignupPhone');
const pageContextPatch = require("../context/pageContextPatch");
const Router = require("sf-core/ui/router");
const PgSignupPhone = extend(PgSignupPhoneDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    this.btnSignup.onTouch = onTouchSignup;
    this.btnAnonymous.onTouch = onTouchAnonymous;
    this.btnFacebook.onTouch = function(){
      Router.go("pgWomen");
    };
    this.imgBanner.onTouch = function(){
      Router.go("pgCustomerProfile");
    }
    //pageContextPatch(this, "pgSignupPhone");
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

function onTouchSignup() {
  Router.go("pgDashboard");
}

function onTouchAnonymous() {
  Router.go("pgMainLookbook");
}

module && (module.exports = PgSignupPhone);
