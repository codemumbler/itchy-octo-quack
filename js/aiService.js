mainApp.factory('aiService', ['playerModel', 'gridService', function (playerModel, gridService) {
  return {
    executeTurn: function (aiPlayer) {
      if (aiPlayer.resources >= 10)
        playerModel.queueShip();
      var service = this;
      $('.ship.player2').each(function (index, ship) {
        var enemyShipCoordinates = service.selectClosestEnemyObject(gridService.getCoordinates($(ship)));
        playerModel.moveShip($(ship), gridService.getGridCell(enemyShipCoordinates));
      });
    },
    getEnemyObjects: function () {
      var objects = [];
      $('.player1').each(function (index, element) {
        objects.push(gridService.getCoordinates($(element)));
      });
      return objects;
    },
    selectClosestEnemyObject: function (originatingCoordinates) {
      return gridService.nearestObject(this.getEnemyObjects(), originatingCoordinates);
    }
  };
}]);
