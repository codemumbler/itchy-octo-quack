describe('Grid Service tests', function() {
	beforeEach(module('mainApp'));

	var gridService;

	beforeEach(inject(function($injector) {
		gridService = $injector.get('gridService');
	}));

	describe('grid', function() {
		it('get grid size', function() {
			expect(gridService.getGridSize().length).toEqual(13);
		});

		it('has object - sun', function() {
			expect(gridService.hasObject(6,6)).toEqual('sun');
		});

		it('has object - planet', function() {
			expect(gridService.hasObject(4,10)).toEqual('planet player1');
		});

		it('has object - planet', function() {
			expect(gridService.hasObject(9,3)).toEqual('planet player2');
		});

		it('has object - nothing there', function() {
			expect(gridService.hasObject(0,0)).toEqual(undefined);
		});

		it('nearest object', function() {
			var objects = [ [0,0] ];
			expect(gridService.nearestObject(objects, [1, 1])).toEqual([0,0]);
		});

		it('nearest objects', function() {
			var objects = [ [0,0], [3,3] ];
			expect(gridService.nearestObject(objects, [2, 2])).toEqual([3,3]);
		});

		it('nearest object - equal distance', function() {
			var objects = [ [0,0], [2,2] ];
			expect(gridService.nearestObject(objects, [1, 1])).toEqual([0,0]);
		});
	});

	describe('moveTowards grid calculations', function(){
		function getShip(x,y){
			return $('.x-'+x+'.y-'+y+' .ship');
		}
		function getCell(x,y) {
			return $('.x-'+x+'.y-'+y);
		}
		beforeEach(function(){
			function createGridCell(x,y) {
				$(document.body).append('<div class="test-element"><div class="x-'+x+' y-'+y+'" data-x="'+x+'" data-y="'+y+'"><div class="ship player1" data-moves="3"/></div>');
			}
			createGridCell(1,1);
			createGridCell(5,5);
			createGridCell(5,1);
			createGridCell(1,5);
			createGridCell(4,9);
			createGridCell(0,0);
			createGridCell(4,4);
			createGridCell(9,4);
			createGridCell(4,10);
		});

		afterEach(function(){
			$('.test-element').remove();
		});

		it('partial distance along diagonal', function(){
			expect(gridService.moveTowards(getShip(1,1), getCell(5,5))).toEqual([4,4]);
		});

		it('partial move along single axis - x', function(){
			expect(gridService.moveTowards(getShip(1,1), getCell(5,1))).toEqual([4,1]);
		});

		it('partial move along single axis - y', function(){
			expect(gridService.moveTowards(getShip(1,1), getCell(1,5))).toEqual([1,4]);
		});

		it('partial move along awkward point', function(){
			expect(gridService.moveTowards(getShip(1,1), getCell(4,9))).toEqual([3,4]);
		});

		it('partial move backwards along awkward point', function(){
			expect(gridService.moveTowards(getShip(4,9), getCell(1,1))).toEqual([3,6]);
		});

		it('partial move backwards single axis - x', function(){
			expect(gridService.moveTowards(getShip(5,1), getCell(1,1))).toEqual([2,1]);
		});

		it('partial move backwards single axis - y', function(){
			expect(gridService.moveTowards(getShip(1,5), getCell(1,1))).toEqual([1,2]);
		});

		it('partial move backwards along diagonal', function(){
			expect(gridService.moveTowards(getShip(5,5), getCell(1,1))).toEqual([2,2]);
		});

		it('partial move based upon originating coordinates', function(){
			expect(gridService.moveTowards(getShip(0,0), getCell(4,4))).toEqual([3,3]);
		});

		it('partial move based upon originating coordinates', function(){
			expect(gridService.moveTowards(getShip(4,10), getCell(9,4))).toEqual([7,7]);
		});

		it('moves required less than remaining moves', function(){
			expect(gridService.moveTowards(getShip(0,0), getCell(1,1))).toEqual([1,1]);
		});
	});

	describe('coordinates', function(){
		beforeEach(function(){
			$(document.body).append('<div class="test-element"><div class="x-0 y-0" data-x="0" data-y="0"><div class="ship player1"/></div></div>');
		});

		afterEach(function(){
			$('.test-element').remove();
		});

		it('getCoordinates of grid', function(){
			expect(gridService.getCoordinates($('.x-0.y-0'))).toEqual([0,0]);
		});

		it('getCoordinates of ship', function(){
			expect(gridService.getCoordinates($('.ship'))).toEqual([0,0]);
		});

		it('getGrid at coordinate', function() {
			expect(gridService.getGrid(0, 0).hasClass('x-0 y-0')).toBe(true);
		});

		it('getGrid takes an array', function() {
			$(document.body).append('<div class="test-element"><div class="x-1 y-1" data-x="1" data-y="1"/></div>');
			expect(gridService.getGrid([1, 1]).hasClass('x-1 y-1')).toBe(true);
		});

		it('getGrid takes an array', function() {
			$(document.body).append('<div class="test-element"><div class="x-1 y-1" data-x="1" data-y="1"/></div>');
			$(document.body).append('<div class="test-element"><div class="x-1 y-2" data-x="1" data-y="2"/></div>');
			expect(gridService.getGrid([1, 1]).length).toBe(1);
		});
	});
});
