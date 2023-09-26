/*
 * jQuery Chaos Tabs
 * By Matthew Sigley
 * Version 1.5.0
 */

(function( $ ) {
	$.resizeChaosTabsEvent = function(e) {
		cancelAnimationFrame( e.data.tabContainer.get(0).chaosTabsResizeFrame );
		e.data.tabContainer.get(0).chaosTabsResizeFrame = requestAnimationFrame( e.data.tabContainer.get(0).resizeChaosTabs ); //Run event handler when not busy
	}
	
	$.clickArrowChaosTabsEvent = function(e) {
		var tabMenuWrap = e.data.tabMenuWrap,
			arrowDirection = e.data.arrowDirection;
		
		tabMenuWrap.stop();
		if (arrowDirection == 'left') {
			tabMenuWrap.animate({'scrollLeft': tabMenuWrap.scrollLeft() - 100}, 100);
		} else if (arrowDirection == 'right') {
			tabMenuWrap.animate({'scrollLeft': tabMenuWrap.scrollLeft() + 100}, 100);
		}
	}
	
	$.fn.chaosTabsCacheTabProperties = function() {
		var thisElementObj = this.get(0),
			tabMenuWrap = this.find('.tab-menu-wrap:first'),
			tabMenu = this.find('.tab-menu:first'),
			tabMenuWidth = tabMenu.width(),
			isTabMenuWrapBorderBox = tabMenuWrap.css( "box-sizing" ) === "border-box",
			isTabMenuBorderBox = tabMenu.css( "box-sizing" ) === "border-box",
			tabArrows = this.find('.arrow');
		
		if( isTabMenuWrapBorderBox )
			tabMenuWrap.css({'padding-left': '', 'padding-right': ''});
			
		var tabMenuWrapPaddingLeft = parseFloat( tabMenuWrap.css('padding-left') ),
			tabMenuWrapPaddingRight = parseFloat( tabMenuWrap.css('padding-right') );
		if( !isNaN(tabMenuWrapPaddingLeft) && isFinite(tabMenuWrapPaddingLeft) ) 
			tabMenuWrapPaddingLeft = 0;
		if( !isNaN(tabMenuWrapPaddingRight) && isFinite(tabMenuWrapPaddingRight) )
			tabMenuWrapPaddingRight = 0;
		
		if( isTabMenuWrapBorderBox )
			tabMenuWrap.css({'padding-left': tabMenuWrapPaddingLeft, 'padding-right': tabMenuWrapPaddingRight});
		
		// Cache calculated values to element obj
		thisElementObj.tabMenuWrap = tabMenuWrap;
		thisElementObj.tabMenu = tabMenu;
		thisElementObj.tabMenuWidth = tabMenuWidth;
		thisElementObj.isTabMenuWrapBorderBox = isTabMenuWrapBorderBox,
		thisElementObj.isTabMenuBorderBox = isTabMenuBorderBox;
		thisElementObj.tabArrows = tabArrows;
		thisElementObj.tabMenuWrapPaddingLeft = tabMenuWrapPaddingLeft;
		thisElementObj.tabMenuWrapPaddingRight = tabMenuWrapPaddingRight;
	};
	
	$.fn.chaosTabsAttachArrowEvents = function() {
		var thisElementObj = this.get(0),
			args = thisElementObj.chaosTabsArgs,
			tabArrows = thisElementObj.tabArrows,
			tabMenuWrap = thisElementObj.tabMenuWrap,
			tabMenu = thisElementObj.tabMenu;
		// Assume left arrow is index 0 and right arrow is index 1
		// jQuery always returns collections in document order
		tabArrows.eq(0).on('click', {tabMenuWrap: tabMenuWrap, arrowDirection: 'left'}, $.clickArrowChaosTabsEvent);
		tabArrows.eq(1).on('click', {tabMenuWrap: tabMenuWrap, arrowDirection: 'right'}, $.clickArrowChaosTabsEvent);
		//Scroll tabmenu items into view when they are clicked
		tabMenu.find('li').on('click', function() {
			var thisElement = $(this);
				thisPosition = thisElement.position();
			tabMenuWrap.stop().animate({'scrollLeft': thisPosition['left'] - args['arrowLeftPadding']}, 100);
		});
	};
	
	$.fn.chaosTabsHandleOverflowArrows = function() {
		var thisElementObj = this.get(0),
			args = thisElementObj.chaosTabsArgs,
			tabArrowsShown = thisElementObj.chaosTabsArrowsShown || false,
			windowWidth = $(window).width();
		
		if (typeof thisElementObj.chaosTabsLastWindowWidth != 'undefined') {
			if (thisElementObj.chaosTabsLastWindowWidth == windowWidth
				|| (thisElementObj.chaosTabsLastWindowWidth < windowWidth && !tabArrowsShown)
				|| (thisElementObj.chaosTabsLastWindowWidth > windowWidth && tabArrowsShown) ) {
				thisElementObj.chaosTabsArrowsShown = tabArrowsShown
				thisElementObj.chaosTabsLastWindowWidth = windowWidth;
				return;
			}
		}
		
		var tabMenuWrap = thisElementObj.tabMenuWrap,
			tabMenu = thisElementObj.tabMenu,
			tabMenuWrapWidth = tabMenuWrap.width(),
			tabMenuWidth = thisElementObj.tabMenuWidth,
			isTabMenuWrapBorderBox = thisElementObj.isTabMenuWrapBorderBox,
			isTabMenuBorderBox = thisElementObj.isTabMenuBorderBox,
			tabMenuWrapPaddingLeft = thisElementObj.tabMenuWrapPaddingLeft,
			tabMenuWrapPaddingRight = thisElementObj.tabMenuWrapPaddingRight,
			tabArrows = thisElementObj.tabArrows;
		
		if (isTabMenuWrapBorderBox && tabArrowsShown) {
			tabMenuWrapWidth -= tabMenuWrapPaddingLeft + tabMenuWrapPaddingRight;
		}
		
		if (isTabMenuBorderBox && tabArrowsShown)
			tabMenuWidth -= args['arrowRightPadding'] + args['arrowLeftPadding'];
		
		if (tabMenuWidth > tabMenuWrapWidth && !tabArrowsShown) {
			tabMenu.data({
				'padding-right': tabMenu.css('padding-right'),
				'padding-left': tabMenu.css('padding-left')
			});
			tabMenu.css({ 
				'padding-right': '+='+args['arrowRightPadding'],
				'padding-left': '+='+args['arrowLeftPadding']
			});
			tabArrows.show().css('content-visibility', 'visible');
			tabArrowsShown = true;
		} else if (tabMenuWidth <= tabMenuWrapWidth && tabArrowsShown) {
			tabArrows.hide().css('content-visibility', 'hidden');
			tabMenu.css({ 
				'padding-right': tabMenu.data('padding-right'),
				'padding-left': tabMenu.data('padding-left')
			});
			tabArrowsShown = false;
		}
		
		thisElementObj.chaosTabsArrowsShown = tabArrowsShown
		thisElementObj.chaosTabsLastWindowWidth = windowWidth;
	}
	
	$.fn.chaosTabs = function(args) {
		//Default args
		var defaults = { arrows: false, arrowRightPadding: 20, arrowLeftPadding: 20, callback: false };
		args  = $.extend({}, defaults, args);
		
		var callback = args['callback'];

		var windowElement = $(window),
			parentElement = this.parent();
		
		//Minimize CSS recalulations from tab setup
		this.css('contain', 'layout paint style');
		this.css('position', 'relative');

		//Parse HTML and setup tabs
		var anchorOutput = '',
			menuOutput = '',
			contentElements = new Array();
		this.children('.tab').each(function(index, e) {
			var eElement = $(e), 
				title = eElement.find('.tab-title'),
				titleText = title.text(),
				titleFragment = encodeURIComponent( titleText.replace('?','') ),
				content = eElement.find('.tab-content');

			title.hide().css('content-visibility', 'hidden');
			content.hide().css('content-visibility', 'hidden');

			if( !titleFragment )
				return;

			if( $('[id="tab-'+titleFragment+'"], a[name="tab-'+titleFragment+'"]').length == 0 ) {
				anchorOutput += '<div id="tab-'+titleFragment+'" style="position: absolute; top: -100px;"></div>';
			}

			menuOutput += '<li '+((index === 0) ? 'class="first"' : '')+'>'
				+'<a href="#tab-'+titleFragment+'" rel="#tab-'+index+'">'+titleText+'</a></li>';
			
			content.attr('id', 'tab-'+index);
		});
		menuOutput = '<ul class="tab-menu clearfix">'+menuOutput+'</ul>';
		if( args['arrows'] ) {
			menuOutput = '<div class="tab-menu-wrap" '
				+'style="box-sizing: border-box; overflow-x: auto; overflow-y:hidden; -webkit-overflow-scrolling:touch;">'
				+menuOutput+'</div>';
			menuOutput = '<div class="tab-arrow-wrap">'
				+'<a class="arrow-left arrow" style="display: none;">&#9668;</a>'
				+menuOutput
				+'<a class="arrow-right arrow" style="display: none;">&#9658;</a></div>';
		} else {
			menuOutput = '<div class="tab-menu-wrap">'+menuOutput+'</div>';
		}
		this.prepend(anchorOutput + menuOutput);
		
		//Cache args on tabContainer element
		parentElement.get(0).chaosTabsArgs = args;
		
		if( args['arrows'] ) {
			parentElement.chaosTabsCacheTabProperties();
			parentElement.chaosTabsAttachArrowEvents();
			parentElement.chaosTabsHandleOverflowArrows();
			parentElement.get(0).resizeChaosTabs = parentElement.chaosTabsHandleOverflowArrows.bind( parentElement );
			var events = [ 'resize', 'load', 'transitionend', 'animationend' ];
			for(i = 0; i < events.length; i++) {
				windowElement.on( events[i], {tabContainer: parentElement}, $.resizeChaosTabsEvent );
			}
		}
		
		//Check for predefined active tab in location hash
		var activateTabTitle = currentTabtoHash(this);
		if(!activateTabTitle) {
			//Tab title not found in hash
			//Set first tab as active and show its content
			var firstTabMenuItem = this.find('.tab-menu li').first();
			firstTabMenuItem.addClass('active');
			this.find('.tab-content').first().show().css('content-visibility', 'visible');

			if (callback && typeof(callback) === "function") {  
				callback(firstTabMenuItem.find('a').html());
			}
		}
		
		var tabContainer = this;
		//Bind onhashchange event. This allows links to tabs on a page
		window.addEventListener( 'hashchange', function (e) {
			var tabFound = currentTabtoHash(tabContainer);

			if (tabFound && callback && typeof(callback) === "function") {  
				callback(tabFound);  
			}
		});

		return this;
	};
	
	function currentTabtoHash( tabsJQueryObj ) {	
		var hash = window.location.hash.substring(1);
		if ( hash.substring(0, 4) !== 'tab-' ) {
			//not a tab hash
			return false;
		}

		//Set tab in location hash to active and show its content
		var activeTabLink = tabsJQueryObj.find('.tab-menu li > a[href="#'+hash+'"]').first();
		if( activeTabLink.length ) {
			//Make this tab the active tab
			tabsJQueryObj.find('.tab-menu').children('.active').removeClass('active');
			activeTabLink.parent().addClass('active');
			
			//Show active tab's content
			tabsJQueryObj.find('.tab-content').hide().css('content-visibility', 'hidden');
			$(activeTabLink.attr('rel')).show().css('content-visibility', 'visible');
		} else {
			//Matching tab title was not found
			return false;
		}

		var anchorElement = tabsJQueryObj.find('[id="'+hash+'"], a[name="'+hash+'"]').first();
		if( anchorElement.length ) {
			anchorElement.get(0).scrollIntoView(true);
		}

		//Found and set currentTab
		return window.location.hash;
	};
})( jQuery );
