describe('Notification Service tests', function() {
	beforeEach(module('mainApp'));

	var notificationService;

	beforeEach(inject(function($injector) {
		notificationService = $injector.get('notificationService');
		$('.notification').css('display', 'block');
	}));

	afterEach(function(){
		$('.notification').css('display', 'none');
	});

	describe('notifications', function() {
		it('defeat modal', function() {
			notificationService.defeat();
			expect($('#defeatModal').is(':visible')).toBe(true);
		});
	});
});
