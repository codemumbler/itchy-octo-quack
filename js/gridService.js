mainApp.factory('gridService', function(){

	var rawDistance = function(x1, y1, x2, y2) {
		var dx = Math.abs(x2 - x1);
		var dy = Math.abs(y2 - y1);

		var min = Math.min(dx, dy);
		var max = Math.max(dx, dy);

		var diagonalSteps = min;
		var straightSteps = max - min;

		return diagonalSteps + straightSteps;
	}

	return {
		distance: function($ship, $destination) {
			var coordinates1 = this.getCoordinates($ship);
			var coordinates2 = this.getCoordinates($destination);
			var x1 = coordinates1[0];
			var x2 = coordinates2[0];
			var y1 = coordinates1[1];
			var y2 = coordinates2[1];

			return rawDistance(x1, y1, x2, y2);
		},
		getGridSize: function() {
			var array = [];
			for (var i = 0; i < 13; i++)
				array.push(i);
			return array;
		},
		hasObject: function(x,y) {
			if (x==6 && y==6)
				return 'sun';
			if (x==9 && y==3)
				return 'planet player2';
			if (x==4 && y==10)
				return 'planet player1';
		},
		nearestObject: function(objects, originatingCoordinates) {
			var minDistance = 100;
			var index = -1;
			var objectsLength = objects.length;
			for (var i = 0; i < objectsLength; i++) {
				var objDistance = rawDistance(objects[i][0], objects[i][1], originatingCoordinates[0], originatingCoordinates[1]);
				if (objDistance < minDistance) {
					index = i;
					minDistance = objDistance;
				}
			}
			return objects[index];
		},
		moveTowards: function($ship, $destination) {
			var coordinates1 = this.getCoordinates($ship);
			var coordinates2 = this.getCoordinates($destination);
			var x1 = coordinates1[0];
			var x2 = coordinates2[0];
			var y1 = coordinates1[1];
			var y2 = coordinates2[1];

			var distance = this.distance($ship, $destination);
			var moves = Math.min(distance, $ship.data('moves'));
			var movePoint = [];
			if (x1 > x2) {
				var tempMoves = distance - moves;
				movePoint.push(Math.ceil(Math.abs(x2 - x1) * (tempMoves/distance)) + x2);
			} else {
				movePoint.push(Math.ceil(Math.abs(x2 - x1) * (moves/distance)) + x1);
			}
			if (y1 > y2) {
				var tempMoves = distance - moves;
				movePoint.push(Math.ceil(Math.abs(y2 - y1) * (tempMoves/distance)) + y2);
			} else {
				movePoint.push(Math.ceil(Math.abs(y2 - y1) * (moves/distance)) + y1);
			}
			return movePoint;
		},
		getCoordinates: function($object) {
			if ($object.hasClass('ship') || $object.hasClass('planet')) {
				$object = $object.parent();
			}
			var coordinates = [];
			coordinates.push($object.data('x'));
			coordinates.push($object.data('y'));
			return coordinates;
		},
		getGridCell: function(x, y) {
			if (x instanceof Array)
				return $('.x-' + x[0] + '.y-' + x[1]);
			return $('.x-' + x + '.y-' + y);
		}
	};
});
