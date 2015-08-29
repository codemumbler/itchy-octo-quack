describe('MainAppController', function() {
	beforeEach(module('mainApp'));

	var $controller, controller;

	beforeEach(inject(function(_$controller_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
		controller = $controller('MainAppController', {});

		$(document.body).append('<div class="test-element"><div class="x-0 y-0" data-x="0" data-y="0"/></div>');
	}));

	afterEach(function(){
		$('.test-element').remove();
	});

	describe('$controller.endTurn', function() {
		it('ending turn adds resources', function() {
			controller.endTurn();
			expect(controller.resources).toEqual(7);
		});

		it('ending turn increments turn counter', function() {
			controller.endTurn();
			expect(controller.turn).toEqual(2);
		});

		it('end turn does not change work queue if empty', function() {
			controller.workQueue = 0;
			controller.endTurn();
			expect(controller.workQueue).toEqual(0);
		});
	});

	describe('$controller.queueShip', function() {
		beforeEach(function() {
			$('.x-0.y-0').addClass('planet player1');
			controller.select(0,0);
			controller.resources = 10;
		});

		it('requesting ship queues one ship to be built', function() {
			controller.select(0,0);
			expect(controller.workQueue).toEqual(1);
		});

		it('requesting ship built costs 10 resources', function() {
			controller.select(0,0);
			expect(controller.resources).toEqual(0);
		});

		it('requested ship build after turn', function() {
			controller.select(0,0);
			controller.endTurn();
			expect(controller.workQueue).toEqual(0);
		});

		it('planet grid must be selected before queueing ship', function() {
			controller.select(1,1);
			controller.select(0,0);
			expect(controller.workQueue).toEqual(0);
		});
	});

	describe('$controller.grid', function() {
		it('get grid size', function() {
			expect(controller.getGridSize().length).toEqual(13);
		});

		it('has object - sun', function() {
			expect(controller.hasObject(6,6)).toEqual('sun');
		});

		it('has object - planet', function() {
			expect(controller.hasObject(4,10)).toEqual('planet player1');
		});

		it('has object - planet', function() {
			expect(controller.hasObject(9,3)).toEqual('planet player2');
		});

		it('has object - nothing there', function() {
			expect(controller.hasObject(0,0)).toEqual(undefined);
		});

		it('selecting saves selected grid', function(){
			controller.select(0,0);
			expect(controller.selected.attr('class')).toEqual('x-0 y-0');
		});

		it('selecting adds highlighting parent cell', function(){
			controller.select(0,0);
			expect(controller.selected.parent().attr('class')).toEqual('test-element selected');
		});

		it('selecting another removes highlighting', function(){
			controller.select(0,0);
			var savedSelected = controller.selected;
			controller.select(1,1);
			expect(savedSelected.parent().attr('class')).toEqual('test-element');
		});
	});

	describe('ship movement', function(){
		var buildShip = function() {
			controller.resources = 10;
			$('.x-0.y-0').addClass('planet player1');
			controller.select(0,0);
			controller.select(0,0);
			controller.endTurn();
		};

		it('select ship to move', function(){
			buildShip();
			controller.select(0,0);
			expect(controller.prevSelected.hasClass('ship selected')).toBe(true);
		});

		it('select grid to move ship', function(){
			$('.test-element').append('<div class="x-1 y-0" data-x="1" data-y="0"/>');
			buildShip();
			controller.select(1,0);
			controller.select(0,0);
			expect($('.x-0.y-0').find('.ship').length).toEqual(1);
		});

		it('selects planet under ship', function(){
			buildShip();
			controller.select(0,0);
			controller.select(0,0);
			expect(controller.prevSelected.hasClass('planet')).toBe(true);
		});

		it('can queue ship when ship on planet', function(){
			buildShip();
			controller.resources = 10;
			controller.select(0,0);
			controller.select(0,0);
			controller.select(0,0);
			expect(controller.workQueue).toBe(1);
		});

		it('can move 3 spaces per turn', function() {
			buildShip();
			expect($('.ship').data('moves')).toEqual(3);
		});

		it('moves 3 spaces has 0 left', function() {
			$('.test-element').append('<div class="x-3 y-0" data-x="3" data-y="0"/>');
			buildShip();
			controller.select(0,0);
			controller.select(3,0);
			expect($('.ship').data('moves')).toEqual(0);
		});

		it('moves 4 spaces has 3 left and hasn\'t moved', function() {
			$('.test-element').append('<div class="x-3 y-0" data-x="3" data-y="0"/>');
			$('.test-element').append('<div class="x-4 y-0" data-x="4" data-y="0"/>');
			buildShip();
			controller.select(0,0);
			controller.select(4,0);
			expect($('.ship').data('moves')).toEqual(3);
		});
	});
});
