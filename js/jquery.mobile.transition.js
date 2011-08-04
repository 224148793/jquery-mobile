/*!
 * jQuery Mobile v@VERSION
 * http://jquerymobile.com/
 *
 * Copyright 2010, jQuery Project
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( $, window, undefined ) {

/**
 * Runs a transition on the element specified by the animation classes passed as first argument
 * (cp. jquery.mobile.transitions.css) and calls a callback once they're done.
 *
 * If the callback event has not been triggered after <timeout> milliseconds, the callback is
 * called "manually". The optional third argument allows you to define a custom timeout or
 * disable it completely (by passing 0 or false).
 */
$.fn.jqmTransition = function( classes ) {
	console.log("jqmTransition( '"+classes+"')" );
	if ( $.support.cssTransitions ) {
		var $this = $( this );
		var fallbackTimeout = null;
		var handler = function() {
			if ( fallbackTimeout ) {
				clearTimeout( fallbackTimeout );
			}
			var result = callback ? callback.apply( this, arguments ) : undefined;
			$this.removeClass( "animate " + classes );
			return result;
		};
		// add animate class to start animation
		$this.addClass( classes );
		setTimeout(function() {
			$this.addClass( "animate" );
		}, 25 );
		return $this;
	} else {
		// defer execution for consistency between webkit/non webkit
		setTimeout( callback, 25 );
		return $( this );
	}
};

function makeCss3TransitionHandler(isTwoMovingParts) {
	return function( name, reverse, $to, $from ) {
		var deferred = new $.Deferred(),
			reverseClass = reverse ? " reverse" : "",
			viewportClass = "ui-mobile-viewport-transitioning viewport-" + name,
			doneFunc = function() {
				console.log( name + reverseClass + ": doneFunc()" );
				$to.add( $from ).removeClass( "out in reverse " + name );
				if ( $from ) {
					$from.removeClass( $.mobile.activePageClass );
				}
				$to.parent().removeClass( viewportClass );

				deferred.resolve( name, reverse, $to, $from );
			};

		if ( !reverse ) {
			$to.transitionComplete( doneFunc );
		} else {
			$from.transitionComplete( doneFunc );
		}

		$to.parent().addClass( viewportClass );
		if ( $from ) {
			$from.jqmTransition( name + " out" + reverseClass);
		}
		$to.addClass( $.mobile.activePageClass );

		if ( isTwoMovingParts || !reverse ) {
			$to.jqmTransition( name + " in" + reverseClass);
		}

		return deferred.promise();
	}
}

// Make our transition handler public.
$.mobile.css3TransitionHandler = makeCss3TransitionHandler();

// If the default transition handler is the 'none' handler, replace it with our handler.
if ( $.mobile.defaultTransitionHandler === $.mobile.noneTransitionHandler ) {
	$.mobile.defaultTransitionHandler = $.mobile.css3TransitionHandler;
}

// If the flip transition handler is the 'none' handler, replace it with our handler.
if ( $.mobile.transitionHandlers.flip === $.mobile.noneTransitionHandler ) {
	$.mobile.transitionHandlers.flip = makeCss3TransitionHandler(true);
}

})( jQuery, this );
