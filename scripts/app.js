/* globals lang */
require("i18n/i18n.js"); // Generates global lang object

const Application = require("sf-core/application");

// Set uncaught exception handler, all exceptions that are not caught will
// trigger onUnhandledError callback.
Application.onUnhandledError = function(e) {
    alert({
        title: lang.applicationError,
        message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
    });
};

require("sf-extension-utils");

const Router = require("sf-core/ui/router");
const System = require("sf-core/device/system");
const isTablet = require("./lib/isTablet");

// const mcsService = require("./service/MCSServive")();

//Router.add("pgLanding", require("./pages/pgLanding"), true);
//Router.add("pgLogin", require("./pages/pgLogin"), true);
//Router.add("pgDashboard", require("./pages/pgDashboard"), true);
//
//
//Router.go("pgLanding", { appStart: true }, false);

var settings = require("./settings.json");
var themeSettings = settings.config.theme;
var stylerBuilder = require("library/styler-builder");
stylerBuilder.registerThemes(themeSettings.themes || "Defaults");
stylerBuilder.setActiveTheme(themeSettings.currentTheme);

var sliderDrawer;

if (System.OS === "iOS") {
    sliderDrawer = require("./sliderDrawer");
    Router.sliderDrawer = sliderDrawer;
}

Router.add("pgDashboard", require("./pages/pgDashboard"), true);
Router.add("pgSignupPhone", require("./pages/pgSignupPhone"), true);
Router.add("pgSignupTablet", require("./pages/pgSignupTablet"), true);
Router.add("pgMainLookbook", require("./pages/pgMainLookbook"), true);
Router.add("pgLookbook", require("./pages/pgLookbook"), true);
Router.add("pgWomen", require("./pages/pgWomen"), true);
Router.add("pgCustomerProfile", require("./pages/pgCustomerProfile"), true);
Router.add("pgShoppingBag", require("./pages/pgShoppingBag"), true);


if (!isTablet) {
    Router.go("pgSignupPhone");
} else {
    Router.go("pgSignupPhone");
}

if (System.OS === "Android") {
    sliderDrawer = require("./sliderDrawer");
    Router.sliderDrawer = sliderDrawer;
}



