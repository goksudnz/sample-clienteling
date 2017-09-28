(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Context", "@smartface/styler/lib/utils/merge"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Context"), require("@smartface/styler/lib/utils/merge"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Context, global.merge);
    global.StyleContext = mod.exports;
  }
})(this, function (exports, _Context, _merge) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fromSFComponent = fromSFComponent;
  exports.fromObject = fromObject;
  exports.fromArray = fromArray;
  exports.makeStylable = makeStylable;
  exports.createStyleContext = createStyleContext;

  var _Context2 = _interopRequireDefault(_Context);

  var _merge2 = _interopRequireDefault(_merge);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function hooks(hooksList) {
    return function hookMaybe(hook) {
      return hooksList ? hooksList(hook) : null;
      // ? hooksList[hook] : elseValue;
    };
  }

  /**
   * Create styleContext tree from a SF Component and flat component tree to create actors
   * 
   * @param {*} component - a SF Component
   * @param {string} name - component name
   * @param {function} mapper
   */
  function fromSFComponent(component, name, initialClassNameMap) {
    var hooksList = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var flatted = {};

    function collect(component, name, initialClassNameMap) {
      var newComp = makeStylable(component, initialClassNameMap(name), name, hooks(hooksList));
      flat(name, newComp);

      component.children && Object.keys(component.children).forEach(function (child) {
        collect(component.children[child], name + "_" + child, initialClassNameMap);
      });
    }

    function flat(name, comp) {
      flatted[name] = comp;
    }

    collect(component, name, initialClassNameMap);

    return createStyleContext(flatted, hooks(hooksList));
  }

  /**
   * Creates context from a children hash
   */
  function fromObject(children, maker, mapper) {
    return Object.keys(children).reduce(function (acc, child) {
      acc[child] = maker(children[child], child, mapper);
      return acc;
    }, {});
  }

  /**
   * Creates context from an array
   *
   */
  function fromArray(children, maker, mapper) {
    return children.map(function (child) {
      return maker(child, mapper);
    });
  }

  function makeStylable(component, className, name, hooks) {
    return new (function () {
      function Stylable() {
        _classCallCheck(this, Stylable);

        this.name = name;
        this.initialClassName = className;
        this.classNames = [className];
        this.component = component;
        this.styles = {};
        this.isUgly = true;
      }

      Stylable.prototype.setStyles = function setStyles(styles) {
        var _this = this;

        var reduceDiffStyleHook = hooks("reduceDiffStyleHook");
        
        var diffReducer = reduceDiffStyleHook ? reduceDiffStyleHook(this.styles, styles) : function (acc, key) {
          if (_this.styles[key] !== undefined) {
            if (_this.styles[key] !== styles[key]) {
              acc[key] = styles[key];
            } else {
              acc[key] = styles[key];
            }
          }

          return acc;
        };

        var diff = Object.keys(styles).reduce(diffReducer, {});
        
        // if(this.name.indexOf("flBanner") > -1)
        //   console.log(this.name+"="+flush("", diff));

        var beforeHook = hooks("beforeStyleDiffAssign");
        beforeHook && (diff = beforeHook(diff));

        // if(this.name !== "pgSignupPhone_flMain_flBanner" && this.name.indexOf("flBanner") > -1)
        //   console.log(this.name+" : "+flush("",diff)+" : "+flush("", styles));
          
        function flush(str="", obj){
          Object.keys(obj).forEach(function (key) {
            if(obj[key] != null && obj[key] instanceof Object)
              str += key+": "+flush("", obj[key])+", ";
            else
              str += key+": "+obj[key]+", ";
          });
          
          return "{ "+str.trim(", ")+" }";
        }
        
       /* var keys = [
        "flexGrow",
      	"marginLeft",
      	"left",
      	"top",
      	"paddingLeft",
      ]*/
      
      // if(this.component.flexGrow === 0){
      //   this.component.flexGrow = -1
      // }
        
        try {
          this.component.subscribeContext
            ? Object.keys(diff).length && this.component.subscribeContext({type:"new styles", data: diff})
            : Object.keys(diff).length && Object.keys(diff).forEach(function(key) {
              // if((this.name === "pgSignupPhone_flMain") || (!keys.some(k => k == key) && this.name !== "pgSignupPhone_flMain_flBanner" && this.name.indexOf("flBanner") > -1)){

              if(key == "scrollEnabled"){
                this.component.ios && (this.component.ios.scrollEnabled = diff[key]);
              } else if(this.component[key] !== diff[key]){
                this.component[key] = diff[key];
              }
              
              // if(key ==  "flexGrow")
                // console.log(this.name+" : "+key+":"+diff[key]);
              // }
            }.bind(this));
        } catch(e){
          throw new Error(JSON.stringify(diff)+" is invalid. "+e.message);
        }
        
        var afterHook = hooks("afterStyleDiffAssign");
        afterHook && (styles = afterHook(styles));

        this.styles = styles;
      };

      Stylable.prototype.setContext = function setContext(context) {
        var _this2 = this;

        this.context = context;
        component.setContextDispatcher && component.setContextDispatcher(function (action) {
          _this2.context.dispatch(action, _this2.name);
        });
      };

      Stylable.prototype.getStyles = function getStyles() {
        return Object.assign({}, this.styles);
      };
      
      Stylable.prototype.setUgly = function getStyles(value) {
        return this.isUgly = value;
      };

      Stylable.prototype.getInitialClassName = function getInitialClassName() {
        return this.initialClassName;
      };

      Stylable.prototype.getClassName = function getClassName() {
        return this.classNames.join(" ");
      };

      Stylable.prototype.classNamesCount = function classNamesCount() {
        return this.classNames.length;
      };

      Stylable.prototype.removeClassName = function removeClassName(className) {
        if (this.hasClassName(className)) {
          this.isUgly = true;
          this.classNames = this.classNames.filter(function (cname) {
            return cname !== className;
          });
        }

        return this.getClassName();
      };

      Stylable.prototype.resetClassNames = function resetClassNames() {
        var classNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        this.classNames = classNames.slice() || [this.getInitialClassName()];
        this.isUgly = true;
      };

      Stylable.prototype.hasClassName = function hasClassName(className) {
        return this.classNames.some(function (cname) {
          return cname === className;
        });
      };

      Stylable.prototype.pushClassName = function pushClassName(className) {
        if (!this.hasClassName(className)) {
          this.classNames.push(className);
          this.isUgly = true;
        }

        return this.getClassName();
      };

      Stylable.prototype.addClassName = function addClassName(className, index) {
        if (!this.hasClassName(className)) {
          this.classNames.splice(index, 1, className);
          this.isUgly = true;
        }

        return this.getClassName();
      };

      Stylable.prototype.dispose = function dispose() {
        this.component = null;
        this.context = null;
        this.styles = null;
        this.component.setContextDispatcher && this.component.setContextDispatcher(null);
      };

      return Stylable;
    }())();
  }

  function createStyleContext(actors, hooks) {
    var context;

    return function composeContext(styler, reducer, filters) {
      var latestState = context ? context.getState() : {};
      context && context.dispose();

      context = (0, _Context2.default)(actors, function contextUpdater(context, action, target) {
        var state = context.getState(),
            newState = state;

        if (target || action.type == _Context.INIT_CONTEXT_ACTION_TYPE) {
          newState = reducer(state, context.actors, action, target);
          // state is not changed
          if (newState === state) {
            // return current state instance
            return state;
          }
        }

        Object.keys(context.actors).forEach(function setInitialStyles(name) {
          var comp = context.actors[name];

          if (comp.isUgly === true || action.type === _Context.INIT_CONTEXT_ACTION_TYPE) {
            
            var className = context.actors[name].getClassName();
            var beforeHook = hooks("beforeAssignComponentStyles");
            beforeHook && (className = beforeHook(name, className));
            var styles;
            
            try {
              styles = styler(className)();
            } catch (e) {
              console.log(e.message);
            }
            
            context.actors[name].setStyles(styles);
            comp.isUgly = false;
          }
        });

        latestState = newState;

        return newState;
      }, latestState);

      Object.keys(context.actors).forEach(function assignContext(name) {
        context.actors[name].isUgly = true;
        context.actors[name].setContext(context);
      });

      return context;
    };
  }
});