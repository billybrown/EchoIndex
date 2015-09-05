/*global $:false, jQuery:false, document:false, window:false, console:false, setTimeout:false, enquire:false, Waypoint:false, sticky: false */

jQuery( document ).ready( function( $ ) {
	"use strict";


	/////////////////////////////////////-+++-
	// plugin initialization

	// this makes all videos responsive inside the main content area
	$(".SiteMain").fitVids();



$('.Examples').flickity({
  // options
  // wrapAround: false,
  // freeScroll: false,
  // cellSelector: '.ExamplesCell',
  // setGallerySize: false,
  // percentPosition: false
 });

	/////////////////////////////////////-+++-
	// custom functions

	var classTrigger = function(trigger, receiver, classer) {
		// trigger the adding and removing of classes. Actual animation is handled by CSS.
		$(trigger).click(function() {
			$(receiver).toggleClass(classer);
		});
	};

	classTrigger('#MobileMenu__close, #MobileMenu__open', 'html', 'active-MobileMenu');

});