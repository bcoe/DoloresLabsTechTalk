(function() {
	
	var imageUrl = '', 
		request = {};

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

	$(document).ready(function() {
		$('body').append('<div id="dialog-form" title="Enter Email"><p class="validateTips">Enter an email address to email this image to.</p><form><fieldset><label for="name">Name</label><input type="text" name="email" id="email" class="text ui-widget-content ui-corner-all" /></fieldset></form>');

		$( "#dialog-form" ).dialog({
			autoOpen: false,
			height: 200,
			width: 350,
			modal: false,
			buttons: {
				"Email Image": function() {
					request = {
						email: $('#email').val(),
						imageUrl: imageUrl
					};
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			close: function() {
				allFields.val( "" ).removeClass( "ui-state-error" );
			}
		});
	});
	
})();