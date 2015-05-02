$(function () {
	"use strict";
	var startX,
		startY,
		captureActive,
		selectedBoxes = [],
		metaArray = [],
		activePosition,
		$selectionMarquee = $('#selectionMarquee'),
		$metaBox = $('#meta'),
		$metaBoxInput = $('#meta'),
		$allCords = $('#all-cords'),
		positionBox = function ($box, coordinates) {
			$box.css('top', coordinates.top).css('left', coordinates.left)
				.css('height', coordinates.bottom - coordinates.top)
				.css('width', coordinates.right - coordinates.left);
		},

		setBox = function ($box, coordinates) {
			$box.css('top', coordinates.bottom).css('left', coordinates.right);
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

			metaArray.forEach(function (meta) {
			    var box_left        = meta.position.left - $('#docImage').offset().left
			        , box_top       = meta.position.top - $('#docImage').offset().top
			        , box_right     = meta.position.right - $('#docImage').offset().left 
			        , box_bottom    = meta.position.bottom - $('#docImage').offset().top
		
				msg += '<li>['+ meta.value +'] (' + box_left + ', ' + box_top + ') - (' + (box_left + box_right) + ', ' + (box_top + box_bottom) + ')</li>';
			});
			$allCords.html(msg);
		},
		displayMetaBox = function (position){
			$metaBox.show()
			$metaBox.find('input').focus()
			setBox($metaBox, position);
		}
		, //display functions
		buildFillableForm = function() {
			var inputFields = ""
			metaArray.forEach(function (meta) {
				inputFields += '<div>' + meta.value + ' <input name="' + meta.id + '"/></div>'
			});
			return inputFields;
		};

	//capture events
	$('#doneCapture').on("click", function (event) {
		$('#capture').hide()
		$(".selected-box").hide()
		$('#display').show()
		$('#display').html(buildFillableForm())

	})

	$metaBox.find('input').on("blur", function(event) {
		var meta = {
			//name: this.name,
			id: "" + activePosition.top + activePosition.right + activePosition.bottom + activePosition.left,
			value: this.value,
			position: activePosition
		}
		metaArray.push(meta)	
		displayCoordinates();
		this.value = ""
		$metaBox.hide()
	})

	$('#docImage').on("mouseenter", function (event) {
		captureActive = true;
	})

	$('#docImage').on("mouseleave", function (event) {
		if($(event.relatedTarget).attr('id') == "capture" || $(event.toElement).attr('id') == "capture")
			captureActive = false;	
	})

	$(document).on('mousedown', function (event) {
		
		if(!captureActive)
			return
		startX = event.pageX
		startY = event.pageY
		positionBox($selectionMarquee, getBoxCoordinates(startX, startY, startX, startY));
		$selectionMarquee.show();
		$(this).on('mousemove', trackMouse);
	})

	$(document).on('mouseup', function (event) {
		if(!captureActive)
			return
		var position
		, $selectedBox
		, endX = event.pageX
		, endY = event.pageY

		$selectionMarquee.hide();

		activePosition = position = getBoxCoordinates(startX, startY, endX, endY);

		if (position.left !== position.right && position.top !== position.bottom) {
			$selectedBox = $('<div class="selected-box"></div>');
			$selectedBox.hide();
			$('body').append($selectedBox);

			positionBox($selectedBox, position);

			$selectedBox.show();
			selectedBoxes.push(position);
			
			displayMetaBox(position);
			$(this).off('mousemove', trackMouse);
		}
	});
});