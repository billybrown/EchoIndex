/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );

/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {

'use strict';

var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
  module.exports = defineDocReady( require('eventie') );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( window );

/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

/**
 * matchesSelector v1.0.3
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( ElemProto ) {

  'use strict';

  var matchesMethod = ( function() {
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  // ----- match ----- //

  function match( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  }

  // ----- appendToFragment ----- //

  function checkParent( elem ) {
    // not needed if already has parent
    if ( elem.parentNode ) {
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild( elem );
  }

  // ----- query ----- //

  // fall back to using QSA
  // thx @jonathantneal https://gist.github.com/3062955
  function query( elem, selector ) {
    // append to fragment if no parent
    checkParent( elem );

    // match elem with all selected elems of parent
    var elems = elem.parentNode.querySelectorAll( selector );
    for ( var i=0, len = elems.length; i < len; i++ ) {
      // return true if match
      if ( elems[i] === elem ) {
        return true;
      }
    }
    // otherwise return false
    return false;
  }

  // ----- matchChild ----- //

  function matchChild( elem, selector ) {
    checkParent( elem );
    return match( elem, selector );
  }

  // ----- matchesSelector ----- //

  var matchesSelector;

  if ( matchesMethod ) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = document.createElement('div');
    var supportsOrphans = match( div, 'div' );
    matchesSelector = supportsOrphans ? match : matchChild;
  } else {
    matchesSelector = query;
  }

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( function() {
      return matchesSelector;
    });
  } else if ( typeof exports === 'object' ) {
    module.exports = matchesSelector;
  }
  else {
    // browser global
    window.matchesSelector = matchesSelector;
  }

})( Element.prototype );

/**
 * Fizzy UI utils v1.0.1
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  /*global define: false, module: false, require: false */
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'doc-ready/doc-ready',
      'matches-selector/matches-selector'
    ], function( docReady, matchesSelector ) {
      return factory( window, docReady, matchesSelector );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('doc-ready'),
      require('desandro-matches-selector')
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.docReady,
      window.matchesSelector
    );
  }

}( window, function factory( window, docReady, matchesSelector ) {

'use strict';

var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- isArray ----- //
  
var objToString = Object.prototype.toString;
utils.isArray = function( obj ) {
  return objToString.call( obj ) == '[object Array]';
};

// ----- makeArray ----- //

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  var ary = [];
  if ( utils.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
};

// ----- indexOf ----- //

// index of helper cause IE8
utils.indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = utils.indexOf( ary, obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- isElement ----- //

// http://stackoverflow.com/a/384380/182183
utils.isElement = ( typeof HTMLElement == 'function' || typeof HTMLElement == 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj == 'object' &&
      obj.nodeType == 1 && typeof obj.nodeName == 'string';
  };

// ----- setText ----- //

utils.setText = ( function() {
  var setTextProperty;
  function setText( elem, text ) {
    // only check setTextProperty once
    setTextProperty = setTextProperty || ( document.documentElement.textContent !== undefined ? 'textContent' : 'innerText' );
    elem[ setTextProperty ] = text;
  }
  return setText;
})();

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !utils.isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have a selector
    if ( selector ) {
      // filter siblings
      if ( matchesSelector( elem, selector ) ) {
        ffElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( selector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        ffElems.push( childElems[j] );
      }
    } else {
      ffElems.push( elem );
    }
  }

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    if ( timeout ) {
      clearTimeout( timeout );
    }
    var args = arguments;

    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold || 100 );
  };
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-option attribute
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
    var dataAttr = 'data-' + dashedNamespace + '-options';

    for ( var i=0, len = elems.length; i < len; i++ ) {
      var elem = elems[i];
      var attr = elem.getAttribute( dataAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' +
            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
            error );
        }
        continue;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('layoutname')
      var jQuery = window.jQuery;
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    }
  });
};

// -----  ----- //

return utils;

}));

/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {

'use strict';

var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( function() {
    return getStyleProperty;
  });
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = getStyleProperty;
} else {
  // browser global
  window.getStyleProperty = getStyleProperty;
}

})( window );

/*!
 * getSize v1.2.2
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false, console: false */

