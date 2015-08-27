describe('MainAppController', function() {
	beforeEach(module('mainApp'));

	var $controller, controller;

	beforeEach(inject(function(_$controller_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
		controller = $controller('MainAppController', {});
	}));

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
		it('requesting ship queues one ship to be built', function() {
			controller.resources = 10;
			controller.queueShip();
			expect(controller.workQueue).toEqual(1);
		});

		it('requesting ship built costs 10 resources', function() {
			controller.resources = 10;
			controller.queueShip();
			expect(controller.resources).toEqual(0);
		});

		it('requested ship build after turn', function() {
			controller.resources = 10;
			controller.queueShip();
			controller.endTurn();
			expect(controller.workQueue).toEqual(0);
		});
	});

	describe('$controller.grid', function() {
		beforeEach(function(){
			$(document.body).append("<div class='test-element'><div class='x-0 y-0'/></div>");
		});

		afterEach(function(){
			$('.test-element').remove();
		});

		it('get grid size', function() {
			expect(controller.getGridSize().length).toEqual(13);
		});

		it('has object - sun', function() {
			expect(controller.hasObject(6,6)).toEqual('sun');
		});

		it('has object - planet', function() {
			expect(controller.hasObject(9,3)).toEqual('planet');
		});

		it('has object - nothing there', function() {
			expect(controller.hasObject(0,0)).toEqual(undefined);
		});

		it('selecting saves selected grid', function(){
			controller.select(0,0);
			expect(controller.selected.attr('class')).toEqual("x-0 y-0");
		});

		it('selecting adds highlighting parent cell', function(){
			controller.select(0,0);
			expect(controller.selected.parent().attr('class')).toEqual("test-element selected");
		});

		it('selecting another removes highlighting', function(){
			controller.select(0,0);
			var savedSelected = controller.selected;
			controller.select(1,1);
			expect(savedSelected.parent().attr('class')).toEqual("test-element");
		});
	});
});
