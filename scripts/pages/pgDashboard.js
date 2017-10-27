const extend = require('js-base/core/extend');
const PgDashboardDesign = require('ui/ui_pgDashboard');
const Router = require("sf-core/ui/router");
const Color = require('sf-core/ui/color');
const FlDashboardItem1 = require('components/FlDashboardItem1');
const FlDashboardItem2 = require('components/FlDashboardItem2');
const FlDashboardItem3 = require('components/FlDashboardItem3');
const FlDashboardItem4 = require('components/FlDashboardItem4');
const FlDashboardItem5 = require('components/FlDashboardItem5');
const dashboardService = require("../service/Dashboard");
const userService = require("../service/User");
const isTablet = require("../lib/isTablet");
const adjustHeaderBar = require("../lib/adjustHeaderBar");

const RGB_BLUE = [74, 144, 226];
const RGB_RED = [185, 54, 123];
const ARGB_BLUE = [63, 74, 144, 226];

const PgDashboard = extend(PgDashboardDesign)(
    // Constructor
    function(_super) {
        _super(this);

        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        this.imgNotification.onTouchEnded = function() {
            Router.go("pgCustomerProfile");
        };
        
        this.flHeaderLeft.onTouchEnded = function() {
            Router.sliderDrawer.show();
        };

        this.svMain.subscribeContext = function(e) {
            if (e.type == "new-styles") {
                Object.keys(e.data).forEach(function(key){
                    if (key === "layoutHeight") {
                        this.layout.height = e.data[key];
                    } else {
                        this[key] = e.data[key];
                    }
                }.bind(this))
            }
        }.bind(this.svMain);
    
        loadUI.call(this);
    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
    superOnShow();
    Router.sliderDrawer.enabled = true;
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    adjustHeaderBar(this);
    
    this.imgSignOut.onTouchEnded = function() {
        Router.goBack(isTablet ? "pgSignupTablet" : "pgSignupPhone");
    };
    
    this.dispatch({
        type: "invalidateContext"
    });
}

function addReservations(items) {
    var page = this;
    page.flReservationItems.children = page.flReservationItems.children || [];
    
    items.forEach(function(item, index) {
        var flDashboardItem1 = new FlDashboardItem1();
        flDashboardItem1.width = NaN;
        flDashboardItem1.height = 80;
        flDashboardItem1.lblItemType.text = item.orderType;
        flDashboardItem1.lblItemName.text = item.employee;
        flDashboardItem1.lblItemTitle.text = item.location;
        page.children[""]
        
        if (index === items.length - 1)
            flDashboardItem1.flLine.visible = false;
        if (item.location.toLowerCase() === "out of store") {
            flDashboardItem1.lblItemTitle.textColor = Color.create.apply(null, RGB_RED);
        }
        // TODO: Date
        page.flReservationItems.addChild(flDashboardItem1);
        page.flReservationItems.children["flDashboardItem1_"+index] = flDashboardItem1;
        page.flReservationItems.height += flDashboardItem1.height;
    });
}

function addTodos(items) {
    var page = this;
    page.flTodoItems.children = page.flTodoItems.children || [];
    
    items.forEach(function(item, index) {
        var flDashboardItem2 = new FlDashboardItem2();
        flDashboardItem2.width = NaN;
        flDashboardItem2.height = 80;
        flDashboardItem2.lblItemTitle.text = item.title;
        flDashboardItem2.lblItemName.text = item.type;
        flDashboardItem2.lblItemType.text = item.status;
        flDashboardItem2.flLine.visible = false;
        if (item.status.toLowerCase() === "overdue") {
            flDashboardItem2.backgroundColor =
                Color.create.apply(null, ARGB_BLUE);
            flDashboardItem2.imgExclamation.visible = true;
        }
        // TODO: Date
        page.flTodoItems.addChild(flDashboardItem2);
        page.flTodoItems.children["flDashboardItem2_"+index] = flDashboardItem2;
        page.flTodoItems.height += flDashboardItem2.height;
    });
}

function addOpenIncidents(items) {
    var page = this;
    page.flOpenIncidentItems.children = page.flOpenIncidentItems.children || [];
    
    items.forEach(function(item, index) {
        var flDashboardItem3 = new FlDashboardItem3();
        flDashboardItem3.width = NaN;
        flDashboardItem3.height = 80;
        flDashboardItem3.lblItemTitle.text = item.state;
        flDashboardItem3.lblItemName.text = item.employee;
        flDashboardItem3.lblItemType.text = item.title;
        if (index === items.length - 1)
            flDashboardItem3.flLine.visible = false;
        if (item.state.toLowerCase() === "completed") {
            flDashboardItem3.lblItemTitle.textColor =
                Color.create.apply(null, RGB_BLUE);
        }
        // TODO: Date
        page.flOpenIncidentItems.addChild(flDashboardItem3);
        page.flOpenIncidentItems.children["flDashboardItem3_"+index] = flDashboardItem3;
        page.flOpenIncidentItems.height += flDashboardItem3.height;
    });
}

function addStoreAndCorporateNews(items) {
    var page = this;
    page.flNewsItems.children = page.flNewsItems.children || [];
    items.forEach(function(item, index) {
        var flDashboardItem4 = new FlDashboardItem4();
        flDashboardItem4.width = NaN;
        flDashboardItem4.height = 80;
        flDashboardItem4.lblItemTitle.text = item.location;
        flDashboardItem4.lblItemName.text = item.employee;
        flDashboardItem4.lblItemType.text = item.type;
        // TODO: Date
        if (index === items.length - 1)
            flDashboardItem4.flLine.visible = false;
        page.flNewsItems.addChild(flDashboardItem4);
        page.flNewsItems.children["flDashboardItem4_"+index] = flDashboardItem4;
        page.flNewsItems.height += flDashboardItem4.height;
    });
}

function addIncomingShipments(items) {
    var page = this;
    page.flShipmentsItems.children = page.flShipmentsItems.children || [];

    items.forEach(function(item, index) {
        var flDashboardItem5 = new FlDashboardItem5();
        flDashboardItem5.width = NaN;
        flDashboardItem5.height = 80;
        flDashboardItem5.lblItemTitle.text = item.title;
        flDashboardItem5.lblItemName.text = item.type;
        flDashboardItem5.lblItemType.text = item.status;
        // TODO: Date
        if (index === items.length - 1)
            flDashboardItem5.flLine.visible = false;
        page.flShipmentsItems.addChild(flDashboardItem5);
        page.flShipmentsItems.children["flDashboardItem5_"+index] = flDashboardItem5;
        page.flShipmentsItems.height += flDashboardItem5.height;
    });
}

function addSocialActivities(items) {
    var page = this;
    page.flSocialActivityItems.children = page.flSocialActivityItems.children || [];
    
    items.forEach(function(item, index) {
        var flDashboardItem3 = new FlDashboardItem3();
        flDashboardItem3.width = NaN;
        flDashboardItem3.height = 80;
        flDashboardItem3.lblItemTitle.text = item.state;
        flDashboardItem3.lblItemName.text = item.employee;
        flDashboardItem3.lblItemType.text = item.title;
        // TODO: Date
        if (index === items.length - 1)
            flDashboardItem3.flLine.visible = false;
        page.flSocialActivityItems.addChild(flDashboardItem3);
        page.flSocialActivityItems.children["flDashboardItem3_"+index] = flDashboardItem3;
        page.flSocialActivityItems.height += flDashboardItem3.height;
    });
}

function addUserInfo(json) {
    var page = this;
    page.imgUser.loadFromUrl(json.picture);
    page.lblUserName.text = json.fullName;
    page.lblEmployeeId.text = "Employee ID: " + json.id;
    page.lblPosition.text = json.rating;
}

function addInformation(json) {
    var page = this;
    page.lblTaskNumber.text = json.pendingTaks;
    page.lblConversionPercentage.text = json.lastMonthSalesConversion;
    page.lblTargetPercentage.text = json.thisWeekTarget;
}

function loadUI() {
    var userJson = require("../sample-data/dashboardUser.json");
    var json = require("../sample-data/dashboardData.json");
    //userService.getUserData().then((userJson) => {
    addUserInfo.call(this, userJson);
    //    dashboardService.getDashboardData().then((json) => {
    addInformation.call(this, json.information);
    addReservations.call(this, json.reservations);
    addTodos.call(this, json.todo.items);
    addOpenIncidents.call(this, json.openIncidents);
    addStoreAndCorporateNews.call(this, json.storeAndCorporateNews);
    addIncomingShipments.call(this, json.incomingShipments);
    addSocialActivities.call(this, json.socialActivityMonitor);
    
    //    });
    //});
}

module && (module.exports = PgDashboard);
