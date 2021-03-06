(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("nestedtypes"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "nestedtypes"], factory);
	else if(typeof exports === 'object')
		exports["React"] = factory(require("react"), require("react-dom"), require("nestedtypes"));
	else
		root["React"] = factory(root["React"], root["ReactDOM"], root["Nested"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React    = __webpack_require__( 1 ),
	    ReactDOM = __webpack_require__( 2 ),
	    Nested   = __webpack_require__( 3 ),
	    $        = Nested.$;
	
	// extend React namespace
	var NestedReact = module.exports = Object.create( React );
	
	// listenToProps, listenToState, model, attributes, Model
	NestedReact.createClass = __webpack_require__( 4 );
	
	var ComponentView = __webpack_require__( 7 );
	
	// export hook to override base View class used...
	NestedReact.useView = function( View ){
	    NestedReact._BaseView = ComponentView.use( View );
	};
	
	NestedReact.useView( Nested.View );
	
	// React component for attaching views
	NestedReact.subview = __webpack_require__( 8 );
	
	var propTypes  = __webpack_require__( 6 );
	NestedReact.Node = propTypes.Node.value( null );
	NestedReact.Element = propTypes.Element.value( null );
	
	// Extend react components to have backbone-style jquery accessors
	var Component     = React.createClass( { render : function(){} } ),
	    BaseComponent = Object.getPrototypeOf( Component.prototype );
	
	Object.defineProperties( BaseComponent, {
	    el  : { get : function(){ return ReactDOM.findDOMNode( this ); } },
	    $el : { get : function(){ return $( this.el ); } },
	    $   : { value : function( sel ){ return this.$el.find( sel ); } }
	} );
	
	NestedReact.Link = __webpack_require__( 10 );


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var React      = __webpack_require__( 1 ),
	    Nested     = __webpack_require__( 3 ),
	    pureRender = __webpack_require__( 5 ),
	    propTypes  = __webpack_require__( 6 );
	
	function forceUpdate(){ this.forceUpdate(); }
	
	var Events = Object.assign( {
	    componentWillUnmount : function(){
	        this.stopListening();
	    }
	}, Nested.Events );
	
	function registerPropsListener( component, prevProps, name, events ){
	    var prevEmitter = prevProps[ name ],
	        emitter     = component.props[ name ];
	
	    if( prevEmitter !== emitter ){
	        prevEmitter && component.stopListening( prevEmitter );
	
	        if( emitter ){
	            if( typeof events === 'object' ){
	                component.listenTo( emitter, events );
	            }
	            else{
	                component.listenTo( emitter, events || emitter.triggerWhenChanged, forceUpdate );
	            }
	        }
	    }
	}
	
	function regHashPropsListeners( a_prevProps ){
	    var prevProps = a_prevProps || {},
	        updateOn  = this.listenToProps;
	
	    for( var prop in updateOn ){
	        registerPropsListener( this, prevProps, prop, updateOn[ prop ] );
	    }
	}
	
	var ListenToProps = {
	    componentDidMount  : regHashPropsListeners,
	    componentDidUpdate : regHashPropsListeners
	};
	
	function regArrayPropListeners( a_prevProps ){
	    var prevProps = a_prevProps || {},
	        updateOn  = this.listenToProps;
	
	    for( var i = 0; i < updateOn.length; i++ ){
	        registerPropsListener( this, prevProps, updateOn[ i ] )
	    }
	}
	
	var ListenToPropsArray = {
	    componentDidMount  : regArrayPropListeners,
	    componentDidUpdate : regArrayPropListeners
	};
	
	var ModelState = {
	    listenToState : 'change',
	    model         : null,
	
	    getInitialState : function(){
	        this.model = this.props._keepState || new this.Model();
	        // enable owner references in the model to access component props
	        this.model._owner = this;
	
	        return this.model;
	    },
	
	    // reference global store to fix model's store locator
	    getStore : function(){
	        return this.model._defaultStore;
	    },
	
	    componentDidMount : function(){
	        var events = this.listenToState;
	        events && this.listenTo( this.model, events, forceUpdate );
	    },
	
	    componentWillUnmount : function(){
	        this.model._owner = null;
	    }
	};
	
	function createClass( spec ){
	    var mixins = spec.mixins || ( spec.mixins = [] );
	
	
	    // process context specs...
	    var context = getTypeSpecs( spec, 'context' );
	    if( context ){
	        spec.contextTypes = propTypes.parseProps( context ).propTypes;
	        delete spec.context;
	    }
	
	    var childContext = getTypeSpecs( spec, 'childContext' );
	    if( childContext ){
	        spec.childContextTypes = propTypes.parseProps( childContext ).propTypes;
	        delete spec.childContext;
	    }
	
	    // process state spec...
	    var attributes = getTypeSpecs( spec, 'attributes', 'state' );
	    if( attributes ){
	        var BaseModel = spec.Model || Nested.Model;
	        spec.Model    = BaseModel.extend( { defaults : attributes } );
	        delete spec.state;
	    }
	
	    if( spec.Model ) mixins.push( ModelState );
	
	    // process props spec...
	    var props = getTypeSpecs( spec, 'props' );
	
	    if( props ){
	        var parsedProps = propTypes.parseProps( props );
	
	        spec.propTypes = parsedProps.propTypes;
	
	        if( parsedProps.defaults ){
	            spec.getDefaultProps = function(){
	                return parsedProps.defaults;
	            }
	        }
	
	        delete spec.props;
	    }
	
	    // process listenToProps spec
	    var listenToProps = spec.listenToProps;
	    if( listenToProps ){
	        if( typeof listenToProps === 'string' ){
	            spec.listenToProps = listenToProps.split( ' ' );
	            mixins.unshift( ListenToPropsArray );
	        }
	        else{
	            mixins.unshift( ListenToProps );
	        }
	    }
	
	    // add Events capabilities
	    mixins.push( Events );
	
	    // compile pure render mixin
	    if( spec.propTypes && spec.pureRender ){
	        mixins.push( pureRender( spec.propTypes ) );
	    }
	
	    var component = React.createClass( spec );
	
	    // attach lazily evaluated backbone View class
	    var NestedReact = this;
	
	    Object.defineProperty( component, 'View', {
	        get : function(){
	            return this._View || ( this._View = NestedReact._BaseView.extend( { reactClass : component } ) );
	        }
	    } );
	
	    return component;
	}
	
	function getTypeSpecs( spec, name1, name2 ){
	    var attributes = null;
	
	    for( var i = spec.mixins.length - 1; i >= 0; i-- ){
	        var mixin      = spec.mixins[ i ],
	            mixinAttrs = mixin[ name1 ] || ( name2 && mixin[ name2 ] );
	
	        if( mixinAttrs ){
	            attributes || ( attributes = {} );
	            Object.assign( attributes, mixinAttrs );
	        }
	    }
	
	    var specAttrs = spec[ name1 ] || ( name2 && spec[ name2 ] );
	    if( specAttrs ){
	        if( attributes ){
	            Object.assign( attributes, specAttrs );
	        }
	        else{
	            attributes = specAttrs;
	        }
	    }
	
	    return attributes;
	}
	
	module.exports = createClass;


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function( propTypes ){
	    var ctor      = [ 'var v;this._s=s&&s._changeToken' ],
	        isChanged = [ 'var v;return(s&&s._changeToken!==t._s)' ];
	
	    for( var name in propTypes ){
	        var propExpr = '((v=p.' + name + ')&&v._changeToken)||v';
	
	        ctor.push( 'this.' + name + '=' + propExpr );
	        isChanged.push( 't.' + name + '!==(' + propExpr + ')' );
	    }
	
	    var ChangeTokens = new Function( 'p', 's', ctor.join( ';' ) ),
	        isChanged    = new Function( 't', 'p', 's', isChanged.join( '||' ) );
	
	    ChangeTokens.prototype = null;
	
	    return {
	        _changeTokens : null,
	
	        shouldComponentUpdate : function( nextProps ){
	            return isChanged( this._changeTokens, nextProps, this.state );
	        },
	
	        componentDidMount  : function(){
	            this._changeTokens = new ChangeTokens( this.props, this.state );
	        },
	        componentDidUpdate : function(){
	            this._changeTokens = new ChangeTokens( this.props, this.state );
	        }
	    }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Nested = __webpack_require__( 3 ),
	    React  = __webpack_require__( 1 );
	
	function parseProps( props ){
	    var propTypes = {},
	        defaults,
	        modelProto = Nested.Model.defaults( props ).prototype;
	
	    modelProto.forEachAttr( modelProto.__attributes, function( spec, name ){
	        if( name !== 'id' ){
	            propTypes[ name ] = translateType( spec.type );
	
	            if( spec.value !== void 0 ){
	                defaults || ( defaults = {} );
	                defaults[ name ] = spec.value;
	            }
	        }
	    });
	
	    return {
	        propTypes : propTypes,
	        defaults : defaults
	    };
	}
	
	var PropTypes = React.PropTypes;
	
	function Node(){}
	function Element(){}
	
	function translateType( Type ){
	    switch( Type ){
	        case Number :
	        case Integer :
	            return PropTypes.number;
	        case String :
	            return PropTypes.string;
	        case Boolean :
	            return PropTypes.bool;
	        case Array :
	            return PropTypes.array;
	        case Function :
	            return PropTypes.func;
	        case Object :
	            return PropTypes.object;
	        case Node :
	            return PropTypes.node;
	        case Element :
	            return PropTypes.element;
	        case void 0 :
	        case null :
	            return PropTypes.any;
	        default:
	            return PropTypes.instanceOf( Type );
	    }
	}
	
	exports.Node = Node;
	exports.Element = Element;
	exports.parseProps = parseProps;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var React    = __webpack_require__( 1 ),
	    ReactDOM = __webpack_require__( 2 );
	
	function fastAssign( dest, source ){
	    for( var name in source ) {
	        dest[ name ] = source[ name ];
	    }
	
	    return dest;
	}
	
	module.exports.use = function( View ){
	    var dispose    = View.prototype.dispose || function(){},
	        setElement = View.prototype.setElement;
	
	    var ComponentView = View.extend( {
	        reactClass : null,
	        props      : {},
	        element    : null,
	
	        initialize : function( props ){
	            // memorise arguments to pass to React
	            this.options = props || {};
	        },
	
	        setElement : function(){
	            this.unmountComponent();
	            return setElement.apply( this, arguments );
	        },
	
	        // cached instance of react component...
	        component : null,
	        prevState : null,
	        
	        resize : function(){
	            Page.forceResize();
	        },
	
	        render : function(){
	            var options   = this.prevState ? fastAssign( { _keepState : this.prevState }, this.options ) : this.options,
	                element   = React.createElement( this.reactClass, options ),
	                component = ReactDOM.render( element, this.el );
	
	            this.component || this.mountComponent( component );
	        },
	
	        mountComponent : function( component ){
	            this.component = component;
	            this.prevState = null;
	
	            component.trigger && this.listenTo( component, 'all', function(){
	                this.trigger.apply( this, arguments );
	            } );
	        },
	
	        unmountComponent : function(){
	            var component = this.component;
	
	            if( component ){
	                this.prevState = component.model;
	
	                if( component.trigger ){
	                    this.stopListening( component );
	                }
	
	                ReactDOM.unmountComponentAtNode( this.el );
	                this.component = null;
	            }
	        },
	
	        dispose : function(){
	            this.unmountComponent();
	            return dispose.apply( this, arguments );
	        }
	    } );
	
	    Object.defineProperty( ComponentView.prototype, 'model', {
	        get : function(){
	            this.component || this.render();
	            return this.component && this.component.model;
	        }
	    } );
	
	    return ComponentView;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var React        = __webpack_require__( 1 ),
	    jsonNotEqual = __webpack_require__( 9 ).jsonNotEqual;
	
	module.exports = React.createClass( {
	    displayName : 'BackboneView',
	
	    propTypes : {
	        View    : React.PropTypes.func.isRequired,
	        options : React.PropTypes.object
	    },
	
	    shouldComponentUpdate : function( next ){
	        var props = this.props;
	        return next.View !== props.View || jsonNotEqual( next.options, props.options );
	    },
	
	    hasUnsavedChanges : function(){
	        var view = this.view;
	
	        return view && (
	                typeof view.hasUnsavedChanges === 'function' ? view.hasUnsavedChanges() : view.hasUnsavedChanges
	            );
	    },
	
	    render : function(){
	        return React.DOM.div( {
	            ref       : 'subview',
	            className : this.props.className
	        } );
	    },
	
	    componentDidMount    : function(){
	        this._mountView();
	    },
	
	    componentDidUpdate   : function(){
	        this._dispose();
	        this._mountView();
	    },
	
	    componentWillUnmount : function(){
	        this._dispose();
	    },
	
	    _mountView : function(){
	        var el = this.refs.subview,
	            p  = this.props;
	
	        var view = this.view = p.options ? new p.View( p.options ) : new p.View();
	
	        el.appendChild( view.el );
	        view.render();
	    },
	
	    _dispose : function(){
	        var view = this.view;
	        if( view ){
	            view.stopListening();
	            if( view.dispose ) view.dispose();
	            this.refs.subview.innerHTML = "";
	            this.view                   = null;
	        }
	    }
	} );

/***/ },
/* 9 */
/***/ function(module, exports) {

	// equality checking for deep JSON comparison of plain Array and Object
	var ArrayProto = Array.prototype,
	    ObjectProto = Object.prototype;
	
	exports.jsonNotEqual = jsonNotEqual;
	function jsonNotEqual( objA, objB) {
	    if (objA === objB) {
	        return false;
	    }
	
	    if (typeof objA !== 'object' || !objA ||
	        typeof objB !== 'object' || !objB ) {
	        return true;
	    }
	
	    var protoA = Object.getPrototypeOf( objA ),
	        protoB = Object.getPrototypeOf( objB );
	
	    if( protoA !== protoB ) return true;
	
	    if( protoA === ArrayProto ) return arraysNotEqual( objA, objB );
	    if( protoA === ObjectProto ) return objectsNotEqual( objA, objB );
	
	    return true;
	}
	
	function objectsNotEqual( objA, objB ){
	    var keysA = Object.keys(objA);
	    var keysB = Object.keys(objB);
	
	    if (keysA.length !== keysB.length) {
	        return true;
	    }
	
	    // Test for A's keys different from B.
	    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
	
	    for (var i = 0; i < keysA.length; i++) {
	        var key = keysA[i];
	        if ( !bHasOwnProperty( key ) || jsonNotEqual( objA[ key ], objB[ key ] )) {
	            return true;
	        }
	    }
	
	    return false;
	}
	
	function arraysNotEqual( a, b ){
	    if( a.length !== b.length ) return true;
	
	    for( var i = 0; i < a.length; i++ ){
	        if( jsonNotEqual( a[ i ], b[ i ] ) ) return true;
	    }
	
	    return false;
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Nested = __webpack_require__( 3 ),
	    Link   = __webpack_require__( 11 ).default;
	
	module.exports = Nested.Link = Link;
	
	Object.extend.attach( Link );
	
	/**
	 * Link to NestedType's model attribute.
	 * Strict evaluation of value, lazy evaluation of validation error.
	 * Links are cached in the models
	 */
	function ModelLink( model, attr, value ){
	    Link.call( this, value );
	    this.model = model;
	    this.attr  = attr;
	}
	
	ModelLink.prototype = Object.create( Link.prototype, {
	    constructor : { value : ModelLink },
	    set         : {
	        value : function( x ){
	            this.model[ this.attr ] = x;
	        }
	    },
	
	    error : {
	        get : function(){
	            if( this._error === void 0 ){
	                this._error = this.model.getValidationError( this.attr );
	            }
	
	            return this._error;
	        },
	
	        set : function( x ){
	            this._error = x;
	        }
	    }
	} );
	
	var ModelProto = Nested.Model.prototype;
	
	Object.defineProperty( ModelProto, 'links', {
	    get : function(){
	        return this._links || ( this._links = new this.Attributes( {} ) );
	    }
	});
	
	function cacheLink( links, model, key ){
	    var cached = links[ key ],
	        value = model[ key ];
	
	    return cached && cached.value === value ? cached
	                : links[ key ] = new ModelLink( model, key, value );
	}
	
	ModelProto.getLink = function( key ){
	    return cacheLink( this.links, this, key );
	};
	
	ModelProto.linkAll = function(){
	    var links = this.links;
	
	    for( var i = 0; i < arguments.length; i++ ){
	        cacheLink( links, this, arguments[ i ] );
	    }
	
	    return links;
	};
	
	/**
	 * Boolean link to presence of NestedType's model in collection.
	 * Strict evaluation of value, no error.
	 * Safe implementation of _changeToken.
	 * @param collection
	 * @param model
	 * @constructor
	 */
	function CollectionLink( collection, model ){
	    Link.call( this, Boolean( collection._byId[ model.cid ] ) );
	    this.collection = collection;
	    this.model      = model;
	}
	
	CollectionLink.prototype = Object.create( Link.prototype, {
	    constructor : { value : CollectionLink },
	    set : {
	        value : function( x ){
	            this.collection.toggle( this.model, x );
	        }
	    }
	} );
	
	var CollectionProto = Nested.Collection.prototype;
	
	CollectionProto.hasLink = function( model ){
	    return new CollectionLink( this, model );
	};
	
	CollectionProto.getLink = function( prop ){
	    var collection = this;
	    return Link.value( collection[ prop ], function( x ){ collection[ prop ] = x; });
	};
	
	function ModelDeepLink( model, path, options ){
	    Link.call( this, model.deepGet( path ) );
	    this.model   = model;
	    this.path    = path;
	    this.options = options;
	}
	
	ModelDeepLink.prototype = Object.create( Link.prototype, {
	    constructor : { value : ModelDeepLink },
	
	    error : {
	        get : function(){
	            if( this._error === void 0 ){
	                this._error = this.model.deepValidationError( this.path ) || null;
	            }
	
	            return this._error;
	        },
	
	        set : function( x ){
	            this._error = x;
	        }
	    },
	
	    _changeToken : {
	        get : function(){ return this.model._changeToken; }
	    }
	} );
	
	ModelDeepLink.prototype.set = function( x ){
	    this.model.deepSet( this.path, x, this.options );
	};
	
	ModelProto.deepLink = function( path, options ){
	    return new ModelDeepLink( this, path, options )
	};
	
	Nested.link = function( reference ){
	    var getMaster = Nested.parseReference( reference );
	
	    function setLink( value ){
	        var link = getMaster.call( this );
	        link && link.set( value );
	    }
	
	    function getLink(){
	        var link = getMaster.call( this );
	        return link && link.value;
	    }
	
	    var LinkAttribute = Nested.attribute.Type.extend( {
	        createPropertySpec : function(){
	            return {
	                // call to optimized set function for single argument. Doesn't work for backbone types.
	                set : setLink,
	
	                // attach get hook to the getter function, if present
	                get : getLink
	            }
	        },
	
	        set : setLink
	    } );
	
	    var options       = Nested.attribute( { toJSON : false } );
	    options.Attribute = LinkAttribute;
	    return options;
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Advanced React links for purely functional two-way data binding
	 *
	 * MIT License, (c) 2016 Vlad Balin, Volicon.
	 */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	// Main Link class. All links must extend it.
	var Link = (function () {
	    // create 
	    function Link(value) {
	        this.value = value;
	    }
	    // Create link to componen't state
	    Link.state = function (component, key) {
	        var value = component.state[key], cache = component.links || (component.links = {}), cached = cache[key];
	        return cached && cached.value === value ? cached : cache[key] = new StateLink(value, component, key);
	    };
	    ;
	    // Ensure that listed links are cached. Return links cache.
	    Link.all = function (component) {
	        var state = component.state, links = component.links || (component.links = {});
	        for (var i = 1; i < arguments.length; i++) {
	            var key = arguments[i], value = state[key], cached = links[key];
	            if (!cached || cached.value !== value) {
	                links[key] = new StateLink(value, component, key);
	            }
	        }
	        return links;
	    };
	    // Create custom link to arbitrary value
	    Link.value = function (value, set) {
	        return new CustomLink(value, set);
	    };
	    Object.defineProperty(Link.prototype, "validationError", {
	        // DEPRECATED: Old error holder for backward compatibility with Volicon code base
	        get: function () { return this.error; },
	        enumerable: true,
	        configurable: true
	    });
	    Link.prototype.onChange = function (handler) {
	        var _this = this;
	        return new CloneLink(this, function (x) {
	            handler(x);
	            _this.set(x);
	        });
	    };
	    // DEPRECATED: Old React method for backward compatibility
	    Link.prototype.requestChange = function (x) {
	        this.set(x);
	    };
	    // Immediately update the link value using given transform function.
	    Link.prototype.update = function (transform, e) {
	        var next = transform(this.clone(), e);
	        next === void 0 || this.set(next);
	    };
	    // Create new link which applies transform function on set.
	    Link.prototype.pipe = function (handler) {
	        var _this = this;
	        return new CloneLink(this, function (x) {
	            var next = handler(x);
	            next === void 0 || _this.set(next);
	        });
	    };
	    // Create UI event handler function which will update the link with a given transform function.
	    Link.prototype.action = function (transform) {
	        var _this = this;
	        return function (e) { return _this.update(transform, e); };
	    };
	    Link.prototype.equals = function (truthyValue) {
	        return new EqualsLink(this, truthyValue);
	    };
	    // Array-only links methods
	    Link.prototype.contains = function (element) {
	        return new ContainsLink(this, element);
	    };
	    Link.prototype.push = function () {
	        var array = arrayHelpers.clone(this.value);
	        Array.prototype.push.apply(array, arguments);
	        this.set(array);
	    };
	    Link.prototype.unshift = function () {
	        var array = arrayHelpers.clone(this.value);
	        Array.prototype.unshift.apply(array, arguments);
	        this.set(array);
	    };
	    Link.prototype.splice = function () {
	        var array = arrayHelpers.clone(this.value);
	        Array.prototype.splice.apply(array, arguments);
	        this.set(array);
	    };
	    // Array and objects universal collection methods
	    Link.prototype.map = function (iterator) {
	        return helpers(this.value).map(this, iterator);
	    };
	    Link.prototype.remove = function (key) {
	        var value = this.value, _ = helpers(value);
	        this.set(_.remove(_.clone(value), key));
	    };
	    Link.prototype.at = function (key) {
	        return new ChainedLink(this, key);
	    };
	    Link.prototype.clone = function () {
	        var value = this.value;
	        return helpers(value).clone(value);
	    };
	    Link.prototype.pick = function () {
	        var links = {};
	        for (var i = 0; i < arguments.length; i++) {
	            var key = arguments[i];
	            links[key] = new ChainedLink(this, key);
	        }
	        return links;
	    };
	    /**
	     * Validate link with validness predicate and optional custom error object. Can be chained.
	     */
	    Link.prototype.check = function (whenValid, error) {
	        if (!this.error && !whenValid(this.value)) {
	            this.error = error || whenValid.error || defaultError;
	        }
	        return this;
	    };
	    return Link;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Link;
	var CustomLink = (function (_super) {
	    __extends(CustomLink, _super);
	    function CustomLink(value, set) {
	        _super.call(this, value);
	        this.set = set;
	    }
	    CustomLink.prototype.set = function (x) { };
	    return CustomLink;
	}(Link));
	exports.CustomLink = CustomLink;
	var CloneLink = (function (_super) {
	    __extends(CloneLink, _super);
	    function CloneLink(parent, set) {
	        _super.call(this, parent.value);
	        this.set = set;
	        var error = parent.error;
	        if (error)
	            this.error = error;
	    }
	    CloneLink.prototype.set = function (x) { };
	    return CloneLink;
	}(Link));
	exports.CloneLink = CloneLink;
	var StateLink = (function (_super) {
	    __extends(StateLink, _super);
	    function StateLink(value, component, key) {
	        _super.call(this, value);
	        this.component = component;
	        this.key = key;
	    }
	    StateLink.prototype.set = function (x) {
	        this.component.setState((_a = {}, _a[this.key] = x, _a));
	        var _a;
	    };
	    return StateLink;
	}(Link));
	exports.StateLink = StateLink;
	var EqualsLink = (function (_super) {
	    __extends(EqualsLink, _super);
	    function EqualsLink(parent, truthyValue) {
	        _super.call(this, parent.value === truthyValue);
	        this.parent = parent;
	        this.truthyValue = truthyValue;
	    }
	    EqualsLink.prototype.set = function (x) {
	        this.parent.set(x ? this.truthyValue : null);
	    };
	    return EqualsLink;
	}(Link));
	exports.EqualsLink = EqualsLink;
	var ContainsLink = (function (_super) {
	    __extends(ContainsLink, _super);
	    function ContainsLink(parent, element) {
	        _super.call(this, parent.value.indexOf(element) >= 0);
	        this.parent = parent;
	        this.element = element;
	    }
	    ContainsLink.prototype.set = function (x) {
	        var _this = this;
	        var next = Boolean(x);
	        if (this.value !== next) {
	            var arr = this.parent.value, nextValue = x ? arr.concat(this.element) : arr.filter(function (el) { return el !== _this.element; });
	            this.parent.set(nextValue);
	        }
	    };
	    return ContainsLink;
	}(Link));
	exports.ContainsLink = ContainsLink;
	var defaultError = 'Invalid value';
	/**
	 * Link to array or object element enclosed in parent link.
	 * Performs purely functional update of the parent, shallow copying its value on `set`.
	 */
	var ChainedLink = (function (_super) {
	    __extends(ChainedLink, _super);
	    function ChainedLink(parent, key) {
	        _super.call(this, parent.value[key]);
	        this.parent = parent;
	        this.key = key;
	    }
	    ChainedLink.prototype.remove = function (key) {
	        if (key === void 0) {
	            this.parent.remove(this.key);
	        }
	        else {
	            _super.prototype.remove.call(this, key);
	        }
	    };
	    // Set new element value to parent array or object, performing purely functional update.
	    ChainedLink.prototype.set = function (x) {
	        var _this = this;
	        if (this.value !== x) {
	            this.parent.update(function (value) {
	                value[_this.key] = x;
	                return value;
	            });
	        }
	    };
	    ;
	    return ChainedLink;
	}(Link));
	exports.ChainedLink = ChainedLink;
	var ArrayProto = Array.prototype, ObjectProto = Object.prototype;
	function helpers(value) {
	    if (value && typeof value === 'object') {
	        switch (Object.getPrototypeOf(value)) {
	            case ArrayProto: return arrayHelpers;
	            case ObjectProto: return objectHelpers;
	        }
	    }
	    return dummyHelpers;
	}
	// Do nothing for types other than Array and plain Object.
	var dummyHelpers = {
	    clone: function (value) { return value; },
	    map: function (link, fun) { return []; },
	    remove: function (value) { return value; }
	};
	// `map` and `clone` for plain JS objects
	var objectHelpers = {
	    // Map through the link to object
	    map: function (link, iterator) {
	        var hash = link.value;
	        var mapped = [];
	        for (var key in hash) {
	            var element = iterator(link.at(key), key);
	            element === void 0 || (mapped.push(element));
	        }
	        return mapped;
	    },
	    remove: function (object, key) {
	        delete object[key];
	        return object;
	    },
	    // Shallow clone plain JS object
	    clone: function (object) {
	        var cloned = {};
	        for (var key in object) {
	            cloned[key] = object[key];
	        }
	        return cloned;
	    }
	};
	// `map` and `clone` helpers for arrays.
	var arrayHelpers = {
	    // Shallow clone array
	    clone: function (array) {
	        return array.slice();
	    },
	    remove: function (array, i) {
	        array.splice(i, 1);
	        return array;
	    },
	    // Map through the link to array
	    map: function (link, iterator) {
	        var mapped = [], array = link.value;
	        for (var i = 0; i < array.length; i++) {
	            var y = iterator(link.at(i), i);
	            y === void 0 || (mapped.push(y));
	        }
	        return mapped;
	    }
	};
	//# sourceMappingURL=valuelink.js.map

/***/ }
/******/ ])
});
;
//# sourceMappingURL=nestedreact.js.map