( function( window, undefined ) {

'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  var getComputedStyle = window.getComputedStyle;
  getStyle = ( function() {
    var getStyleFn = getComputedStyle ?
      function( elem ) {
        return getComputedStyle( elem, null );
      } :
      function( elem ) {
        return elem.currentStyle;
      };

      return function getStyle( elem ) {
        var style = getStyleFn( elem );
        if ( !style ) {
          logError( 'Style returned ' + style +
            '. Are you running this code in a hidden iframe on Firefox? ' +
            'See http://bit.ly/getsizebug1' );
        }
        return style;
      };
  })();

  // -------------------------- box sizing -------------------------- //

  boxSizingProp = getStyleProperty('boxSizing');

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox measures the inner-width
   */
  if ( boxSizingProp ) {
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style[ boxSizingProp ] = 'border-box';

    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );

    isBoxSizeOuter = getStyleSize( style.width ) === 200;
    body.removeChild( div );
  }

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD for RequireJS
  define( [ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = defineGetSize( require('desandro-get-style-property') );
} else {
  // browser global
  window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

/*!
 * Unipointer v1.1.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */
/*global define: false, module: false, require: false */

( function( window, factory ) {
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.Unipointer = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

}( window, function factory( window, EventEmitter, eventie ) {

'use strict';

function noop() {}

function Unipointer() {}

// inherit EventEmitter
Unipointer.prototype = new EventEmitter();

Unipointer.prototype.bindStartEvent = function( elem ) {
  this._bindStartEvent( elem, true );
};

Unipointer.prototype.unbindStartEvent = function( elem ) {
  this._bindStartEvent( elem, false );
};

/**
 * works as unbinder, as you can ._bindStart( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
Unipointer.prototype._bindStartEvent = function( elem, isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  var bindMethod = isBind ? 'bind' : 'unbind';

  if ( window.navigator.pointerEnabled ) {
    // W3C Pointer Events, IE11. See https://coderwall.com/p/mfreca
    eventie[ bindMethod ]( elem, 'pointerdown', this );
  } else if ( window.navigator.msPointerEnabled ) {
    // IE10 Pointer Events
    eventie[ bindMethod ]( elem, 'MSPointerDown', this );
  } else {
    // listen for both, for devices like Chrome Pixel
    eventie[ bindMethod ]( elem, 'mousedown', this );
    eventie[ bindMethod ]( elem, 'touchstart', this );
  }
};

// trigger handler methods for events
Unipointer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// returns the touch that we're keeping track of
Unipointer.prototype.getTouch = function( touches ) {
  for ( var i=0, len = touches.length; i < len; i++ ) {
    var touch = touches[i];
    if ( touch.identifier == this.pointerIdentifier ) {
      return touch;
    }
  }
};

// ----- start event ----- //

Unipointer.prototype.onmousedown = function( event ) {
  // dismiss clicks from right or middle buttons
  var button = event.button;
  if ( button && ( button !== 0 && button !== 1 ) ) {
    return;
  }
  this._pointerDown( event, event );
};

Unipointer.prototype.ontouchstart = function( event ) {
  this._pointerDown( event, event.changedTouches[0] );
};

Unipointer.prototype.onMSPointerDown =
Unipointer.prototype.onpointerdown = function( event ) {
  this._pointerDown( event, event );
};

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Unipointer.prototype._pointerDown = function( event, pointer ) {
  // dismiss other pointers
  if ( this.isPointerDown ) {
    return;
  }

  this.isPointerDown = true;
  // save pointer identifier to match up touch events
  this.pointerIdentifier = pointer.pointerId !== undefined ?
    // pointerId for pointer events, touch.indentifier for touch events
    pointer.pointerId : pointer.identifier;

  this.pointerDown( event, pointer );
};

Unipointer.prototype.pointerDown = function( event, pointer ) {
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// hash of events to be bound after start event
var postStartEvents = {
  mousedown: [ 'mousemove', 'mouseup' ],
  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
  MSPointerDown: [ 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel' ]
};

Unipointer.prototype._bindPostStartEvents = function( event ) {
  if ( !event ) {
    return;
  }
  // get proper events to match start event
  var events = postStartEvents[ event.type ];
  // IE8 needs to be bound to document
  var node = event.preventDefault ? window : document;
  // bind events to node
  for ( var i=0, len = events.length; i < len; i++ ) {
    var evnt = events[i];
    eventie.bind( node, evnt, this );
  }
  // save these arguments
  this._boundPointerEvents = {
    events: events,
    node: node
  };
};

Unipointer.prototype._unbindPostStartEvents = function() {
  var args = this._boundPointerEvents;
  // IE8 can trigger dragEnd twice, check for _boundEvents
  if ( !args || !args.events ) {
    return;
  }

  for ( var i=0, len = args.events.length; i < len; i++ ) {
    var event = args.events[i];
    eventie.unbind( args.node, event, this );
  }
  delete this._boundPointerEvents;
};

// ----- move event ----- //

Unipointer.prototype.onmousemove = function( event ) {
  this._pointerMove( event, event );
};

Unipointer.prototype.onMSPointerMove =
Unipointer.prototype.onpointermove = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerMove( event, event );
  }
};

Unipointer.prototype.ontouchmove = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerMove( event, touch );
  }
};

/**
 * pointer move
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
Unipointer.prototype._pointerMove = function( event, pointer ) {
  this.pointerMove( event, pointer );
};

// public
Unipointer.prototype.pointerMove = function( event, pointer ) {
  this.emitEvent( 'pointerMove', [ event, pointer ] );
};

// ----- end event ----- //


Unipointer.prototype.onmouseup = function( event ) {
  this._pointerUp( event, event );
};

Unipointer.prototype.onMSPointerUp =
Unipointer.prototype.onpointerup = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerUp( event, event );
  }
};

Unipointer.prototype.ontouchend = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerUp( event, touch );
  }
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
Unipointer.prototype._pointerUp = function( event, pointer ) {
  this._pointerDone();
  this.pointerUp( event, pointer );
};

// public
Unipointer.prototype.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
Unipointer.prototype._pointerDone = function() {
  // reset properties
  this.isPointerDown = false;
  delete this.pointerIdentifier;
  // remove events
  this._unbindPostStartEvents();
  this.pointerDone();
};

Unipointer.prototype.pointerDone = noop;

// ----- pointer cancel ----- //

Unipointer.prototype.onMSPointerCancel =
Unipointer.prototype.onpointercancel = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerCancel( event, event );
  }
};

Unipointer.prototype.ontouchcancel = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerCancel( event, touch );
  }
};

/**
 * pointer cancel
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
Unipointer.prototype._pointerCancel = function( event, pointer ) {
  this._pointerDone();
  this.pointerCancel( event, pointer );
};

// public
Unipointer.prototype.pointerCancel = function( event, pointer ) {
  this.emitEvent( 'pointerCancel', [ event, pointer ] );
};

// -----  ----- //

// utility function for getting x/y cooridinates from event, because IE8
Unipointer.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX !== undefined ? pointer.pageX : pointer.clientX,
    y: pointer.pageY !== undefined ? pointer.pageY : pointer.clientY
  };
};

// -----  ----- //

return Unipointer;

}));

/*!
 * Tap listener v1.1.1
 * listens to taps
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  /*global define: false, module: false, require: false */
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'unipointer/unipointer'
    ], function( Unipointer ) {
      return factory( window, Unipointer );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('unipointer')
    );
  } else {
    // browser global
    window.TapListener = factory(
      window,
      window.Unipointer
    );
  }

}( window, function factory( window, Unipointer ) {

'use strict';

// handle IE8 prevent default
function preventDefaultEvent( event ) {
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

// --------------------------  TapListener -------------------------- //

function TapListener( elem ) {
  this.bindTap( elem );
}

// inherit Unipointer & EventEmitter
TapListener.prototype = new Unipointer();

/**
 * bind tap event to element
 * @param {Element} elem
 */
TapListener.prototype.bindTap = function( elem ) {
  if ( !elem ) {
    return;
  }
  this.unbindTap();
  this.tapElement = elem;
  this._bindStartEvent( elem, true );
};

TapListener.prototype.unbindTap = function() {
  if ( !this.tapElement ) {
    return;
  }
  this._bindStartEvent( this.tapElement, true );
  delete this.tapElement;
};

var pointerDown = TapListener.prototype.pointerDown;

TapListener.prototype.pointerDown = function( event ) {
  // prevent default event for touch, disables tap then click
  if ( event.type == 'touchstart' ) {
    preventDefaultEvent( event );
  }
  pointerDown.apply( this, arguments );
};

var isPageOffset = window.pageYOffset !== undefined;
/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
TapListener.prototype.pointerUp = function( event, pointer ) {
  var pointerPoint = Unipointer.getPointerPoint( pointer );
  var boundingRect = this.tapElement.getBoundingClientRect();
  // standard or IE8 scroll positions
  var scrollX = isPageOffset ? window.pageXOffset : document.body.scrollLeft;
  var scrollY = isPageOffset ? window.pageYOffset : document.body.scrollTop;
  // calculate if pointer is inside tapElement
  var isInside = pointerPoint.x >= boundingRect.left + scrollX &&
    pointerPoint.x <= boundingRect.right + scrollX &&
    pointerPoint.y >= boundingRect.top + scrollY &&
    pointerPoint.y <= boundingRect.bottom + scrollY;
  // trigger callback if pointer is inside element
  if ( isInside ) {
    this.emitEvent( 'tap', [ event, pointer ] );
  }
};

TapListener.prototype.destroy = function() {
  this.pointerDone();
  this.unbindTap();
};

// -----  ----- //

return TapListener;

}));

/*!
 * Unidragger v1.1.5
 * Draggable base class
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  /*global define: false, module: false, require: false */
  'use strict';
  // universal module definition

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'eventie/eventie',
      'unipointer/unipointer'
    ], function( eventie, Unipointer ) {
      return factory( window, eventie, Unipointer );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('eventie'),
      require('unipointer')
    );
  } else {
    // browser global
    window.Unidragger = factory(
      window,
      window.eventie,
      window.Unipointer
    );
  }

}( window, function factory( window, eventie, Unipointer ) {

'use strict';

// -----  ----- //

function noop() {}

// handle IE8 prevent default
function preventDefaultEvent( event ) {
  if ( event.preventDefault ) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

// -------------------------- Unidragger -------------------------- //

function Unidragger() {}

// inherit Unipointer & EventEmitter
Unidragger.prototype = new Unipointer();

// ----- bind start ----- //

Unidragger.prototype.bindHandles = function() {
  this._bindHandles( true );
};

Unidragger.prototype.unbindHandles = function() {
  this._bindHandles( false );
};

var navigator = window.navigator;
/**
 * works as unbinder, as you can .bindHandles( false ) to unbind
 * @param {Boolean} isBind - will unbind if falsey
 */
Unidragger.prototype._bindHandles = function( isBind ) {
  // munge isBind, default to true
  isBind = isBind === undefined ? true : !!isBind;
  // extra bind logic
  var binderExtra;
  if ( navigator.pointerEnabled ) {
    binderExtra = function( handle ) {
      // disable scrolling on the element
      handle.style.touchAction = isBind ? 'none' : '';
    };
  } else if ( navigator.msPointerEnabled ) {
    binderExtra = function( handle ) {
      // disable scrolling on the element
      handle.style.msTouchAction = isBind ? 'none' : '';
    };
  } else {
    binderExtra = function() {
      // TODO re-enable img.ondragstart when unbinding
      if ( isBind ) {
        disableImgOndragstart( handle );
      }
    };
  }
  // bind each handle
  var bindMethod = isBind ? 'bind' : 'unbind';
  for ( var i=0, len = this.handles.length; i < len; i++ ) {
    var handle = this.handles[i];
    this._bindStartEvent( handle, isBind );
    binderExtra( handle );
    eventie[ bindMethod ]( handle, 'click', this );
  }
};

// remove default dragging interaction on all images in IE8
// IE8 does its own drag thing on images, which messes stuff up

function noDragStart() {
  return false;
}

// TODO replace this with a IE8 test
var isIE8 = 'attachEvent' in document.documentElement;

// IE8 only
var disableImgOndragstart = !isIE8 ? noop : function( handle ) {

  if ( handle.nodeName == 'IMG' ) {
    handle.ondragstart = noDragStart;
  }

  var images = handle.querySelectorAll('img');
  for ( var i=0, len = images.length; i < len; i++ ) {
    var img = images[i];
    img.ondragstart = noDragStart;
  }
};

// ----- start event ----- //

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Unidragger.prototype.pointerDown = function( event, pointer ) {
  // dismiss range sliders
  if ( event.target.nodeName == 'INPUT' && event.target.type == 'range' ) {
    // reset pointerDown logic
    this.isPointerDown = false;
    delete this.pointerIdentifier;
    return;
  }

  this._dragPointerDown( event, pointer );
  // kludge to blur focused inputs in dragger
  var focused = document.activeElement;
  if ( focused && focused.blur ) {
    focused.blur();
  }
  // bind move and end events
  this._bindPostStartEvents( event );
  // track scrolling
  this.pointerDownScroll = Unidragger.getScrollPosition();
  eventie.bind( window, 'scroll', this );

  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// base pointer down logic
Unidragger.prototype._dragPointerDown = function( event, pointer ) {
  // track to see when dragging starts
  this.pointerDownPoint = Unipointer.getPointerPoint( pointer );

  // prevent default, unless touchstart or <select>
  var isTouchstart = event.type == 'touchstart';
  var targetNodeName = event.target.nodeName;
  if ( !isTouchstart && targetNodeName != 'SELECT' ) {
    preventDefaultEvent( event );
  }
};

// ----- move event ----- //

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Unidragger.prototype.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

// base pointer move logic
Unidragger.prototype._dragPointerMove = function( event, pointer ) {
  var movePoint = Unipointer.getPointerPoint( pointer );
  var moveVector = {
    x: movePoint.x - this.pointerDownPoint.x,
    y: movePoint.y - this.pointerDownPoint.y
  };
  // start drag if pointer has moved far enough to start drag
  if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
    this._dragStart( event, pointer );
  }
  return moveVector;
};

// condition if pointer has moved far enough to start drag
Unidragger.prototype.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
};


// ----- end event ----- //

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
Unidragger.prototype.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
  this._dragPointerUp( event, pointer );
};

Unidragger.prototype._dragPointerUp = function( event, pointer ) {
  if ( this.isDragging ) {
    this._dragEnd( event, pointer );
  } else {
    // pointer didn't move enough for drag to start
    this._staticClick( event, pointer );
  }
};

Unipointer.prototype.pointerDone = function() {
  eventie.unbind( window, 'scroll', this );
};

// -------------------------- drag -------------------------- //

// dragStart
Unidragger.prototype._dragStart = function( event, pointer ) {
  this.isDragging = true;
  this.dragStartPoint = Unidragger.getPointerPoint( pointer );
  // prevent clicks
  this.isPreventingClicks = true;

  this.dragStart( event, pointer );
};

Unidragger.prototype.dragStart = function( event, pointer ) {
  this.emitEvent( 'dragStart', [ event, pointer ] );
};

// dragMove
Unidragger.prototype._dragMove = function( event, pointer, moveVector ) {
  // do not drag if not dragging yet
  if ( !this.isDragging ) {
    return;
  }

  this.dragMove( event, pointer, moveVector );
};

Unidragger.prototype.dragMove = function( event, pointer, moveVector ) {
  preventDefaultEvent( event );
  this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
};

// dragEnd
Unidragger.prototype._dragEnd = function( event, pointer ) {
  // set flags
  this.isDragging = false;
  // re-enable clicking async
  var _this = this;
  setTimeout( function() {
    delete _this.isPreventingClicks;
  });

  this.dragEnd( event, pointer );
};

Unidragger.prototype.dragEnd = function( event, pointer ) {
  this.emitEvent( 'dragEnd', [ event, pointer ] );
};

Unidragger.prototype.pointerDone = function() {
  eventie.unbind( window, 'scroll', this );
  delete this.pointerDownScroll;
};

// ----- onclick ----- //

// handle all clicks and prevent clicks when dragging
Unidragger.prototype.onclick = function( event ) {
  if ( this.isPreventingClicks ) {
    preventDefaultEvent( event );
  }
};

// ----- staticClick ----- //

// triggered after pointer down & up with no/tiny movement
Unidragger.prototype._staticClick = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  // allow click in <input>s and <textarea>s
  var nodeName = event.target.nodeName;
  if ( nodeName == 'INPUT' || nodeName == 'TEXTAREA' ) {
    event.target.focus();
  }
  this.staticClick( event, pointer );

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    var _this = this;
    // reset flag after 300ms
    setTimeout( function() {
      delete _this.isIgnoringMouseUp;
    }, 400 );
  }
};

Unidragger.prototype.staticClick = function( event, pointer ) {
  this.emitEvent( 'staticClick', [ event, pointer ] );
};

// ----- scroll ----- //

Unidragger.prototype.onscroll = function() {
  var scroll = Unidragger.getScrollPosition();
  var scrollMoveX = this.pointerDownScroll.x - scroll.x;
  var scrollMoveY = this.pointerDownScroll.y - scroll.y;
  // cancel click/tap if scroll is too much
  if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
    this._pointerDone();
  }
};

// ----- utils ----- //

Unidragger.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX !== undefined ? pointer.pageX : pointer.clientX,
    y: pointer.pageY !== undefined ? pointer.pageY : pointer.clientY
  };
};

var isPageOffset = window.pageYOffset !== undefined;

// get scroll in { x, y }
Unidragger.getScrollPosition = function() {
  return {
    x: isPageOffset ? window.pageXOffset : document.body.scrollLeft,
    y: isPageOffset ? window.pageYOffset : document.body.scrollTop
  };
};

// -----  ----- //

