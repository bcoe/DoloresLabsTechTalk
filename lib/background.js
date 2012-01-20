function Background() {
	var _this = this;
	
	this.messages = {};
	this.createContextMenuItem();
	this.successMessage = 'Image successfully emailed!';
	this.failureMessage = 'Image failed to send :(';
	
	chrome.extension.onRequest.addListener(function(request, sender, callback) {
		if (typeof(_this.messages[sender.tab.id]) == 'undefined') _this.messages[sender.tab.id] = [];
		
		if (request.email) {
			console.log(request);

			_this.sendEmail(request, sender.tab);
		}

		if (_this.messages[sender.tab.id].length > 0) {
			callback(_this.messages[sender.tab.id].pop());
		} else {
			callback(false);
		}
	});
}

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