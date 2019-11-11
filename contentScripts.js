//based on: https://github.com/mubaidr/selection-popup


// class for styling
const className = '__selection-popup-container__'
const className2 = '__szotar-ablak__'
let selectionText = ''
let options = null
let popupTimeout = null

// check if popup should be displayed or skipped
function isPopupRequired() {
  return (
    !!selectionText
  )
}


// show popup at selection position
function showPopup(position) {
  const popup = document.getElementsByClassName(className)[0]

  popup.style.left = position.left
  popup.style.top = position.top
  popup.style.display = 'block'
}

// hide popup
function hidePopup() {
  Array.from(document.getElementsByClassName(className)).forEach(elem => {
     //eslint-disable-next-line
    elem.style.display = 'none'
  })
}

// Hanlde mouse popup
function handleMouseUp(e) {
	
	hidePopup()
	

	const { action } = e.target.dataset
	if (action || (selectionText === window
		.getSelection()
		.toString()
		.trim())) return
	
	window.clearTimeout(popupTimeout)
	
	popupTimeout = window.setTimeout(() => {
	selectionText = window
		.getSelection()
		.toString()
		.trim()
	
	if (isPopupRequired()) {
		showPopup({
		left: `${e.pageX}px`,
		top: `${e.pageY + 14}px`,
		})
	}
	}, 200)
  }

function closeDivHandler(e) {
	document.getElementById("__to_remove__").remove();
}


// handle click on menu item
function clickHandler(e) {
  hidePopup()
  const data = e.target.dataset
  
  getInnerHTML(data, addVocabPopup)
}

// add popup to the page, we will only toggle display and postion later
function addPopup() {
	
	const container = document.createElement('div')
	const listContainer = document.createElement('ul')  
	const li1 = document.createElement('li')
	const li2 = document.createElement('li')
	
	container.id = "__to_remove2__"
	listContainer.id = "__to_remove2__"
	li1.id = "__to_remove2__"
	li2.id = "__to_remove2__"
	
	li1.innerText = "Szótár (EN > HU)"
	li2.innerText = "Szótár (HU > EN)"
	
	// add data to item data attributes
	li1.setAttribute('data-from', 'en')
	li1.setAttribute('data-to', 'hu')
	li2.setAttribute('data-from', 'hu')
	li2.setAttribute('data-to', 'en')
	li1.onclick = clickHandler
	li2.onclick = clickHandler
	listContainer.appendChild(li1)
	listContainer.appendChild(li2)
	
	container.className = className
	container.style.display = 'none'
	container.appendChild(listContainer)
	document.body.appendChild(container)
}

function getInnerHTML(data, cFunction) {
	
	chrome.runtime.sendMessage({title: "showResponse", from: data['from'], to: data['to'], selText: selectionText}, addVocabPopup);
}

function addVocabPopup(response){
	inner = response.innerHTML;
	const container = document.createElement('div')
	const closeDiv = document.createElement('div')
	const contentDiv = document.createElement('div')
	const pre = "<div class=\"__container\" style=\"height: auto !important;\"> <div class=\"__contentContainer\" style=\"height: auto !important; min-height: 0px !important;\"><div id=\"ford_doboz\">";
	const end = "</div></div>";
	
	contentDiv.innerHTML = pre + inner + end
	
	container.className = "__container__"
	closeDiv.className = "__close__"
	contentDiv.className = "__szotar-div__"
	
	//TODO: nem szép dolog egy ID több dolognak
	container.id = "__to_remove__"
	closeDiv.id = "__to_remove__"
	contentDiv.id = "__to_remove__"
	closeDiv.onclick = closeDivHandler
	closeDiv.innerHTML = '<label>Bezár</label><br><a href="https://angol-magyar-szotar.hu" target="_blank" title="angol magyar szótár">Angol-Magyar-szotar.hu</a>'
	
	container.appendChild(closeDiv)
	container.appendChild(contentDiv)
	document.body.appendChild(container)
}



// add mouseup event to check selection to document
function setup() {
 
  addPopup()
  // add text selection event
  document.onmouseup = handleMouseUp
	
  // Hide on escape
  
  window.onkeydown = e => {
      hidePopup()
  }
}

// prepare popup and add event handlers
setup()
