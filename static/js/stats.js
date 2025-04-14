const colors = new Map()
colors.set("C#", "#9842f5");
colors.set("C++", "#4281f5");
colors.set("Js", "#33ff55");
colors.set("HTML", "#ff5533");
colors.set("CSS", "#4281f5");
colors.set("VBS", "#33ffc5");
colors.set("jQuery", "#33aaff");
colors.set("SQL", "#005fa3");
colors.set("Batch", "#919191");
colors.set("Scratch", "#ffd500");
colors.set("Python", "#8c00ff");
colors.set("Objective C", "#000000");
colors.set("PHP", "#8892BF");

var languageElements = [];

async function Show(){
    // Cool effect
    $("#no_projects").animate({"opacity": 1}, 500);
    $("#no_lines").animate({"opacity": 1}, 700);
    $("#consistency").animate({"opacity": 1}, 1000);
    for(let i = 0; i < languageElements.length; i++){
        var time = 500 + (i * 200);
        $(languageElements[i]).animate({"opacity": 1}, time);
    }
}


async function LanguagePercentage(){
    // Get sum of all languages
    var languages = await ServerRequest("GET", null, "/get-languages");

    // Create linear gradient string
    var gradientString = "";
    var total = 0;
    var lastPercentage = 0;

    // Total up number of languages
    var values = Object.values(languages)
    for(let j = 0; j < values.length; j++){
        total += values[j]
    }
    
    // Get and save percentages
    const percentagesMap = new Map();
    var keys = Object.keys(languages);
    for(let i = 0; i < keys.length; i++){
        var percentage = (languages[keys[i]] / total) * 100;
        percentagesMap.set(keys[i], percentage);
    }

    //const sortedKeys = SortPercentageMapKeys(percentagesMap);
    const sortedArray = Array.from(percentagesMap).sort((a, b) => b[1] - a[1]);
    const sortedMap = new Map(sortedArray);
    const sortedKeys = sortedMap.keys();
	
	var legendHTML = await GetRaw("/pages?page=legend-template");
	
    var legendContainer = document.getElementById("legend");
    // Build gradient string
    for(let n = 0; n < sortedMap.size; n++){
        prefix = n == 0 ? ", " : "";

        var key = sortedKeys.next().value;
        var comma = n != sortedMap.size - 1 ? "," : ""; 
        var strPercent = (Math.round((sortedMap.get(key) + lastPercentage) * 100) / 100).toString();

        gradientString += prefix + colors.get(key) + " " + lastPercentage + "% " + strPercent + "% " + comma;
        lastPercentage += Math.round(sortedMap.get(key) * 100) / 100; // Update last percentage

        // Language legend
        var newLegend = document.createElement("div");
        newLegend.className = "legend";

        var percentage = (Math.round(sortedMap.get(key) * 100) / 100).toString() + "%";
        newLegend.innerHTML = legendHTML;
        newLegend.style.backgroundColor = colors.get(key);
        newLegend.querySelector("#legend_text").innerText = key + "\n" + percentage.toString();
        newLegend.title = percentage;
        newLegend.style.opacity = 0;

        legendContainer.appendChild(newLegend);
        languageElements.push(newLegend);
    }

    var background = "linear-gradient(to right" + gradientString + ")";
    document.getElementById("consistency").style.background = background;

    // Set lines of code and no. of projects
    var projectCount = await ServerRequest("GET", null, "/get-project-count");

    document.getElementById("no_projects").innerText += " " + projectCount.project_count;
    document.getElementById("no_lines").innerText += " " + projectCount.line_count;

    Show();
}