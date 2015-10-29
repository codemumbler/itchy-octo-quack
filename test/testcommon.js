$.fn.modal = function(action){
	if (action == 'show') {
		$(this).css('display', 'block');
	} else {
		$(this).css('display', 'none');
	}
};

function addCell(x, y) {
	var testElement = $('.test-element');
	if (testElement.length == 0) {
		$(document.body).append('<div class="test-element"></div>');
		testElement = $('.test-element');
	}
	testElement.append('<div class="x-' + x + ' y-' + y + '" data-x="' + x + '" data-y="' + y + '"></div>');
	return $('.x-' + x + '.y-' + y);
}

function addObjectToCell(x, y, object, player, moves) {
	if ($('.x-' + x + '.y-' + y).length == 0)
		addCell(x,y);
	$('.x-' + x + '.y-' + y).append('<div class="' + object + ' player' + player + '"></div>"');
	if (object == 'ship')
		$('.x-' + x + '.y-' + y).find('.ship').data('moves', (moves ? moves : 3));
}