Unidragger.getPointerPoint = Unipointer.getPointerPoint;

return Unidragger;

}));

/*!
 * Flickity PACKAGED v1.1.1
 * Touch, responsive, flickable galleries
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * http://flickity.metafizzy.co
 * Copyright 2015 Metafizzy
 */

!function(t){function e(){}function i(t){function i(e){e.prototype.option||(e.prototype.option=function(e){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))})}function o(e,i){t.fn[e]=function(o){if("string"==typeof o){for(var s=n.call(arguments,1),a=0,l=this.length;l>a;a++){var c=this[a],h=t.data(c,e);if(h)if(t.isFunction(h[o])&&"_"!==o.charAt(0)){var p=h[o].apply(h,s);if(void 0!==p)return p}else r("no such method '"+o+"' for "+e+" instance");else r("cannot call methods on "+e+" prior to initialization; attempted to call '"+o+"'")}return this}return this.each(function(){var n=t.data(this,e);n?(n.option(o),n._init()):(n=new i(this,o),t.data(this,e,n))})}}if(t){var r="undefined"==typeof console?e:function(t){console.error(t)};return t.bridget=function(t,e){i(e),o(t,e)},t.bridget}}var n=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],i):i("object"==typeof exports?require("jquery"):t.jQuery)}(window),function(t){function e(t){return new RegExp("(^|\\s+)"+t+"(\\s+|$)")}function i(t,e){var i=n(t,e)?r:o;i(t,e)}var n,o,r;"classList"in document.documentElement?(n=function(t,e){return t.classList.contains(e)},o=function(t,e){t.classList.add(e)},r=function(t,e){t.classList.remove(e)}):(n=function(t,i){return e(i).test(t.className)},o=function(t,e){n(t,e)||(t.className=t.className+" "+e)},r=function(t,i){t.className=t.className.replace(e(i)," ")});var s={hasClass:n,addClass:o,removeClass:r,toggleClass:i,has:n,add:o,remove:r,toggle:i};"function"==typeof define&&define.amd?define("classie/classie",s):"object"==typeof exports?module.exports=s:t.classie=s}(window),function(){function t(){}function e(t,e){for(var i=t.length;i--;)if(t[i].listener===e)return i;return-1}function i(t){return function(){return this[t].apply(this,arguments)}}var n=t.prototype,o=this,r=o.EventEmitter;n.getListeners=function(t){var e,i,n=this._getEvents();if(t instanceof RegExp){e={};for(i in n)n.hasOwnProperty(i)&&t.test(i)&&(e[i]=n[i])}else e=n[t]||(n[t]=[]);return e},n.flattenListeners=function(t){var e,i=[];for(e=0;e<t.length;e+=1)i.push(t[e].listener);return i},n.getListenersAsObject=function(t){var e,i=this.getListeners(t);return i instanceof Array&&(e={},e[t]=i),e||i},n.addListener=function(t,i){var n,o=this.getListenersAsObject(t),r="object"==typeof i;for(n in o)o.hasOwnProperty(n)&&-1===e(o[n],i)&&o[n].push(r?i:{listener:i,once:!1});return this},n.on=i("addListener"),n.addOnceListener=function(t,e){return this.addListener(t,{listener:e,once:!0})},n.once=i("addOnceListener"),n.defineEvent=function(t){return this.getListeners(t),this},n.defineEvents=function(t){for(var e=0;e<t.length;e+=1)this.defineEvent(t[e]);return this},n.removeListener=function(t,i){var n,o,r=this.getListenersAsObject(t);for(o in r)r.hasOwnProperty(o)&&(n=e(r[o],i),-1!==n&&r[o].splice(n,1));return this},n.off=i("removeListener"),n.addListeners=function(t,e){return this.manipulateListeners(!1,t,e)},n.removeListeners=function(t,e){return this.manipulateListeners(!0,t,e)},n.manipulateListeners=function(t,e,i){var n,o,r=t?this.removeListener:this.addListener,s=t?this.removeListeners:this.addListeners;if("object"!=typeof e||e instanceof RegExp)for(n=i.length;n--;)r.call(this,e,i[n]);else for(n in e)e.hasOwnProperty(n)&&(o=e[n])&&("function"==typeof o?r.call(this,n,o):s.call(this,n,o));return this},n.removeEvent=function(t){var e,i=typeof t,n=this._getEvents();if("string"===i)delete n[t];else if(t instanceof RegExp)for(e in n)n.hasOwnProperty(e)&&t.test(e)&&delete n[e];else delete this._events;return this},n.removeAllListeners=i("removeEvent"),n.emitEvent=function(t,e){var i,n,o,r,s=this.getListenersAsObject(t);for(o in s)if(s.hasOwnProperty(o))for(n=s[o].length;n--;)i=s[o][n],i.once===!0&&this.removeListener(t,i.listener),r=i.listener.apply(this,e||[]),r===this._getOnceReturnValue()&&this.removeListener(t,i.listener);return this},n.trigger=i("emitEvent"),n.emit=function(t){var e=Array.prototype.slice.call(arguments,1);return this.emitEvent(t,e)},n.setOnceReturnValue=function(t){return this._onceReturnValue=t,this},n._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},n._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return o.EventEmitter=r,t},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return t}):"object"==typeof module&&module.exports?module.exports=t:o.EventEmitter=t}.call(this),function(t){function e(e){var i=t.event;return i.target=i.target||i.srcElement||e,i}var i=document.documentElement,n=function(){};i.addEventListener?n=function(t,e,i){t.addEventListener(e,i,!1)}:i.attachEvent&&(n=function(t,i,n){t[i+n]=n.handleEvent?function(){var i=e(t);n.handleEvent.call(n,i)}:function(){var i=e(t);n.call(t,i)},t.attachEvent("on"+i,t[i+n])});var o=function(){};i.removeEventListener?o=function(t,e,i){t.removeEventListener(e,i,!1)}:i.detachEvent&&(o=function(t,e,i){t.detachEvent("on"+e,t[e+i]);try{delete t[e+i]}catch(n){t[e+i]=void 0}});var r={bind:n,unbind:o};"function"==typeof define&&define.amd?define("eventie/eventie",r):"object"==typeof exports?module.exports=r:t.eventie=r}(window),function(t){function e(t){if(t){if("string"==typeof n[t])return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e,o=0,r=i.length;r>o;o++)if(e=i[o]+t,"string"==typeof n[e])return e}}var i="Webkit Moz ms Ms O".split(" "),n=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return e}):"object"==typeof exports?module.exports=e:t.getStyleProperty=e}(window),function(t){function e(t){var e=parseFloat(t),i=-1===t.indexOf("%")&&!isNaN(e);return i&&e}function i(){}function n(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0,i=s.length;i>e;e++){var n=s[e];t[n]=0}return t}function o(i){function o(){if(!d){d=!0;var n=t.getComputedStyle;if(c=function(){var t=n?function(t){return n(t,null)}:function(t){return t.currentStyle};return function(e){var i=t(e);return i||r("Style returned "+i+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),i}}(),h=i("boxSizing")){var o=document.createElement("div");o.style.width="200px",o.style.padding="1px 2px 3px 4px",o.style.borderStyle="solid",o.style.borderWidth="1px 2px 3px 4px",o.style[h]="border-box";var s=document.body||document.documentElement;s.appendChild(o);var a=c(o);p=200===e(a.width),s.removeChild(o)}}}function a(t){if(o(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var i=c(t);if("none"===i.display)return n();var r={};r.width=t.offsetWidth,r.height=t.offsetHeight;for(var a=r.isBorderBox=!(!h||!i[h]||"border-box"!==i[h]),d=0,u=s.length;u>d;d++){var f=s[d],v=i[f];v=l(t,v);var y=parseFloat(v);r[f]=isNaN(y)?0:y}var g=r.paddingLeft+r.paddingRight,m=r.paddingTop+r.paddingBottom,b=r.marginLeft+r.marginRight,S=r.marginTop+r.marginBottom,x=r.borderLeftWidth+r.borderRightWidth,w=r.borderTopWidth+r.borderBottomWidth,C=a&&p,E=e(i.width);E!==!1&&(r.width=E+(C?0:g+x));var P=e(i.height);return P!==!1&&(r.height=P+(C?0:m+w)),r.innerWidth=r.width-(g+x),r.innerHeight=r.height-(m+w),r.outerWidth=r.width+b,r.outerHeight=r.height+S,r}}function l(e,i){if(t.getComputedStyle||-1===i.indexOf("%"))return i;var n=e.style,o=n.left,r=e.runtimeStyle,s=r&&r.left;return s&&(r.left=e.currentStyle.left),n.left=i,i=n.pixelLeft,n.left=o,s&&(r.left=s),i}var c,h,p,d=!1;return a}var r="undefined"==typeof console?i:function(t){console.error(t)},s=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],o):"object"==typeof exports?module.exports=o(require("desandro-get-style-property")):t.getSize=o(t.getStyleProperty)}(window),function(t){function e(t){"function"==typeof t&&(e.isReady?t():s.push(t))}function i(t){var i="readystatechange"===t.type&&"complete"!==r.readyState;e.isReady||i||n()}function n(){e.isReady=!0;for(var t=0,i=s.length;i>t;t++){var n=s[t];n()}}function o(o){return"complete"===r.readyState?n():(o.bind(r,"DOMContentLoaded",i),o.bind(r,"readystatechange",i),o.bind(t,"load",i)),e}var r=t.document,s=[];e.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],o):"object"==typeof exports?module.exports=o(require("eventie")):t.docReady=o(t.eventie)}(window),function(t){function e(t,e){return t[s](e)}function i(t){if(!t.parentNode){var e=document.createDocumentFragment();e.appendChild(t)}}function n(t,e){i(t);for(var n=t.parentNode.querySelectorAll(e),o=0,r=n.length;r>o;o++)if(n[o]===t)return!0;return!1}function o(t,n){return i(t),e(t,n)}var r,s=function(){if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0,n=e.length;n>i;i++){var o=e[i],r=o+"MatchesSelector";if(t[r])return r}}();if(s){var a=document.createElement("div"),l=e(a,"div");r=l?e:o}else r=n;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return r}):"object"==typeof exports?module.exports=r:window.matchesSelector=r}(Element.prototype),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(t,require("doc-ready"),require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.docReady,t.matchesSelector)}(window,function(t,e,i){var n={};n.extend=function(t,e){for(var i in e)t[i]=e[i];return t},n.modulo=function(t,e){return(t%e+e)%e};var o=Object.prototype.toString;n.isArray=function(t){return"[object Array]"==o.call(t)},n.makeArray=function(t){var e=[];if(n.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0,o=t.length;o>i;i++)e.push(t[i]);else e.push(t);return e},n.indexOf=Array.prototype.indexOf?function(t,e){return t.indexOf(e)}:function(t,e){for(var i=0,n=t.length;n>i;i++)if(t[i]===e)return i;return-1},n.removeFrom=function(t,e){var i=n.indexOf(t,e);-1!=i&&t.splice(i,1)},n.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(t){return t instanceof HTMLElement}:function(t){return t&&"object"==typeof t&&1==t.nodeType&&"string"==typeof t.nodeName},n.setText=function(){function t(t,i){e=e||(void 0!==document.documentElement.textContent?"textContent":"innerText"),t[e]=i}var e;return t}(),n.getParent=function(t,e){for(;t!=document.body;)if(t=t.parentNode,i(t,e))return t},n.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},n.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},n.filterFindElements=function(t,e){t=n.makeArray(t);for(var o=[],r=0,s=t.length;s>r;r++){var a=t[r];if(n.isElement(a))if(e){i(a,e)&&o.push(a);for(var l=a.querySelectorAll(e),c=0,h=l.length;h>c;c++)o.push(l[c])}else o.push(a)}return o},n.debounceMethod=function(t,e,i){var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];t&&clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i||100)}},n.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var r=t.console;return n.htmlInit=function(i,o){e(function(){for(var e=n.toDashed(o),s=document.querySelectorAll(".js-"+e),a="data-"+e+"-options",l=0,c=s.length;c>l;l++){var h,p=s[l],d=p.getAttribute(a);try{h=d&&JSON.parse(d)}catch(u){r&&r.error("Error parsing "+a+" on "+p.nodeName.toLowerCase()+(p.id?"#"+p.id:"")+": "+u);continue}var f=new i(p,h),v=t.jQuery;v&&v.data(p,o,f)}})},n}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/cell",["get-size/get-size"],function(i){return e(t,i)}):"object"==typeof exports?module.exports=e(t,require("get-size")):(t.Flickity=t.Flickity||{},t.Flickity.Cell=e(t,t.getSize))}(window,function(t,e){function i(t,e){this.element=t,this.parent=e,this.create()}var n="attachEvent"in t;return i.prototype.create=function(){this.element.style.position="absolute",n&&this.element.setAttribute("unselectable","on"),this.x=0,this.shift=0},i.prototype.destroy=function(){this.element.style.position="";var t=this.parent.originSide;this.element.style[t]=""},i.prototype.getSize=function(){this.size=e(this.element)},i.prototype.setPosition=function(t){this.x=t,this.setDefaultTarget(),this.renderPosition(t)},i.prototype.setDefaultTarget=function(){var t="left"==this.parent.originSide?"marginLeft":"marginRight";this.target=this.x+this.size[t]+this.size.width*this.parent.cellAlign},i.prototype.renderPosition=function(t){var e=this.parent.originSide;this.element.style[e]=this.parent.getPositionValue(t)},i.prototype.wrapShift=function(t){this.shift=t,this.renderPosition(this.x+this.parent.slideableWidth*t)},i.prototype.remove=function(){this.element.parentNode.removeChild(this.element)},i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/animate",["get-style-property/get-style-property","fizzy-ui-utils/utils"],function(i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(t,require("desandro-get-style-property"),require("fizzy-ui-utils")):(t.Flickity=t.Flickity||{},t.Flickity.animatePrototype=e(t,t.getStyleProperty,t.fizzyUIUtils))}(window,function(t,e,i){for(var n,o=0,r="webkit moz ms o".split(" "),s=t.requestAnimationFrame,a=t.cancelAnimationFrame,l=0;l<r.length&&(!s||!a);l++)n=r[l],s=s||t[n+"RequestAnimationFrame"],a=a||t[n+"CancelAnimationFrame"]||t[n+"CancelRequestAnimationFrame"];s&&a||(s=function(e){var i=(new Date).getTime(),n=Math.max(0,16-(i-o)),r=t.setTimeout(function(){e(i+n)},n);return o=i+n,r},a=function(e){t.clearTimeout(e)});var c={};c.startAnimation=function(){this.isAnimating||(this.isAnimating=!0,this.restingFrames=0,this.animate())},c.animate=function(){this.applyDragForce(),this.applySelectedAttraction();var t=this.x;if(this.integratePhysics(),this.positionSlider(),this.settle(t),this.isAnimating){var e=this;s(function(){e.animate()})}};var h=e("transform"),p=!!e("perspective");return c.positionSlider=function(){var t=this.x;this.options.wrapAround&&this.cells.length>1&&(t=i.modulo(t,this.slideableWidth),t-=this.slideableWidth,this.shiftWrapCells(t)),t+=this.cursorPosition,t=this.options.rightToLeft&&h?-t:t;var e=this.getPositionValue(t);h?this.slider.style[h]=p&&this.isAnimating?"translate3d("+e+",0,0)":"translateX("+e+")":this.slider.style[this.originSide]=e},c.positionSliderAtSelected=function(){if(this.cells.length){var t=this.cells[this.selectedIndex];this.x=-t.target,this.positionSlider()}},c.getPositionValue=function(t){return this.options.percentPosition?.01*Math.round(t/this.size.innerWidth*1e4)+"%":Math.round(t)+"px"},c.settle=function(t){this.isPointerDown||Math.round(100*this.x)!=Math.round(100*t)||this.restingFrames++,this.restingFrames>2&&(this.isAnimating=!1,delete this.isFreeScrolling,p&&this.positionSlider(),this.dispatchEvent("settle"))},c.shiftWrapCells=function(t){var e=this.cursorPosition+t;this._shiftCells(this.beforeShiftCells,e,-1);var i=this.size.innerWidth-(t+this.slideableWidth+this.cursorPosition);this._shiftCells(this.afterShiftCells,i,1)},c._shiftCells=function(t,e,i){for(var n=0,o=t.length;o>n;n++){var r=t[n],s=e>0?i:0;r.wrapShift(s),e-=r.size.outerWidth}},c._unshiftCells=function(t){if(t&&t.length)for(var e=0,i=t.length;i>e;e++)t[e].wrapShift(0)},c.integratePhysics=function(){this.velocity+=this.accel,this.x+=this.velocity,this.velocity*=this.getFrictionFactor(),this.accel=0},c.applyForce=function(t){this.accel+=t},c.getFrictionFactor=function(){return 1-this.options[this.isFreeScrolling?"freeScrollFriction":"friction"]},c.getRestingPosition=function(){return this.x+this.velocity/(1-this.getFrictionFactor())},c.applyDragForce=function(){if(this.isPointerDown){var t=this.dragX-this.x,e=t-this.velocity;this.applyForce(e)}},c.applySelectedAttraction=function(){var t=this.cells.length;if(!this.isPointerDown&&!this.isFreeScrolling&&t){var e=this.cells[this.selectedIndex],i=this.options.wrapAround&&t>1?this.slideableWidth*Math.floor(this.selectedIndex/t):0,n=-1*(e.target+i)-this.x,o=n*this.options.selectedAttraction;this.applyForce(o)}},c}),function(t,e){if("function"==typeof define&&define.amd)define("flickity/js/flickity",["classie/classie","eventEmitter/EventEmitter","eventie/eventie","get-size/get-size","fizzy-ui-utils/utils","./cell","./animate"],function(i,n,o,r,s,a,l){return e(t,i,n,o,r,s,a,l)});else if("object"==typeof exports)module.exports=e(t,require("desandro-classie"),require("wolfy87-eventemitter"),require("eventie"),require("get-size"),require("fizzy-ui-utils"),require("./cell"),require("./animate"));else{var i=t.Flickity;t.Flickity=e(t,t.classie,t.EventEmitter,t.eventie,t.getSize,t.fizzyUIUtils,i.Cell,i.animatePrototype)}}(window,function(t,e,i,n,o,r,s,a){function l(t,e){for(t=r.makeArray(t);t.length;)e.appendChild(t.shift())}function c(t,e){var i=r.getQueryElement(t);return i?(this.element=i,h&&(this.$element=h(this.element)),this.options=r.extend({},this.constructor.defaults),this.option(e),void this._create()):void(d&&d.error("Bad element for Flickity: "+(i||t)))}var h=t.jQuery,p=t.getComputedStyle,d=t.console,u=0,f={};c.defaults={accessibility:!0,cellAlign:"center",freeScrollFriction:.075,friction:.28,percentPosition:!0,resize:!0,selectedAttraction:.025,setGallerySize:!0},c.createMethods=[],r.extend(c.prototype,i.prototype),c.prototype._create=function(){var e=this.guid=++u;this.element.flickityGUID=e,f[e]=this,this.selectedIndex=this.options.initialIndex||0,this.restingFrames=0,this.x=0,this.velocity=0,this.accel=0,this.originSide=this.options.rightToLeft?"right":"left",this.viewport=document.createElement("div"),this.viewport.className="flickity-viewport",c.setUnselectable(this.viewport),this._createSlider(),(this.options.resize||this.options.watchCSS)&&(n.bind(t,"resize",this),this.isResizeBound=!0);for(var i=0,o=c.createMethods.length;o>i;i++){var r=c.createMethods[i];this[r]()}this.options.watchCSS?this.watchCSS():this.activate()},c.prototype.option=function(t){r.extend(this.options,t)},c.prototype.activate=function(){if(!this.isActive){this.isActive=!0,e.add(this.element,"flickity-enabled"),this.options.rightToLeft&&e.add(this.element,"flickity-rtl"),this.getSize();var t=this._filterFindCellElements(this.element.children);l(t,this.slider),this.viewport.appendChild(this.slider),this.element.appendChild(this.viewport),this.reloadCells(),this.options.accessibility&&(this.element.tabIndex=0,n.bind(this.element,"keydown",this)),this.emit("activate"),this.positionSliderAtSelected(),this.select(this.selectedIndex)}},c.prototype._createSlider=function(){var t=document.createElement("div");t.className="flickity-slider",t.style[this.originSide]=0,this.slider=t},c.prototype._filterFindCellElements=function(t){return r.filterFindElements(t,this.options.cellSelector)},c.prototype.reloadCells=function(){this.cells=this._makeCells(this.slider.children),this.positionCells(),this._getWrapShiftCells(),this.setGallerySize()},c.prototype._makeCells=function(t){for(var e=this._filterFindCellElements(t),i=[],n=0,o=e.length;o>n;n++){var r=e[n],a=new s(r,this);i.push(a)}return i},c.prototype.getLastCell=function(){return this.cells[this.cells.length-1]},c.prototype.positionCells=function(){this._sizeCells(this.cells),this._positionCells(0)},c.prototype._positionCells=function(t){t=t||0,this.maxCellHeight=t?this.maxCellHeight||0:0;var e=0;if(t>0){var i=this.cells[t-1];e=i.x+i.size.outerWidth}for(var n,o=this.cells.length,r=t;o>r;r++)n=this.cells[r],n.setPosition(e),e+=n.size.outerWidth,this.maxCellHeight=Math.max(n.size.outerHeight,this.maxCellHeight);this.slideableWidth=e,this._containCells()},c.prototype._sizeCells=function(t){for(var e=0,i=t.length;i>e;e++){var n=t[e];n.getSize()}},c.prototype._init=c.prototype.reposition=function(){this.positionCells(),this.positionSliderAtSelected()},c.prototype.getSize=function(){this.size=o(this.element),this.setCellAlign(),this.cursorPosition=this.size.innerWidth*this.cellAlign};var v={center:{left:.5,right:.5},left:{left:0,right:1},right:{right:0,left:1}};c.prototype.setCellAlign=function(){var t=v[this.options.cellAlign];this.cellAlign=t?t[this.originSide]:this.options.cellAlign},c.prototype.setGallerySize=function(){this.options.setGallerySize&&(this.viewport.style.height=this.maxCellHeight+"px")},c.prototype._getWrapShiftCells=function(){if(this.options.wrapAround){this._unshiftCells(this.beforeShiftCells),this._unshiftCells(this.afterShiftCells);var t=this.cursorPosition,e=this.cells.length-1;this.beforeShiftCells=this._getGapCells(t,e,-1),t=this.size.innerWidth-this.cursorPosition,this.afterShiftCells=this._getGapCells(t,0,1)}},c.prototype._getGapCells=function(t,e,i){for(var n=[];t>0;){var o=this.cells[e];if(!o)break;n.push(o),e+=i,t-=o.size.outerWidth}return n},c.prototype._containCells=function(){if(this.options.contain&&!this.options.wrapAround&&this.cells.length)for(var t=this.options.rightToLeft?"marginRight":"marginLeft",e=this.options.rightToLeft?"marginLeft":"marginRight",i=this.cells[0].size[t],n=this.getLastCell(),o=this.slideableWidth-n.size[e],r=o-this.size.innerWidth*(1-this.cellAlign),s=o<this.size.innerWidth,a=0,l=this.cells.length;l>a;a++){var c=this.cells[a];c.setDefaultTarget(),s?c.target=o*this.cellAlign:(c.target=Math.max(c.target,this.cursorPosition+i),c.target=Math.min(c.target,r))}},c.prototype.dispatchEvent=function(t,e,i){var n=[e].concat(i);if(this.emitEvent(t,n),h&&this.$element)if(e){var o=h.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},c.prototype.select=function(t,e){if(this.isActive){var i=this.cells.length;this.options.wrapAround&&i>1&&(0>t?this.x-=this.slideableWidth:t>=i&&(this.x+=this.slideableWidth)),(this.options.wrapAround||e)&&(t=r.modulo(t,i)),this.cells[t]&&(this.selectedIndex=t,this.setSelectedCell(),this.startAnimation(),this.dispatchEvent("cellSelect"))}},c.prototype.previous=function(t){this.select(this.selectedIndex-1,t)},c.prototype.next=function(t){this.select(this.selectedIndex+1,t)},c.prototype.setSelectedCell=function(){this._removeSelectedCellClass(),this.selectedCell=this.cells[this.selectedIndex],this.selectedElement=this.selectedCell.element,e.add(this.selectedElement,"is-selected")},c.prototype._removeSelectedCellClass=function(){this.selectedCell&&e.remove(this.selectedCell.element,"is-selected")},c.prototype.getCell=function(t){for(var e=0,i=this.cells.length;i>e;e++){var n=this.cells[e];if(n.element==t)return n}},c.prototype.getCells=function(t){t=r.makeArray(t);for(var e=[],i=0,n=t.length;n>i;i++){var o=t[i],s=this.getCell(o);s&&e.push(s)}return e},c.prototype.getCellElements=function(){for(var t=[],e=0,i=this.cells.length;i>e;e++)t.push(this.cells[e].element);return t},c.prototype.getParentCell=function(t){var e=this.getCell(t);return e?e:(t=r.getParent(t,".flickity-slider > *"),this.getCell(t))},c.prototype.getAdjacentCellElements=function(t,e){if(!t)return[this.selectedElement];e=void 0===e?this.selectedIndex:e;var i=this.cells.length;if(1+2*t>=i)return this.getCellElements();for(var n=[],o=e-t;e+t>=o;o++){var s=this.options.wrapAround?r.modulo(o,i):o,a=this.cells[s];a&&n.push(a.element)}return n},c.prototype.uiChange=function(){this.emit("uiChange")},c.prototype.childUIPointerDown=function(t){this.emitEvent("childUIPointerDown",[t])},c.prototype.onresize=function(){this.watchCSS(),this.resize()},r.debounceMethod(c,"onresize",150),c.prototype.resize=function(){this.isActive&&(this.getSize(),this.options.wrapAround&&(this.x=r.modulo(this.x,this.slideableWidth)),this.positionCells(),this._getWrapShiftCells(),this.setGallerySize(),this.positionSliderAtSelected())};var y=c.supportsConditionalCSS=function(){var t;return function(){if(void 0!==t)return t;if(!p)return void(t=!1);var e=document.createElement("style"),i=document.createTextNode('body:after { content: "foo"; display: none; }');e.appendChild(i),document.head.appendChild(e);var n=p(document.body,":after").content;return t=-1!=n.indexOf("foo"),document.head.removeChild(e),t}}();c.prototype.watchCSS=function(){var t=this.options.watchCSS;if(t){var e=y();if(!e){var i="fallbackOn"==t?"activate":"deactivate";return void this[i]()}var n=p(this.element,":after").content;-1!=n.indexOf("flickity")?this.activate():this.deactivate()}},c.prototype.onkeydown=function(t){if(this.options.accessibility&&(!document.activeElement||document.activeElement==this.element))if(37==t.keyCode){var e=this.options.rightToLeft?"next":"previous";this.uiChange(),this[e]()}else if(39==t.keyCode){var i=this.options.rightToLeft?"previous":"next";this.uiChange(),this[i]()}},c.prototype.deactivate=function(){if(this.isActive){e.remove(this.element,"flickity-enabled"),e.remove(this.element,"flickity-rtl");for(var t=0,i=this.cells.length;i>t;t++){var o=this.cells[t];o.destroy()}this._removeSelectedCellClass(),this.element.removeChild(this.viewport),l(this.slider.children,this.element),this.options.accessibility&&(this.element.removeAttribute("tabIndex"),n.unbind(this.element,"keydown",this)),this.isActive=!1,this.emit("deactivate")}},c.prototype.destroy=function(){this.deactivate(),this.isResizeBound&&n.unbind(t,"resize",this),this.emit("destroy"),h&&this.$element&&h.removeData(this.element,"flickity"),delete this.element.flickityGUID,delete f[this.guid]},r.extend(c.prototype,a);var g="attachEvent"in t;return c.setUnselectable=function(t){g&&t.setAttribute("unselectable","on")},c.data=function(t){t=r.getQueryElement(t);var e=t&&t.flickityGUID;return e&&f[e]},r.htmlInit(c,"flickity"),h&&h.bridget&&h.bridget("flickity",c),c.Cell=s,c}),function(t,e){"function"==typeof define&&define.amd?define("unipointer/unipointer",["eventEmitter/EventEmitter","eventie/eventie"],function(i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(t,require("wolfy87-eventemitter"),require("eventie")):t.Unipointer=e(t,t.EventEmitter,t.eventie)}(window,function(t,e,i){function n(){}function o(){}o.prototype=new e,o.prototype.bindStartEvent=function(t){this._bindStartEvent(t,!0)},o.prototype.unbindStartEvent=function(t){this._bindStartEvent(t,!1)},o.prototype._bindStartEvent=function(e,n){n=void 0===n?!0:!!n;var o=n?"bind":"unbind";t.navigator.pointerEnabled?i[o](e,"pointerdown",this):t.navigator.msPointerEnabled?i[o](e,"MSPointerDown",this):(i[o](e,"mousedown",this),i[o](e,"touchstart",this))},o.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},o.prototype.getTouch=function(t){for(var e=0,i=t.length;i>e;e++){var n=t[e];if(n.identifier==this.pointerIdentifier)return n}},o.prototype.onmousedown=function(t){var e=t.button;e&&0!==e&&1!==e||this._pointerDown(t,t)},o.prototype.ontouchstart=function(t){this._pointerDown(t,t.changedTouches[0])},o.prototype.onMSPointerDown=o.prototype.onpointerdown=function(t){this._pointerDown(t,t)},o.prototype._pointerDown=function(t,e){this.isPointerDown||(this.isPointerDown=!0,this.pointerIdentifier=void 0!==e.pointerId?e.pointerId:e.identifier,this.pointerDown(t,e))},o.prototype.pointerDown=function(t,e){this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e])};var r={mousedown:["mousemove","mouseup"],touchstart:["touchmove","touchend","touchcancel"],pointerdown:["pointermove","pointerup","pointercancel"],MSPointerDown:["MSPointerMove","MSPointerUp","MSPointerCancel"]};return o.prototype._bindPostStartEvents=function(e){if(e){for(var n=r[e.type],o=e.preventDefault?t:document,s=0,a=n.length;a>s;s++){var l=n[s];i.bind(o,l,this)}this._boundPointerEvents={events:n,node:o}}},o.prototype._unbindPostStartEvents=function(){var t=this._boundPointerEvents;if(t&&t.events){for(var e=0,n=t.events.length;n>e;e++){var o=t.events[e];i.unbind(t.node,o,this)}delete this._boundPointerEvents}},o.prototype.onmousemove=function(t){this._pointerMove(t,t)},o.prototype.onMSPointerMove=o.prototype.onpointermove=function(t){t.pointerId==this.pointerIdentifier&&this._pointerMove(t,t)},o.prototype.ontouchmove=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerMove(t,e)},o.prototype._pointerMove=function(t,e){this.pointerMove(t,e)},o.prototype.pointerMove=function(t,e){this.emitEvent("pointerMove",[t,e])},o.prototype.onmouseup=function(t){this._pointerUp(t,t)},o.prototype.onMSPointerUp=o.prototype.onpointerup=function(t){t.pointerId==this.pointerIdentifier&&this._pointerUp(t,t)},o.prototype.ontouchend=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerUp(t,e)},o.prototype._pointerUp=function(t,e){this._pointerDone(),this.pointerUp(t,e)},o.prototype.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e])},o.prototype._pointerDone=function(){this.isPointerDown=!1,delete this.pointerIdentifier,this._unbindPostStartEvents(),this.pointerDone()},o.prototype.pointerDone=n,o.prototype.onMSPointerCancel=o.prototype.onpointercancel=function(t){t.pointerId==this.pointerIdentifier&&this._pointerCancel(t,t)},o.prototype.ontouchcancel=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerCancel(t,e)},o.prototype._pointerCancel=function(t,e){this._pointerDone(),this.pointerCancel(t,e)},o.prototype.pointerCancel=function(t,e){this.emitEvent("pointerCancel",[t,e])},o.getPointerPoint=function(t){return{x:void 0!==t.pageX?t.pageX:t.clientX,y:void 0!==t.pageY?t.pageY:t.clientY}},o}),function(t,e){"function"==typeof define&&define.amd?define("unidragger/unidragger",["eventie/eventie","unipointer/unipointer"],function(i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(t,require("eventie"),require("unipointer")):t.Unidragger=e(t,t.eventie,t.Unipointer)}(window,function(t,e,i){function n(){}function o(t){t.preventDefault?t.preventDefault():t.returnValue=!1}function r(){}function s(){return!1}r.prototype=new i,r.prototype.bindHandles=function(){this._bindHandles(!0)},r.prototype.unbindHandles=function(){this._bindHandles(!1)};var a=t.navigator;r.prototype._bindHandles=function(t){t=void 0===t?!0:!!t;var i;i=a.pointerEnabled?function(e){e.style.touchAction=t?"none":""}:a.msPointerEnabled?function(e){e.style.msTouchAction=t?"none":""}:function(){t&&c(s)};for(var n=t?"bind":"unbind",o=0,r=this.handles.length;r>o;o++){var s=this.handles[o];this._bindStartEvent(s,t),i(s),e[n](s,"click",this)}};var l="attachEvent"in document.documentElement,c=l?function(t){"IMG"==t.nodeName&&(t.ondragstart=s);for(var e=t.querySelectorAll("img"),i=0,n=e.length;n>i;i++){var o=e[i];o.ondragstart=s}}:n;r.prototype.pointerDown=function(i,n){if("INPUT"==i.target.nodeName&&"range"==i.target.type)return this.isPointerDown=!1,void delete this.pointerIdentifier;this._dragPointerDown(i,n);var o=document.activeElement;o&&o.blur&&o.blur(),this._bindPostStartEvents(i),this.pointerDownScroll=r.getScrollPosition(),e.bind(t,"scroll",this),this.emitEvent("pointerDown",[i,n])},r.prototype._dragPointerDown=function(t,e){this.pointerDownPoint=i.getPointerPoint(e);var n="touchstart"==t.type,r=t.target.nodeName;n||"SELECT"==r||o(t)},r.prototype.pointerMove=function(t,e){var i=this._dragPointerMove(t,e);this.emitEvent("pointerMove",[t,e,i]),this._dragMove(t,e,i)},r.prototype._dragPointerMove=function(t,e){var n=i.getPointerPoint(e),o={x:n.x-this.pointerDownPoint.x,y:n.y-this.pointerDownPoint.y};return!this.isDragging&&this.hasDragStarted(o)&&this._dragStart(t,e),o},r.prototype.hasDragStarted=function(t){return Math.abs(t.x)>3||Math.abs(t.y)>3},r.prototype.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e]),this._dragPointerUp(t,e)},r.prototype._dragPointerUp=function(t,e){this.isDragging?this._dragEnd(t,e):this._staticClick(t,e)},i.prototype.pointerDone=function(){e.unbind(t,"scroll",this)},r.prototype._dragStart=function(t,e){this.isDragging=!0,this.dragStartPoint=r.getPointerPoint(e),this.isPreventingClicks=!0,this.dragStart(t,e)},r.prototype.dragStart=function(t,e){this.emitEvent("dragStart",[t,e])},r.prototype._dragMove=function(t,e,i){this.isDragging&&this.dragMove(t,e,i)
},r.prototype.dragMove=function(t,e,i){o(t),this.emitEvent("dragMove",[t,e,i])},r.prototype._dragEnd=function(t,e){this.isDragging=!1;var i=this;setTimeout(function(){delete i.isPreventingClicks}),this.dragEnd(t,e)},r.prototype.dragEnd=function(t,e){this.emitEvent("dragEnd",[t,e])},r.prototype.pointerDone=function(){e.unbind(t,"scroll",this),delete this.pointerDownScroll},r.prototype.onclick=function(t){this.isPreventingClicks&&o(t)},r.prototype._staticClick=function(t,e){if(!this.isIgnoringMouseUp||"mouseup"!=t.type){var i=t.target.nodeName;if(("INPUT"==i||"TEXTAREA"==i)&&t.target.focus(),this.staticClick(t,e),"mouseup"!=t.type){this.isIgnoringMouseUp=!0;var n=this;setTimeout(function(){delete n.isIgnoringMouseUp},400)}}},r.prototype.staticClick=function(t,e){this.emitEvent("staticClick",[t,e])},r.prototype.onscroll=function(){var t=r.getScrollPosition(),e=this.pointerDownScroll.x-t.x,i=this.pointerDownScroll.y-t.y;(Math.abs(e)>3||Math.abs(i)>3)&&this._pointerDone()},r.getPointerPoint=function(t){return{x:void 0!==t.pageX?t.pageX:t.clientX,y:void 0!==t.pageY?t.pageY:t.clientY}};var h=void 0!==t.pageYOffset;return r.getScrollPosition=function(){return{x:h?t.pageXOffset:document.body.scrollLeft,y:h?t.pageYOffset:document.body.scrollTop}},r.getPointerPoint=i.getPointerPoint,r}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/drag",["classie/classie","eventie/eventie","./flickity","unidragger/unidragger","fizzy-ui-utils/utils"],function(i,n,o,r,s){return e(t,i,n,o,r,s)}):"object"==typeof exports?module.exports=e(t,require("desandro-classie"),require("eventie"),require("./flickity"),require("unidragger"),require("fizzy-ui-utils")):t.Flickity=e(t,t.classie,t.eventie,t.Flickity,t.Unidragger,t.fizzyUIUtils)}(window,function(t,e,i,n,o,r){function s(t){t.preventDefault?t.preventDefault():t.returnValue=!1}function a(e){var i=o.getPointerPoint(e);return i.y-t.pageYOffset}r.extend(n.defaults,{draggable:!0,touchVerticalScroll:!0}),n.createMethods.push("_createDrag"),r.extend(n.prototype,o.prototype),n.prototype._createDrag=function(){this.on("activate",this.bindDrag),this.on("uiChange",this._uiChangeDrag),this.on("childUIPointerDown",this._childUIPointerDownDrag),this.on("deactivate",this.unbindDrag)},n.prototype.bindDrag=function(){this.options.draggable&&!this.isDragBound&&(e.add(this.element,"is-draggable"),this.handles=[this.viewport],this.bindHandles(),this.isDragBound=!0)},n.prototype.unbindDrag=function(){this.isDragBound&&(e.remove(this.element,"is-draggable"),this.unbindHandles(),delete this.isDragBound)},n.prototype._uiChangeDrag=function(){delete this.isFreeScrolling},n.prototype._childUIPointerDownDrag=function(t){s(t),this.pointerDownFocus(t)},n.prototype.pointerDown=function(n,r){if("INPUT"==n.target.nodeName&&"range"==n.target.type)return this.isPointerDown=!1,void delete this.pointerIdentifier;this._dragPointerDown(n,r);var s=document.activeElement;s&&s.blur&&s!=this.element&&s!=document.body&&s.blur(),this.pointerDownFocus(n),this.dragX=this.x,e.add(this.viewport,"is-pointer-down"),this._bindPostStartEvents(n),this.pointerDownScroll=o.getScrollPosition(),i.bind(t,"scroll",this),this.dispatchEvent("pointerDown",n,[r])};var l={touchstart:!0,MSPointerDown:!0},c={INPUT:!0,SELECT:!0};n.prototype.pointerDownFocus=function(t){!this.options.accessibility||l[t.type]||c[t.target.nodeName]||this.element.focus()},n.prototype.pointerMove=function(t,e){var i=this._dragPointerMove(t,e);this.touchVerticalScrollMove(t,e,i),this._dragMove(t,e,i),this.dispatchEvent("pointerMove",t,[e,i])},n.prototype.hasDragStarted=function(t){return!this.isTouchScrolling&&Math.abs(t.x)>3},n.prototype.pointerUp=function(t,i){delete this.isTouchScrolling,e.remove(this.viewport,"is-pointer-down"),this.dispatchEvent("pointerUp",t,[i]),this._dragPointerUp(t,i)};var h={touchmove:!0,MSPointerMove:!0};return n.prototype.touchVerticalScrollMove=function(e,i,n){var o=this.options.touchVerticalScroll,r="withDrag"==o?!o:this.isDragging||!o;!r&&h[e.type]&&!this.isTouchScrolling&&Math.abs(n.y)>10&&(this.startScrollY=t.pageYOffset,this.pointerWindowStartY=a(i),this.isTouchScrolling=!0)},n.prototype.dragStart=function(t,e){this.dragStartPosition=this.x,this.startAnimation(),this.dispatchEvent("dragStart",t,[e])},n.prototype.dragMove=function(t,e,i){s(t),this.previousDragX=this.dragX;var n=this.options.rightToLeft?-1:1,o=this.dragStartPosition+i.x*n;if(!this.options.wrapAround&&this.cells.length){var r=Math.max(-this.cells[0].target,this.dragStartPosition);o=o>r?.5*(o+r):o;var a=Math.min(-this.getLastCell().target,this.dragStartPosition);o=a>o?.5*(o+a):o}this.dragX=o,this.dragMoveTime=new Date,this.dispatchEvent("dragMove",t,[e,i])},n.prototype.dragEnd=function(t,e){this.options.freeScroll&&(this.isFreeScrolling=!0);var i=this.dragEndRestingSelect();if(this.options.freeScroll&&!this.options.wrapAround){var n=this.getRestingPosition();this.isFreeScrolling=-n>this.cells[0].target&&-n<this.getLastCell().target}else this.options.freeScroll||i!=this.selectedIndex||(i+=this.dragEndBoostSelect());delete this.previousDragX,this.select(i),this.dispatchEvent("dragEnd",t,[e])},n.prototype.dragEndRestingSelect=function(){var t=this.getRestingPosition(),e=Math.abs(this.getCellDistance(-t,this.selectedIndex)),i=this._getClosestResting(t,e,1),n=this._getClosestResting(t,e,-1),o=i.distance<n.distance?i.index:n.index;return o},n.prototype._getClosestResting=function(t,e,i){for(var n=this.selectedIndex,o=1/0,r=this.options.contain&&!this.options.wrapAround?function(t,e){return e>=t}:function(t,e){return e>t};r(e,o)&&(n+=i,o=e,e=this.getCellDistance(-t,n),null!==e);)e=Math.abs(e);return{distance:o,index:n-i}},n.prototype.getCellDistance=function(t,e){var i=this.cells.length,n=this.options.wrapAround&&i>1,o=n?r.modulo(e,i):e,s=this.cells[o];if(!s)return null;var a=n?this.slideableWidth*Math.floor(e/i):0;return t-(s.target+a)},n.prototype.dragEndBoostSelect=function(){if(void 0===this.previousDragX||!this.dragMoveTime||new Date-this.dragMoveTime>100)return 0;var t=this.getCellDistance(-this.dragX,this.selectedIndex),e=this.previousDragX-this.dragX;return t>0&&e>0?1:0>t&&0>e?-1:0},n.prototype.staticClick=function(t,e){var i=this.getParentCell(t.target),n=i&&i.element,o=i&&r.indexOf(this.cells,i);this.dispatchEvent("staticClick",t,[e,n,o])},n}),function(t,e){"function"==typeof define&&define.amd?define("tap-listener/tap-listener",["unipointer/unipointer"],function(i){return e(t,i)}):"object"==typeof exports?module.exports=e(t,require("unipointer")):t.TapListener=e(t,t.Unipointer)}(window,function(t,e){function i(t){t.preventDefault?t.preventDefault():t.returnValue=!1}function n(t){this.bindTap(t)}n.prototype=new e,n.prototype.bindTap=function(t){t&&(this.unbindTap(),this.tapElement=t,this._bindStartEvent(t,!0))},n.prototype.unbindTap=function(){this.tapElement&&(this._bindStartEvent(this.tapElement,!0),delete this.tapElement)};var o=n.prototype.pointerDown;n.prototype.pointerDown=function(t){"touchstart"==t.type&&i(t),o.apply(this,arguments)};var r=void 0!==t.pageYOffset;return n.prototype.pointerUp=function(i,n){var o=e.getPointerPoint(n),s=this.tapElement.getBoundingClientRect(),a=r?t.pageXOffset:document.body.scrollLeft,l=r?t.pageYOffset:document.body.scrollTop,c=o.x>=s.left+a&&o.x<=s.right+a&&o.y>=s.top+l&&o.y<=s.bottom+l;c&&this.emitEvent("tap",[i,n])},n.prototype.destroy=function(){this.pointerDone(),this.unbindTap()},n}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/prev-next-button",["eventie/eventie","./flickity","tap-listener/tap-listener","fizzy-ui-utils/utils"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof exports?module.exports=e(t,require("eventie"),require("./flickity"),require("tap-listener"),require("fizzy-ui-utils")):e(t,t.eventie,t.Flickity,t.TapListener,t.fizzyUIUtils)}(window,function(t,e,i,n,o){function r(t,e){this.direction=t,this.parent=e,this._create()}function s(t){return"string"==typeof t?t:"M "+t.x0+",50 L "+t.x1+","+(t.y1+50)+" L "+t.x2+","+(t.y2+50)+" L "+t.x3+",50  L "+t.x2+","+(50-t.y2)+" L "+t.x1+","+(50-t.y1)+" Z"}var a="http://www.w3.org/2000/svg",l=function(){function t(){if(void 0!==e)return e;var t=document.createElement("div");return t.innerHTML="<svg/>",e=(t.firstChild&&t.firstChild.namespaceURI)==a}var e;return t}();return r.prototype=new n,r.prototype._create=function(){this.isEnabled=!0,this.isPrevious=-1==this.direction;var t=this.parent.options.rightToLeft?1:-1;this.isLeft=this.direction==t;var e=this.element=document.createElement("button");if(e.className="flickity-prev-next-button",e.className+=this.isPrevious?" previous":" next",e.setAttribute("type","button"),i.setUnselectable(e),l()){var n=this.createSVG();e.appendChild(n)}else this.setArrowText(),e.className+=" no-svg";var o=this;this.onCellSelect=function(){o.update()},this.parent.on("cellSelect",this.onCellSelect),this.on("tap",this.onTap),this.on("pointerDown",function(t,e){o.parent.childUIPointerDown(e)})},r.prototype.activate=function(){this.update(),this.bindTap(this.element),e.bind(this.element,"click",this),this.parent.element.appendChild(this.element)},r.prototype.deactivate=function(){this.parent.element.removeChild(this.element),n.prototype.destroy.call(this),e.unbind(this.element,"click",this)},r.prototype.createSVG=function(){var t=document.createElementNS(a,"svg");t.setAttribute("viewBox","0 0 100 100");var e=document.createElementNS(a,"path"),i=s(this.parent.options.arrowShape);return e.setAttribute("d",i),e.setAttribute("class","arrow"),this.isLeft||e.setAttribute("transform","translate(100, 100) rotate(180) "),t.appendChild(e),t},r.prototype.setArrowText=function(){var t=this.parent.options,e=this.isLeft?t.leftArrowText:t.rightArrowText;o.setText(this.element,e)},r.prototype.onTap=function(){if(this.isEnabled){this.parent.uiChange();var t=this.isPrevious?"previous":"next";this.parent[t]()}},r.prototype.handleEvent=o.handleEvent,r.prototype.onclick=function(){var t=document.activeElement;t&&t==this.element&&this.onTap()},r.prototype.enable=function(){this.isEnabled||(this.element.disabled=!1,this.isEnabled=!0)},r.prototype.disable=function(){this.isEnabled&&(this.element.disabled=!0,this.isEnabled=!1)},r.prototype.update=function(){var t=this.parent.cells;if(this.parent.options.wrapAround&&t.length>1)return void this.enable();var e=t.length?t.length-1:0,i=this.isPrevious?0:e,n=this.parent.selectedIndex==i?"disable":"enable";this[n]()},r.prototype.destroy=function(){this.deactivate()},o.extend(i.defaults,{prevNextButtons:!0,leftArrowText:"‹",rightArrowText:"›",arrowShape:{x0:10,x1:60,y1:50,x2:70,y2:40,x3:30}}),i.createMethods.push("_createPrevNextButtons"),i.prototype._createPrevNextButtons=function(){this.options.prevNextButtons&&(this.prevButton=new r(-1,this),this.nextButton=new r(1,this),this.on("activate",this.activatePrevNextButtons))},i.prototype.activatePrevNextButtons=function(){this.prevButton.activate(),this.nextButton.activate(),this.on("deactivate",this.deactivatePrevNextButtons)},i.prototype.deactivatePrevNextButtons=function(){this.prevButton.deactivate(),this.nextButton.deactivate(),this.off("deactivate",this.deactivatePrevNextButtons)},i.PrevNextButton=r,i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/page-dots",["eventie/eventie","./flickity","tap-listener/tap-listener","fizzy-ui-utils/utils"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof exports?module.exports=e(t,require("eventie"),require("./flickity"),require("tap-listener"),require("fizzy-ui-utils")):e(t,t.eventie,t.Flickity,t.TapListener,t.fizzyUIUtils)}(window,function(t,e,i,n,o){function r(t){this.parent=t,this._create()}return r.prototype=new n,r.prototype._create=function(){this.holder=document.createElement("ol"),this.holder.className="flickity-page-dots",i.setUnselectable(this.holder),this.dots=[];var t=this;this.onCellSelect=function(){t.updateSelected()},this.parent.on("cellSelect",this.onCellSelect),this.on("tap",this.onTap),this.on("pointerDown",function(e,i){t.parent.childUIPointerDown(i)})},r.prototype.activate=function(){this.setDots(),this.updateSelected(),this.bindTap(this.holder),this.parent.element.appendChild(this.holder)},r.prototype.deactivate=function(){this.parent.element.removeChild(this.holder),n.prototype.destroy.call(this)},r.prototype.setDots=function(){var t=this.parent.cells.length-this.dots.length;t>0?this.addDots(t):0>t&&this.removeDots(-t)},r.prototype.addDots=function(t){for(var e=document.createDocumentFragment(),i=[];t;){var n=document.createElement("li");n.className="dot",e.appendChild(n),i.push(n),t--}this.holder.appendChild(e),this.dots=this.dots.concat(i)},r.prototype.removeDots=function(t){for(var e=this.dots.splice(this.dots.length-t,t),i=0,n=e.length;n>i;i++){var o=e[i];this.holder.removeChild(o)}},r.prototype.updateSelected=function(){this.selectedDot&&(this.selectedDot.className="dot"),this.dots.length&&(this.selectedDot=this.dots[this.parent.selectedIndex],this.selectedDot.className="dot is-selected")},r.prototype.onTap=function(t){var e=t.target;if("LI"==e.nodeName){this.parent.uiChange();var i=o.indexOf(this.dots,e);this.parent.select(i)}},r.prototype.destroy=function(){this.deactivate()},i.PageDots=r,o.extend(i.defaults,{pageDots:!0}),i.createMethods.push("_createPageDots"),i.prototype._createPageDots=function(){this.options.pageDots&&(this.pageDots=new r(this),this.on("activate",this.activatePageDots),this.on("cellAddedRemoved",this.onCellAddedRemovedPageDots),this.on("deactivate",this.deactivatePageDots))},i.prototype.activatePageDots=function(){this.pageDots.activate()},i.prototype.onCellAddedRemovedPageDots=function(){this.pageDots.setDots()},i.prototype.deactivatePageDots=function(){this.pageDots.deactivate()},i.PageDots=r,i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/player",["eventEmitter/EventEmitter","eventie/eventie","./flickity"],function(t,i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(require("wolfy87-eventemitter"),require("eventie"),require("./flickity")):e(t.EventEmitter,t.eventie,t.Flickity)}(window,function(t,e,i){function n(t){if(this.isPlaying=!1,this.parent=t,r){var e=this;this.onVisibilityChange=function(){e.visibilityChange()}}}var o,r;return"hidden"in document?(o="hidden",r="visibilitychange"):"webkitHidden"in document&&(o="webkitHidden",r="webkitvisibilitychange"),n.prototype=new t,n.prototype.play=function(){this.isPlaying=!0,delete this.isPaused,r&&document.addEventListener(r,this.onVisibilityChange,!1),this.tick()},n.prototype.tick=function(){if(this.isPlaying&&!this.isPaused){this.tickTime=new Date;var t=this.parent.options.autoPlay;t="number"==typeof t?t:3e3;var e=this;this.timeout=setTimeout(function(){e.parent.next(!0),e.tick()},t)}},n.prototype.stop=function(){this.isPlaying=!1,delete this.isPaused,this.clear(),r&&document.removeEventListener(r,this.onVisibilityChange,!1)},n.prototype.clear=function(){clearTimeout(this.timeout)},n.prototype.pause=function(){this.isPlaying&&(this.isPaused=!0,this.clear())},n.prototype.unpause=function(){this.isPaused&&this.play()},n.prototype.visibilityChange=function(){var t=document[o];this[t?"pause":"unpause"]()},i.createMethods.push("_createPlayer"),i.prototype._createPlayer=function(){this.player=new n(this),this.on("activate",this.activatePlayer),this.on("uiChange",this.stopPlayer),this.on("pointerDown",this.stopPlayer),this.on("deactivate",this.deactivatePlayer)},i.prototype.activatePlayer=function(){this.options.autoPlay&&(this.player.play(),e.bind(this.element,"mouseenter",this),this.isMouseenterBound=!0)},i.prototype.stopPlayer=function(){this.player.stop()},i.prototype.deactivatePlayer=function(){this.player.stop(),this.isMouseenterBound&&(e.unbind(this.element,"mouseenter",this),delete this.isMouseenterBound)},i.prototype.onmouseenter=function(){this.player.pause(),e.bind(this.element,"mouseleave",this)},i.prototype.onmouseleave=function(){this.player.unpause(),e.unbind(this.element,"mouseleave",this)},i.Player=n,i}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/add-remove-cell",["./flickity","fizzy-ui-utils/utils"],function(i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(t,require("./flickity"),require("fizzy-ui-utils")):e(t,t.Flickity,t.fizzyUIUtils)}(window,function(t,e,i){function n(t){for(var e=document.createDocumentFragment(),i=0,n=t.length;n>i;i++){var o=t[i];e.appendChild(o.element)}return e}return e.prototype.insert=function(t,e){var i=this._makeCells(t);if(i&&i.length){var o=this.cells.length;e=void 0===e?o:e;var r=n(i),s=e==o;if(s)this.slider.appendChild(r);else{var a=this.cells[e].element;this.slider.insertBefore(r,a)}if(0===e)this.cells=i.concat(this.cells);else if(s)this.cells=this.cells.concat(i);else{var l=this.cells.splice(e,o-e);this.cells=this.cells.concat(i).concat(l)}this._sizeCells(i);var c=e>this.selectedIndex?0:i.length;this._cellAddedRemoved(e,c)}},e.prototype.append=function(t){this.insert(t,this.cells.length)},e.prototype.prepend=function(t){this.insert(t,0)},e.prototype.remove=function(t){var e,n,o,r=this.getCells(t),s=0;for(e=0,n=r.length;n>e;e++){o=r[e];var a=i.indexOf(this.cells,o)<this.selectedIndex;s-=a?1:0}for(e=0,n=r.length;n>e;e++)o=r[e],o.remove(),i.removeFrom(this.cells,o);r.length&&this._cellAddedRemoved(0,s)},e.prototype._cellAddedRemoved=function(t,e){e=e||0,this.selectedIndex+=e,this.selectedIndex=Math.max(0,Math.min(this.cells.length-1,this.selectedIndex)),this.emitEvent("cellAddedRemoved",[t,e]),this.cellChange(t,!0)},e.prototype.cellSizeChange=function(t){var e=this.getCell(t);if(e){e.getSize();var n=i.indexOf(this.cells,e);this.cellChange(n)}},e.prototype.cellChange=function(t,e){var i=this.slideableWidth;this._positionCells(t),this._getWrapShiftCells(),this.setGallerySize(),this.options.freeScroll?(this.x+=i-this.slideableWidth,this.positionSlider()):(e&&this.positionSliderAtSelected(),this.select(this.selectedIndex))},e}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/lazyload",["classie/classie","eventie/eventie","./flickity","fizzy-ui-utils/utils"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof exports?module.exports=e(t,require("desandro-classie"),require("eventie"),require("./flickity"),require("fizzy-ui-utils")):e(t,t.classie,t.eventie,t.Flickity,t.fizzyUIUtils)}(window,function(t,e,i,n,o){function r(t){if("IMG"==t.nodeName&&t.getAttribute("data-flickity-lazyload"))return[t];var e=t.querySelectorAll("img[data-flickity-lazyload]");return o.makeArray(e)}function s(t,e){this.img=t,this.flickity=e,this.load()}return n.createMethods.push("_createLazyload"),n.prototype._createLazyload=function(){this.on("cellSelect",this.lazyLoad)},n.prototype.lazyLoad=function(){var t=this.options.lazyLoad;if(t){for(var e="number"==typeof t?t:0,i=this.getAdjacentCellElements(e),n=[],o=0,a=i.length;a>o;o++){var l=i[o],c=r(l);n=n.concat(c)}for(o=0,a=n.length;a>o;o++){var h=n[o];new s(h,this)}}},s.prototype.handleEvent=o.handleEvent,s.prototype.load=function(){i.bind(this.img,"load",this),i.bind(this.img,"error",this),this.img.src=this.img.getAttribute("data-flickity-lazyload"),this.img.removeAttribute("data-flickity-lazyload")},s.prototype.onload=function(t){this.complete(t,"flickity-lazyloaded")},s.prototype.onerror=function(){this.complete(event,"flickity-lazyerror")},s.prototype.complete=function(t,n){i.unbind(this.img,"load",this),i.unbind(this.img,"error",this);var o=this.flickity.getParentCell(this.img),r=o&&o.element;this.flickity.cellSizeChange(r),e.add(this.img,n),this.flickity.dispatchEvent("lazyLoad",t,r)},n.LazyLoader=s,n}),function(t,e){"function"==typeof define&&define.amd?define("flickity/js/index",["./flickity","./drag","./prev-next-button","./page-dots","./player","./add-remove-cell","./lazyload"],e):"object"==typeof exports&&(module.exports=e(require("./flickity"),require("./drag"),require("./prev-next-button"),require("./page-dots"),require("./player"),require("./add-remove-cell"),require("./lazyload")))}(window,function(t){return t}),function(t,e){"function"==typeof define&&define.amd?define("flickity-as-nav-for/as-nav-for",["classie/classie","flickity/js/index","fizzy-ui-utils/utils"],function(i,n,o){return e(t,i,n,o)}):"object"==typeof exports?module.exports=e(t,require("desandro-classie"),require("flickity"),require("fizzy-ui-utils")):t.Flickity=e(t,t.classie,t.Flickity,t.fizzyUIUtils)}(window,function(t,e,i,n){return i.createMethods.push("_createAsNavFor"),i.prototype._createAsNavFor=function(){this.on("activate",this.activateAsNavFor),this.on("deactivate",this.deactivateAsNavFor),this.on("destroy",this.destroyAsNavFor);var t=this.options.asNavFor;if(t){var e=this;setTimeout(function(){e.setNavCompanion(t)})}},i.prototype.setNavCompanion=function(t){t=n.getQueryElement(t);var e=i.data(t);if(e&&e!=this){this.navCompanion=e;var o=this;this.onNavCompanionSelect=function(){o.navCompanionSelect()},e.on("cellSelect",this.onNavCompanionSelect),this.on("staticClick",this.onNavStaticClick),this.navCompanionSelect()}},i.prototype.navCompanionSelect=function(){if(this.navCompanion){var t=this.navCompanion.selectedIndex;this.select(t),this.removeNavSelectedElement(),this.selectedIndex==t&&(this.navSelectedElement=this.cells[t].element,e.add(this.navSelectedElement,"is-nav-selected"))}},i.prototype.activateAsNavFor=function(){this.navCompanionSelect()},i.prototype.removeNavSelectedElement=function(){this.navSelectedElement&&(e.remove(this.navSelectedElement,"is-nav-selected"),delete this.navSelectedElement)},i.prototype.onNavStaticClick=function(t,e,i,n){"number"==typeof n&&this.navCompanion.select(n)},i.prototype.deactivateAsNavFor=function(){this.removeNavSelectedElement()},i.prototype.destroyAsNavFor=function(){this.navCompanion&&(this.navCompanion.off("cellSelect",this.onNavCompanionSelect),this.off("staticClick",this.onNavStaticClick),delete this.navCompanion)},i}),function(t,e){"function"==typeof define&&define.amd?define("imagesloaded/imagesloaded",["eventEmitter/EventEmitter","eventie/eventie"],function(i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(t,require("wolfy87-eventemitter"),require("eventie")):t.imagesLoaded=e(t,t.EventEmitter,t.eventie)}(window,function(t,e,i){function n(t,e){for(var i in e)t[i]=e[i];return t}function o(t){return"[object Array]"===d.call(t)}function r(t){var e=[];if(o(t))e=t;else if("number"==typeof t.length)for(var i=0,n=t.length;n>i;i++)e.push(t[i]);else e.push(t);return e}function s(t,e,i){if(!(this instanceof s))return new s(t,e);"string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=r(t),this.options=n({},this.options),"function"==typeof e?i=e:n(this.options,e),i&&this.on("always",i),this.getImages(),c&&(this.jqDeferred=new c.Deferred);var o=this;setTimeout(function(){o.check()})}function a(t){this.img=t}function l(t){this.src=t,u[t]=this}var c=t.jQuery,h=t.console,p="undefined"!=typeof h,d=Object.prototype.toString;s.prototype=new e,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var t=0,e=this.elements.length;e>t;t++){var i=this.elements[t];"IMG"===i.nodeName&&this.addImage(i);var n=i.nodeType;if(n&&(1===n||9===n||11===n))for(var o=i.querySelectorAll("img"),r=0,s=o.length;s>r;r++){var a=o[r];this.addImage(a)}}},s.prototype.addImage=function(t){var e=new a(t);this.images.push(e)},s.prototype.check=function(){function t(t,o){return e.options.debug&&p&&h.log("confirm",t,o),e.progress(t),i++,i===n&&e.complete(),!0}var e=this,i=0,n=this.images.length;if(this.hasAnyBroken=!1,!n)return void this.complete();for(var o=0;n>o;o++){var r=this.images[o];r.on("confirm",t),r.check()}},s.prototype.progress=function(t){this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded;var e=this;setTimeout(function(){e.emit("progress",e,t),e.jqDeferred&&e.jqDeferred.notify&&e.jqDeferred.notify(e,t)})},s.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var e=this;setTimeout(function(){if(e.emit(t,e),e.emit("always",e),e.jqDeferred){var i=e.hasAnyBroken?"reject":"resolve";e.jqDeferred[i](e)}})},c&&(c.fn.imagesLoaded=function(t,e){var i=new s(this,t,e);return i.jqDeferred.promise(c(this))}),a.prototype=new e,a.prototype.check=function(){var t=u[this.img.src]||new l(this.img.src);if(t.isConfirmed)return void this.confirm(t.isLoaded,"cached was confirmed");if(this.img.complete&&void 0!==this.img.naturalWidth)return void this.confirm(0!==this.img.naturalWidth,"naturalWidth");var e=this;t.on("confirm",function(t,i){return e.confirm(t.isLoaded,i),!0}),t.check()},a.prototype.confirm=function(t,e){this.isLoaded=t,this.emit("confirm",this,e)};var u={};return l.prototype=new e,l.prototype.check=function(){if(!this.isChecked){var t=new Image;i.bind(t,"load",this),i.bind(t,"error",this),t.src=this.src,this.isChecked=!0}},l.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},l.prototype.onload=function(t){this.confirm(!0,"onload"),this.unbindProxyEvents(t)},l.prototype.onerror=function(t){this.confirm(!1,"onerror"),this.unbindProxyEvents(t)},l.prototype.confirm=function(t,e){this.isConfirmed=!0,this.isLoaded=t,this.emit("confirm",this,e)},l.prototype.unbindProxyEvents=function(t){i.unbind(t.target,"load",this),i.unbind(t.target,"error",this)},s}),function(t,e){"function"==typeof define&&define.amd?define(["flickity/js/index","imagesloaded/imagesloaded"],function(i,n){return e(t,i,n)}):"object"==typeof exports?module.exports=e(t,require("flickity"),require("imagesloaded")):t.Flickity=e(t,t.Flickity,t.imagesLoaded)}(window,function(t,e,i){return e.createMethods.push("_createImagesLoaded"),e.prototype._createImagesLoaded=function(){this.on("activate",this.imagesLoaded)},e.prototype.imagesLoaded=function(){function t(t,i){var n=e.getParentCell(i.img);e.cellSizeChange(n&&n.element),e.options.freeScroll||e.positionSliderAtSelected()}if(this.options.imagesLoaded){var e=this;i(this.slider).on("progress",t)}},e});