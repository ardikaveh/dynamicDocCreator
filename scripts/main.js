
$(function () {
	"use strict";
	var startX,
		startY,
		selectedBoxes = [],
		$selectionMarquee = $('#selectionMarquee'),
		$allCords = $('#all-cords'),
		positionBox = function ($box, coordinates) {
			$box.css(
				'top', coordinates.top
			).css(
				'left', coordinates.left
			).css(
				'height', coordinates.bottom - coordinates.top
			).css(
				'width', coordinates.right - coordinates.left
			);
		},

		compareNumbers = function (a, b) {
			return a - b;
		},
		getBoxCoordinates = function (startX, startY, endX, endY) {
			var x = [startX, endX].sort(compareNumbers),
				y = [startY, endY].sort(compareNumbers);

			return {
				top: y[0],
				left: x[0],
				right: x[1],
				bottom: y[1]
			};
		},
		trackMouse = function (event) {
			var position = getBoxCoordinates(startX, startY, event.pageX, event.pageY);
			console.log(position);
			positionBox($selectionMarquee, position);
		},
		displayCoordinates = function () {
			var msg = 'Boxes so far:\n';

			selectedBoxes.forEach(function (box) {
			    var box_left        = box.left - $('#docImage').offset().left
			        , box_top       = box.top - $('#docImage').offset().top
			        , box_right     = box.right - $('#docImage').offset().left 
			        , box_bottom    = box.bottom - $('#docImage').offset().top
		
				msg += '<li>(' + box_left + ', ' + box_top + ') - (' + (box_left + box_right) + ', ' + (box_top + box_bottom) + ')</li>';
			});
			$allCords.html(msg);
		};


	$(document).on('mousedown', function (event) {
		startX = event.pageX
		startY = event.pageY
		positionBox($selectionMarquee, getBoxCoordinates(startX, startY, startX, startY));
		$selectionMarquee.show();
		$(this).on('mousemove', trackMouse);
	}).on('mouseup', function (event) {
		var position
			, $selectedBox
            , endX = event.pageX
            , endY = event.pageY
            
			$selectionMarquee.hide();

			position = getBoxCoordinates(startX, startY, endX, endY);

			if (position.left !== position.right && position.top !== position.bottom) {
				$selectedBox = $('<div class="selected-box"></div>');
				$selectedBox.hide();
				$('body').append($selectedBox);

				positionBox($selectedBox, position);

				$selectedBox.show();

				selectedBoxes.push(position);
				displayCoordinates();
				$(this).off('mousemove', trackMouse);
			}
	});
});
