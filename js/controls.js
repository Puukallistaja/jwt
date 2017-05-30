
var lastElement

$("article").on("click", function (event){
	lastElement = this;
	create(lastElement);
});

var pos;
var modalOpen = false;

var create = function(e) {
	//if div exists in dom, do nothing
	if ($("#target").length) {
		return
	}
	//to remember the front page scroll position.
	// needed when front page is scrollable.
	// pos = window.pageYOffset;

	//get coordinates of the clicked article	
	var coords = e.getBoundingClientRect();
	//calculate center point. popper starts animation from there
	var x = (coords.top + coords.bottom) / 2;
	var y = (coords.left + coords.right) / 2;

	//create popper and give attributes
	var popper = $('<div/>', {
			"id": 'target',
			"name": 'modal',
			"class": 'modal-seed',
			"tabindex": '0'
		})
			.appendTo("body")
			.css({"top": x+"px", "left": y+"px"})
			.focus()
			.addClass("modal");
			
	//push state into browser history
	if (history.state == null) {
		history.pushState(1, null, 'index.html');
	} else {
		history.replaceState(1, null, 'index.html');
	}
	
	modalOpen = true;

	//load html into modal window
	let address = e.id;
	$("#target").load("articles/" + address + ".html");
};

//close modal when ESC
document.addEventListener("keydown", function(event) {
    if (modalOpen === true && event.keyCode == 27) {
        history.back();
    }
});

//manage browser history
window.addEventListener('popstate', function (e) {
	if (modalOpen == true) {
		remove();
	} else if (lastElement !== undefined) {
		create(lastElement);
	} else {
		return;
	}

});

//animate modal window collapes and remove element from DOM
function remove(){
	let element = $("#target");
	element.removeClass("modal");
	element.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", 
		function(){
			element.remove();
			//update modal tracker
			modalOpen = false;
	});
};
