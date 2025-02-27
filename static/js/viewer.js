
async function LoadViewerContent(){
    // Get project file name
    var projectFile = sessionStorage.getItem("project_file");

    // Get json whole json project file
    var jsonToLoad = await ServerRequest("GET", null, "/json?" + new URLSearchParams({
        name: projectFile
    }));
	
	var htmlSrc = await GetRawLocal("../pages/viewer-element.html");

    // Display on screen
    for(let i = 0; i < jsonToLoad.content.length; i++){
        var jsonElement = jsonToLoad.content[i];
        var parent = document.getElementsByClassName("page-body")[0];

        var newElement = document.createElement("div"); // Create new project element

        newElement.innerHTML = htmlSrc;
        newElement.querySelector("#title").innerText = jsonElement.title;
        newElement.querySelector("#date").innerText =  "Date: " + jsonElement.date;
        newElement.querySelector("#description").innerText = jsonElement.description;
        newElement.querySelector("#engine").innerText = jsonElement.engine;

        var openSrc = jsonElement.opensrc ? "Yes" : "No";
        newElement.querySelector("#open_src").innerText = "Open Source: " + openSrc;

        // Add download links
        var downloadLinkPresent = jsonElement.download == "" ? false : true;
        var srcDownloadLinkPresent = jsonElement.srcdownload == "" ? false : true;

        if(downloadLinkPresent){
            newElement.querySelector("#download").setAttribute("href", jsonElement.download);
        }
        else{
            newElement.querySelector("#download").style.color = "gray";
            newElement.querySelector("#download").style.cursor = "default";
        }

        // Add src download links
        if(srcDownloadLinkPresent){
            newElement.querySelector("#download_src").setAttribute("href", jsonElement.srcdownload);
        }
        else{
            newElement.querySelector("#download_src").style.color = "gray";
            newElement.querySelector("#download_src").style.cursor = "default";
        }

        var to = Math.round(jsonElement.skill);
        var ratingParent = newElement.querySelector("#rating");
        for(let j = 0; j < to; j++){
            var ratingUnit = document.createElement("div");
            var className = (j == to - 1 && jsonElement.skill % 1 != 0) ? "rating-unit half" : "rating-unit";

            ratingUnit.className = className; // Add the new rating unit to parent container
            if(j == to - 1 && jsonElement.skill % 1 != 0){ // Brute force!
                ratingUnit.style = "background: linear-gradient(90deg, lime 50%, rgb(31, 31, 31) 50%);";
            }
            ratingParent.appendChild(ratingUnit);
        }

        parent.appendChild(newElement); // Add to page body
    }
}