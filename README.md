jQuery Chaos Tabs
=================

A Simple yet extendable jQuery tabs plugin that reformats existing html avoiding AJAX allowing 
for easier implementation.

What is this useful for?
-------------------------
Any page were alot of information is required and broken down into sections using h2s, h3s, etc. 

Example Usage
-------------
```
<html>
	<head>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="jquery-tabs.js"></script>
		<script>
		$(document).ready(function() {
			$('#chaos-tabs-group').chaosTabs({
				arrows: true, // Show arrows if tabs do not fit in width of parent container
				arrowRightPadding: 30,
				arrowLeftPadding: 30
			});
		});
		</script>
	</head>
	<body>
		<h1>jQuery Chaos Tabs Example</h1>
		<!--This is default jump position for the tabs-->
		<div id="chaos-tabs-group">
			<div class="tab">
				<h2 class="tab-title">This is the title of tab 1</h2>
				<div class="tab-content">This is the content for tab 1</div>
			</div>
			<div class="tab">
				<h2 class="tab-title">This is the title of tab 2</h2>
				<div class="tab-content">This is the content for tab 2</div>
			</div>
		</div>
	</body>
</html>
```

Features
--------
- Externally link directly to a specific tab
	- http://example.com/#tab-Tab%20title
- Link to a specific tab from content on the same page
	- ```<a href="#tab-Tab%20title">Go to Tab</a>```
- Set the jump position of the tab by defining the HTML anchor on the page
	- ```<div id="tab-Tab%20title"></div>```
- Callback function support for when a tab is switched
- Easy to implement via CSS classes.
- Javascript event maintenance in tab content from source html.
- Performant.
	- Avoids forcing browser to reparse HTML and implements CSS `contain` and `content-visibility`.
