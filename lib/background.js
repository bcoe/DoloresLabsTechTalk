function Background() {
	this.messages = {};
	this.createContextMenuItem();
}

Background.prototype.createContextMenuItem = function() {
	var _this = this;
	
	chrome.contextMenus.create({
		type: 'normal',
		title: 'Mail Image',
		contexts: ['image'],
		onclick: function(info, tab) {
			_this.imageClicked(info);
		}
	});
};

Background.prototype.imageClicked = function(info) {
	$.ajax({
		type: 'get',
		url: 'http://localhost',
		data: {imageUrl: info.srcUrl},
		success: function() {
			console.log('success');
		}
	});
};