function upload(){
    var file = document.getElementById("data");

    var allTo = Array();
    var allFrom = Array();
    var clashes = Array();
    var error = false;

    var reader = new FileReader();
    // Reads and uploades first and only file that get's uploaded
    reader.readAsText(file.files[0]);

    // Runs once file has been loaded
    reader.onload = function() {
        // parses the JSON and uploaded and turns into a javascript object
        var uploaded = JSON.parse(reader.result);

        // Loops once for every meeting time within the object
        uploaded.MeetingTimes.forEach(function(item){
            // Checks to make sure that the dates entered are valid
            if(moment(item.from, "H:mm").isValid() == true && moment(item.to, "H:mm").isValid() == true){
                var from = moment(item.from, "H:mm");
                var to = moment(item.to, "H:mm");
                // Checks to make sure that the to time can't be before the from time
                if(to.isBefore(from)){
                    error = true
                }else{
                    // Adds to and from time to the end of an array
                    allFrom.push(from);
                    allTo.push(to);
                }
            }else{
                error = true
            }
        });

        // Loops through all times in array
        for(var i = 0; i < allTo.length; i++){
            // Loops through all times and compares to the current selected time
            for(var g = 0; g < allTo.length; g++){
                if(allTo[i].isBetween(allFrom[g], allTo[g]) || allFrom[i].isBetween(allFrom[g], allTo[g])){
                    // Checks to make sure that json data entered is not empty
                    if(formatTime(allTo[i]) != "00:00:00" && formatTime(allFrom[i]) != "00:00:00"){
                        // Check to stop duplicate times appearing in output
                        if(clashes.includes("Clash With " + formatTime(allFrom[g]) + " - " + formatTime(allTo[g]) + " and " + formatTime(allFrom[i]) + " - " + formatTime(allTo[i])) == false){
                            clashes.push("Clash With " + formatTime(allFrom[i]) + " - " + formatTime(allTo[i]) + " and " + formatTime(allFrom[g]) + " - " + formatTime(allTo[g]));
                        }
                    }
                }
            }
        }

        var output = document.getElementById("output");
        output.innerHTML = "";

        if(error == true){
            output.insertAdjacentHTML('beforeend', '<h4>Error With Time Formatting</h4>');
        }else if(clashes.length == 0){
            output.insertAdjacentHTML('beforeend', '<h4>No Meeting Room Clashes</h4>');
        }else{
            clashes.forEach(function(clash){
                output.insertAdjacentHTML('beforeend', '<h4>' + clash + '</h4>');
            });
        }
    };

    // Once the to and from times were added to the array they lost their formatting and became the total number of seconds since 1970. This function formatts them back into a time
    function formatTime(seconds){
        return formatted = moment("1900-01-01 00:00:00").add(seconds/1000, 'seconds').format("HH:mm:ss")
    }
}

/* Decision Choices

JSON - Javascript Object Notation
- More lightweight that XML files
- Parsed by javascript well into a javascript object

Moment JS  
- Only weighs 53 KB minified so doesn't effect page load time too much
- Contained built in methods to help compare time
- Much more flexible than javascript at creating and parsing date formats

*/