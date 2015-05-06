/*
 * jQuery Chaos Tabs
 * By Matthew Sigley
 * Version 1.2.0
 */

(function( $ ) {
	$.fn.simpleTabs = function(callback) {
		//Reformat HTML
		var anchorOutput = '',
			menuOutput = '',
			contentElements = new Array();
		this.children('.tab').each(function(index, e) {
			var title = $(e).find('.tab-title'),
				titleText = title.text(),
				contentClone = $(e).find('.tab-content').clone(true);
			if( $('[id="tab-'+titleText+'"], a[name="tab-'+titleText+'"]').length == 0 ) {
				anchorOutput += '<a name="tab-'+titleText+'"></a>';
			}
			menuOutput += '<li '+((index === 0) ? 'class="first"' : '')+'><a href="#tab-'+titleText+'" rel="#tab-'+index+'">'+titleText+'</a></li>';
			contentClone.wrap('<div id="tab-'+index+'" class="tab-content"></div>');
			contentElements.push(contentClone);
		});
		this.html('<div id="tabs-wrap">'+anchorOutput+'<ul class="tab-menu clearfix">'+menuOutput+'</ul></div>');
		for(var i=0; i<contentElements.length; i++) {
			this.append(contentElements[i]);
		}
		
		//Hide all tab content
		this.find('.tab-content').hide();
		
		//Check for predefined active tab in location hash
		var activateTabTitle = currentTabtoHash(this);
		if(!activateTabTitle) {
			//Tab title not found in hash
			//Set first tab as active and show its content
			var firstTabMenuItem = this.find('.tab-menu').find('li:first');
			firstTabMenuItem.addClass('active');
			this.find('.tab-content:first').show();
			if (callback && typeof(callback) === "function") {  
				callback(firstTabMenuItem.find('a').html());
			}
		} else {
			//Force broswer to scroll to the appropriate tab anchor
			var hash = window.location.href.substr(window.location.href.indexOf('#')+1);
			var anchorElement = $('[id="'+hash+'"], a[name="'+hash+'"]').get(0);
			if(typeof anchorElement === 'undefined') {
				//Don't decode the hash due to a bug with IE that only matchs encoded hashs in the following query
				anchorElement = $('[id="'+decodeURIComponent(hash)+'"], a[name="'+decodeURIComponent(hash)+'"]').get(0);
			}
			anchorElement.scrollIntoView(true);
			if (callback && typeof(callback) === "function") {  
				callback(activateTabTitle);
			}
		}
		
		var tabContainer = this,
			documentMode = window.document.documentMode;
		if ('onhashchange' in window && (typeof documentMode === 'undefined' || documentMode >= 8)) {
			//Bind onhashchange event. This allows links to tabs on a page
			//Only works with modern browsers
			window.onhashchange = function (e) {
				var tabFound = currentTabtoHash(tabContainer);
				if (tabFound && callback && typeof(callback) === "function") {  
					callback(tabFound);  
				}
			};
		} else {
			//Bind click events to anchor links for older browsers without support for onhashchange
			//This still allows links to tabs on a page, but it is much slower than the onhashchange method
			$('body').find('a[href*="#tab-"]').click(function() {
				//Get tab title from href attribute
				var hash = $(this).attr('href');
				hash = hash.substr(hash.indexOf('#')+1);
				var regexResult = hash.match(/tab\-(.+)/);
				if (regexResult != null) {
					var activateTabTitle = decodeURIComponent(regexResult[1]);
					var foundTab = false;
					tabContainer.find('.tab-menu').find('li').each(function() {
						if($(this).find('a').html() == activateTabTitle) {
							//Set new active tab
							tabContainer.find('.tab-menu').children('.active').removeClass('active');
							$(this).addClass('active');
							
							//Show active tab's content
							tabContainer.find('.tab-content').hide();
							var currentTab = $(this).find('a').attr('rel');
							$(currentTab).show();
							
							//Stop .each loop
							foundTab = true;
							return false;
						}
					});
					if (!foundTab) {
						//Matching tab title was not found
						return;
					}
					//Found and set currentTab
					if (callback && typeof(callback) === "function") {  
						callback(activateTabTitle);
					}
					return;
				}
				//Regex result not found
				return;
			});
		}
		
		return this;
	};
	
	function currentTabtoHash(tabsJQueryObj) {
		var hash = window.location.href.substr(window.location.href.indexOf('#')+1),
			regexResult = hash.match(/tab\-(.+)/);
		if (regexResult != null) {
			//Set tab in location hash to active and show its content
			var activateTabTitle = decodeURIComponent(regexResult[1]),
				foundTab = false;
			tabsJQueryObj.find('.tab-menu').find('li').each(function() {
				if($(this).find('a').html() == activateTabTitle) {
					//Make this tab the active tab
					tabsJQueryObj.find('.tab-menu').children('.active').removeClass('active');
					$(this).addClass('active');
					
					//Show active tab's content
					tabsJQueryObj.find('.tab-content').hide();
					var currentTab = $(this).find('a').attr('rel');
					$(currentTab).show();
					
					//Stop .each loop
					foundTab = true;
					return false;	
				}
			});
			if (!foundTab) {
				//Matching tab title was not found
				return false;	
			}
			//Found and set currentTab
			return activateTabTitle;
		}
		//Regex result not found
		return false;
	}
})( jQuery );