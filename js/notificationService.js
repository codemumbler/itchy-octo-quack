mainApp.factory('notificationService', function() {
	var createModal = function(id, text) {
		if ($('#' + id).length == 1)
			return;
		var modalWrapper = $('<div id="' + id + '" class="notification modal fade"/>');
		var dialog = $('<div class="modal-dialog"/>');
		var content = $('<div class="modal-content"/>');
		var body = $('<div class="modal-body"/>');
		dialog.append(content);
		content.append(body);
		body.text(text);
		modalWrapper.append(dialog);
		$(document.body).append(modalWrapper);
	};
	createModal('shipDefeatModal', 'You lost your ship in the battle!');
	createModal('shipVictoryModal', 'Your ship won a battle!');
	createModal('defeatModal', 'You lost!');
	createModal('victoryModal', 'Congratulations you won!');
	createModal('endTurnModal', 'Waiting for other players...');

	return {
		endTurn: function() {
			$('#endTurnModal').modal('show');
			setTimeout(function() {
				$('#endTurnModal').modal('hide');
			}, 100);
		},
		victory: function() {
			$('#victoryModal').modal('show');
		},
		defeat: function() {
			$('#defeatModal').modal('show');
		},
		shipVictory: function() {
			$('#shipVictoryModal').modal('show');
		},
		shipDefeat: function() {
			$('#shipDefeatModal').modal('show');
		}
	};
});
