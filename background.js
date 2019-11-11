
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.title == "showResponse"){
			from = request.from;
			to = request.to;
			selectionText = request.selText;
			HTMLRequest(from, to, selectionText, sendResponse);
		}
		return true;
	});

//HTML request

function HTMLRequest(from, to, selectionText, cFunction){	
	url = "https://angol-magyar-szotar.hu/_fordit.php"
	postData = "forditInput=" + selectionText + "&korra=0&from="+from+"&to="+to+"&version=4";
	
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			cFunction({innerHTML: this.responseText})
		}
    };
	
	xhttp.open("POST", url, true);
	
	//Headers
	xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhttp.setRequestHeader("Accept", "text/html, */*; q=0.01");
	
	xhttp.send(postData);
}