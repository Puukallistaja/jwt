
var lastElement
// function addListeners () 
// {	
// 	//this var has an array of all the articles
// 	var selectedArticle = document.getElementsByTagName("article");
// 	// we loop through the cards and add eventlisteners
// 	for (var i = 0; i < selectedArticle.length; i++) 
// 	{
// 		selectedArticle[i].addEventListener("click", function(){
// 			lastElement = this;
// 			create(lastElement);
// 		}, false);
// 	}
// }	
// addListeners()

$("article").on("click", function (event){
	lastElement = this;
	create(lastElement);
});

var pos;
var modalOpen = false;

var create = function(e) {
	if (document.getElementById("target") !== null) {
		return
	}
	//to remember the front page scroll position.
	// needed when front page is scrollable.
	// pos = window.pageYOffset;

	//get coordinates of the clicked article
	//calculate center point. popper starts animation from there
	var coords = e.getBoundingClientRect();
	var x = (coords.top + coords.bottom) / 2;
	var y = (coords.left + coords.right) / 2;

	//create popper and give attributes
	var popper = document.createElement("div");
	popper.id = "target";
	popper.style.top = x+"px";
	popper.style.left = y+"px";
	popper.setAttribute("class", "modal-seed");
	//append popper in the center of the clicked article
	document.body.appendChild(popper).focus();
	

	//give another class to popper, so it would animate on creation
	popper.className += " modal";
	if (history.state == null) {
		history.pushState(1, null, 'index.html');
	} else {
		history.replaceState(1, null, 'index.html');
	}
	
	modalOpen = true;

	//invoke html loading function
	let address = e.id;
	// load(document.getElementById("target"), "articles/" + address + ".html");
	$("#target").load("articles/" + address + ".html");
};


// function load(target, url) {
// 	var r = new XMLHttpRequest();
// 	r.open("GET", url, true);
// 	r.onreadystatechange = function () {
// 		if (r.readyState !== 4 || r.status !== 200) return;
// 		target.innerHTML = r.responseText;
// 	};
// 	r.send();
// };



document.addEventListener("keydown", function(event) {
    if (modalOpen === true && event.keyCode == 27) {
        history.back();
    }
});

var hash = location.hash;
window.addEventListener('popstate', function (e) {
	if (modalOpen == true) {
		remove();
	} else if (lastElement !== undefined) {
		create(lastElement);
	} else {
		return;
	}

});

function remove(){
	let element = document.getElementById("target");
	element.classList.remove("modal");
	element.addEventListener("transitionend", function(event) {
		element.parentNode.removeChild(element);
		modalOpen = false;
	});
};
