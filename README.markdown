Chrome Extension Development, By Example
========================================

_Ben Coe ([@benjamincoe](http://twitter.com/#/benjamincoe))_

Why Create a Chrome Extension?
------------------------------

* It's a great way to integrate seamlessly with a third-party site like Gmail.
 * It in turn solves the "other site" problem, i.e., your customers don't want to go to yet another website.
* The Chrome Web Store is a wonderful source of traffic.
* All your friends are doing it.

Challenges
----------

* A somewhat difficult paradigm to work with.
* Hooking into the DOM of a 3rd party website is fragile.

Surmounting these Challenges
----------------------------

* Learning to work within the paradigm.
* Writing clean, well designed, JavaScript (make sure your DOM selectors are based on sound assumptions).
* Listening to this presentation.

The Example, ImageMaily
-----------------------

ImageMaily lets you right-click on an image on a webpage and send it to an email address.

The Building Blocks
-------------------

_Background Pages_

* One background page runs for your extension.
* It can make XHR requests to the endpoints specified in the manifest.
* Can't modify the DOM of pages.

_Context Menus_

* Let you add new right click options to specific types of page elements.

_Content Scripts_

* Injected into every page and iframe, allow you to modify the DOM of the pages containing them.
* The background page can be used to communicate between different content scripts, they are otherwise isolated.
* Content scripts are sandboxed in such a way that they cannot use variables and functions defined by other scripts on the page.

A Sane Paradigm
---------------

![Diagram of Design in Action](https://github.com/bcoe/DoloresLabsTechTalk/raw/master/images/extension-paradigm.png)

* Message queues are a great way of thinking about designing for a Chrome extension.
 * Content Scripts pass messages to the background page.
 * The background script makes requests to the server and returns messages to content scripts.

The Important Files in this Example
-----------------------------------

* _background.js_ the queue based background script for handling communication with the extension.
* _content.js_ injected into each page, displays the jQuery-UI popup for requesting an email address.
* _server.js_ a Node.js script for handling XHR requests and sending the image as an email.

Creating the Context Menu Item
------------------------------

```javascript
Background.prototype.createContextMenuItem = function() {
	var _this = this;
	
	chrome.contextMenus.create({
		type: 'normal',
		title: 'Mail Image',
		contexts: ['image'],
		onclick: function(info, tab) {
			_this.messages[tab.id].push({
				imageUrl: info.srcUrl
			});
		}
	});
};
```
The Queue-Based Paradigm
------------------------

_In the content script:_

```javascript
setInterval(function() {
	chrome.extension.sendRequest(request, function(response) {
		
		if (!response) return;
		
		if (typeof(response) == 'string') {
			alert(response);
		} else {
			imageUrl = response.imageUrl;
			$( "#dialog-form" ).dialog( "open" );
		}
	});
	
	request = {};
}, 200);
```

_In the background script:_

```javascript
// Returning data from queue.
if (typeof(_this.messages[sender.tab.id]) == 'undefined') _this.messages[sender.tab.id] = [];
	if (_this.messages[sender.tab.id].length > 0) {
		callback(_this.messages[sender.tab.id].pop());
	} else {
		callback(false);
	}
});
	
// Populating the queue from an XHR request.
Background.prototype.sendEmail = function(request, tab) {
	var _this = this;
	if (typeof(_this.messages[tab.id]) == 'undefined') _this.messages[tab.id] = [];
	
	$.ajax({
		type: 'get',
		url: 'http://localhost',
		data: {
			imageUrl: request.imageUrl,
			email: request.email
		},
		success: function(response) {
			if (response.success) {
				_this.messages[tab.id].push( _this.successMessage );
			} else {
				_this.messages[tab.id].push( _this.failureMessage );
			}
		},
		error: function() {
			_this.messages[tab.id].push( _this.failureMessage );
		}
	});
};
```

The Server
----------

The server, written in Node.js, handles downloading the image and emailing it.

```javascript
app.get('/', function(req, res){
	var imageUrl = req.param('imageUrl'),
		filename = ( imageUrl.match(/^.*\/([^/]*)$/)[1] ).match(/([^?&]*)/)[1];
	
	downloadImage(imageUrl, function(imageData) {
		sendMail(imageData, filename, req.param('email'), function(err, success) {
			res.contentType('application/json');
			if (err) {
				res.send({
					success: false
				});		
			} else {
				res.send({
					success: true
				});
			}
		});
	});
});
```

Conclusion
----------

If approached in a sane, methodical way Chrome Extension development can be a fun paradigm to work within. Building extensions is a great way to get more users for your SaaS offering.
