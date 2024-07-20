// Send fetch request
async function ServerRequest(mtd, body, route){
    const request = await fetch(route, {
        method: mtd,
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    });

    const response = await request.json();
    return response;
}

// Get requests with text content type
async function GetRaw(route){
    const request = await fetch(route, {
        method: "GET",
        headers: {
            "Content-Type": "text/plain"
        }
    });

    const response = await request.text();
    return response;
}


function SortPercentageMapKeys(map){
    var isSorted = false;
    var sortedKeys = [];
    for(let c = 0; c < map.size; c++){
        var key = Object.keys(map[c]);
        sortedKeys.push(key);
    }

    while(!isSorted){
        // Bubble sort
        for(let i = 0; i < sortedKeys.length; i++){
            if(i + 1 >= sortedKeys.length)
                break;
            else{
                if(map[sortedKeys[i]] < map[sortedKeys[i + 1]]){
                    var temp = sortedKeys[i + 1]; // Swap keys!
                    sortedKeys[i + 1] = sortedKeys[i];
                    sortedKeys[i] = temp;
                }
            }
        }

        // Check if sorted
        var sortedCount = 0;
        for(let n = 0; n < sortedKeys.length; n++){
            if(n + 1 >= sortedKeys.length)
                break;
            else{
                if(map[sortedKeys[n]] > map[sortedKeys[n + 1]])
                    sortedCount++;
            }
        }

        if(sortedCount == sortedKeys.length)
            isSorted = true;
    }
    return sortedKeys;
}