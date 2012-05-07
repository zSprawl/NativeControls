$(document).bind( "mobileinit", function(event) {
	$.mobile.loadingMessageTextVisible = true;
    $.mobile.loadingMessage = "Loading..."; 
    $.mobile.orientationChangeEnabled = false;
	$.extend($.mobile.zoom, {locked:true,enabled:false});
	$.mobile.transitionHandlers = { "default" : $.mobile.defaultTransitionHandler };
});

function preventBehavior(e) { 
    e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false); 

//
// Convert RGB to Hex colors
//
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
    + "0123456789ABCDEF".charAt(n%16);
}

//
// TEST FOR iOS AND ORIENTATION
//
function isiPhone() {
    if (( navigator.platform == 'iPhone' ) || ( navigator.platform == 'iPod' ) || ( navigator.platform == 'iPhone Simulator')) {
        return true;
    } else {
        return false;
    }
    return false;
}

function isiPad() {
    if (( navigator.platform == 'iPad' ) || ( navigator.platform == 'iPad Simulator' )) {
        return true;
    } else {
        return false;
    }
    return false;
}

function isLandscape() {
    if (isiPhone()) {
        if ($(window).width() >= 480)   {
            return true;
        } else {
            return false;
        }
    }
    if ($(window).width() >= 1024)   {
        return true;
    } else {
        return false;
    }
    return false;
}

;(function($) { 
/* 
* jQuery preloadImages v2.1.0 
* http://www.tentonaxe.com/ 
* 
* Copyright 2012 Kevin Boudloche 
* Dual licensed under the MIT or GPL Version 2 licenses. 
* 
* Date: 02/24/2012 
*/ 
$.preloadImages = function( imgArr, callback ) { 
    var def = $.Deferred(), imagesLoaded = 0, defArr = []; 

    /* 
     * This function performs a single image preload 
     */ 
    function _preloadImage ( url, callback, fail ) { 
        var img = new Image(); 
        img.src = url; 
        if ( img.complete || img.readyState === 4 ) { 
            callback(); 
        } 
    else { 
            $( img ).bind( "error load onreadystatechange", function ( e ) { 
                //clearTimeout(errorTimer); 
                if (e.type === "error") { 
                    fail( "Image failed to load. - " + url); 
                } 
                else { 
                    callback(url); 
                } 
            }); 
        } 

    } 

    /* 
     * If a callback was passed to the plugin, bind it 
     * to the always callback of the deferred 
     */ 
    if ( $.type( callback ) === "function" ) { 
        def.always( callback ); 
    } 

    /* 
     * If an empty array is passed to the plugin, 
     * immediately resolve and exit. 
     */ 
    if ( $.type( imgArr ) === "array" && imgArr.length === 0 ) { 
        def.resolve(); 
        return def.promise(); 
    } 

    /* 
     * If a url is passed as the first argument, 
     * preload the url. 
     */ 
    if ( typeof imgArr === "string" ) { 
        _preloadImage( imgArr, def.resolve, def.reject ); 
        return def.promise(); 
    } 

    /* 
     * One last check to make sure that imgArr is 
     * defined and is an array 
     */ 
    if ( !imgArr || $.type( imgArr ) !== "array" ) { 
        def.resolve(); 
        return def.promise(); 
    } 

    /* 
     * If we've gotten this far, the first argument 
     * is more than likely an array of images. Loop 
     * through the array and preload each image. When 
     * done, resolve the deferred object. 
     */ 
    $.each( imgArr, function ( i, url ) { 

        // add a new deferred object onto the array at this index 
        defArr[ i ] = $.Deferred(); 

        // preload the image and resolve the deferred when done 
        _preloadImage( url, defArr[ i ].resolve, defArr[ i ].reject ); 

    }); 

    // When all deferreds in defArr are resolved, resolve the overall deferred object. 
    $.when.apply( $, defArr ).then( def.resolve, def.reject ); 
        return def.promise(); 
    }; 

})( jQuery );

$(document).bind("mobileinit", function(){
	$.mobile.defaultTransitionHandler = function( name, reverse, $to, $from ) {

		var deferred = new $.Deferred(),
			sequential = false,
			reverseClass = reverse ? " reverse" : "",
			active	= $.mobile.urlHistory.getActive(),
			toScroll = active.lastScroll || $.mobile.defaultHomeScroll,
			screenHeight = $.mobile.getScreenHeight(),
			maxTransitionOverride = $.mobile.maxTransitionWidth !== false && $( window ).width() > $.mobile.maxTransitionWidth,
			none = !$.support.cssTransitions || maxTransitionOverride || !name || name === "none",
			toggleViewportClass = function(){
				$.mobile.pageContainer.toggleClass( "ui-mobile-viewport-transitioning viewport-" + name );
			},
			scrollPage = function(){
				// By using scrollTo instead of silentScroll, we can keep things better in order
				// Just to be precautios, disable scrollstart listening like silentScroll would
				$.event.special.scrollstart.enabled = false;

				window.scrollTo( 0, toScroll );

				// reenable scrollstart listening like silentScroll would
				setTimeout(function() {
					$.event.special.scrollstart.enabled = true;
				}, 150 );
			},
			cleanFrom = function(){
				$from
					.removeClass( $.mobile.activePageClass + " out in reverse " + name )
					.height( "" );
			},
			startOut = function(){
				// if it's not sequential, call the doneOut transition to start the TO page animating in simultaneously
				if( !sequential ){
					doneOut();
				}
				else {
					$from.animationComplete( doneOut );	
				}

				// Set the from page's height and start it transitioning out
				// Note: setting an explicit height helps eliminate tiling in the transitions
				$from
					.height( screenHeight + $(window ).scrollTop() )
					.addClass( name + " out" + reverseClass );
			},

			doneOut = function() {

				if ( $from && sequential ) {
					cleanFrom();
				}

				startIn();
			},

			startIn = function(){	

				$to.addClass( $.mobile.activePageClass );				

				// Send focus to page as it is now display: block
				$.mobile.focusPage( $to );

				// Set to page height
				$to.height( screenHeight + toScroll );

				scrollPage();

				if( !none ){
					$to.animationComplete( doneIn );
				}

				$to.addClass( name + " in" + reverseClass );

				if( none ){
					doneIn();
				}

			},

			doneIn = function() {

				if ( !sequential ) {

					if( $from ){
						cleanFrom();
					}
				}

				$to
					.removeClass( "out in reverse " + name )
					.height( "" );

				toggleViewportClass();

				// In some browsers (iOS5), 3D transitions block the ability to scroll to the desired location during transition
				// This ensures we jump to that spot after the fact, if we aren't there already.
				if( $( window ).scrollTop() !== toScroll ){
					scrollPage();
				}

				deferred.resolve( name, reverse, $to, $from, true );
			};

		toggleViewportClass();

		if ( $from && !none ) {
			startOut();
		}
		else {
			doneOut();
		}

		return deferred.promise();
	};
	$.extend($.mobile, {
		defaultPageTransition: "slide",
		loadingMessage: "Loading, Please Wait..."
	});
});