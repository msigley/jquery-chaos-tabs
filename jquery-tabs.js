(function( $ ) {
	$.fn.simpleTabs = function() {
		//Reformat HTML
		var anchorOutput = '';
		var menuOutput = '';
		var contentOutput = '';
		this.children('.tab').each(function(index, e) {
			var title = $(e).find('.tab-title');
			var content = $(e).find('.tab-content');
			anchorOutput += '<a name="tab-'+title.html()+'"></a>';
			menuOutput += '<li '+((index === 0) ? 'class="first"' : '')+'><a href="#tab-'+title.html()+'" rel="#tab-'+index+'">'+title.html()+'</a></li>';
			contentOutput += '<div id="tab-'+index+'" class="tab-content">'+content.html()+'</div>';
		});
		this.html('<div id="tabs-wrap">'+anchorOutput+'<ul class="tab-menu clearfix">'+menuOutput+'</ul>'+contentOutput+'</div>');
		
		//Hide all tab content
		this.find('.tab-content').hide();
		
		//Check for predefined active tab in location hash
		if(!currentTabtoHash(this)) {
			//Tab title not found in hash
			//Set first tab as active and show its content
			this.find('.tab-menu').find('li:first').addClass('active');
			this.find('.tab-content:first').show();
		} else {
			//Force broswer to scroll to the appropriate tab anchor
			var hash = window.location.href.substr(window.location.href.indexOf('#')+1);
			var anchorElement = $('a[name="'+hash+'"]').get(0);
			if(typeof anchorElement === 'undefined') {
				//Don't decode the hash due to a bug with IE that only matchs encoded hashs in the following query
				anchorElement = $('a[name="'+decodeURIComponent(hash)+'"]').get(0);
			}
			anchorElement.scrollIntoView(true);
		}
		
		var tabContainer = this;
		var documentMode = window.document.documentMode;
		if ('onhashchange' in window && (typeof documentMode === 'undefined' || documentMode >= 8)) {
			//Bind onhashchange event. This allows links to tabs on a page
			//Only works with modern browsers
			window.onhashchange = function (e) {
				currentTabtoHash(tabContainer);
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
							return false;
						}
					});
				}
			});
		}
		
		return this;
	};
	
	function currentTabtoHash(tabsJQueryObj) {
		var hash = window.location.href.substr(window.location.href.indexOf('#')+1);
		var regexResult = hash.match(/tab\-(.+)/);
		if (regexResult != null) {
			//Set tab in location hash to active and show its content
			var activateTabTitle = decodeURIComponent(regexResult[1]);
			var foundTab = false;
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
			return true;
		}
		//Regex result not found
		return false;
	}
})( jQuery );