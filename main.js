var barWeight = 45;
var plateStringArray = ["45", "35", "25", "10", "5", "2.5"]

$('#calculate').click(function() {
    var enteredWeight = $('#weight').val();
    if (enteredWeight == "") {
        alert("Please enter a weight!");
    } else if (enteredWeight % 5 != 0) {
        alert("The weight you enter must be divisible by 5!")
    } else {
        $('#result').remove();
        var totalPlateWeight = enteredWeight - barWeight;
        renderOutput(outputList(getPlateResults(totalPlateWeight)));
    }
})

// returns an array of ints
var getPlateResults = function(remainingPlateWeight, index = 0, accumulatedArray = []) {
    if (remainingPlateWeight === 0) {
        return accumulatedArray;
    }
    var plateWeights = [90, 70, 50, 20, 10, 5];
    var currentPlateWeight = plateWeights[index];

    return getPlateResults (
        remainingPlateWeight % currentPlateWeight,
        index + 1,
        accumulatedArray.concat(parseInt(remainingPlateWeight/currentPlateWeight))
    );
}

var outputList = function(plateResults) {
    return plateResults.reduce(function(resultArray, plateNumber, index) {
        if (plateNumber > 0) {
            return resultArray.concat(plateStringArray[index] + "'s -- " + plateNumber.toString() + " on each side");
        } else {
            return resultArray.concat("");
        }
  }, []);
}

var renderOutput = function(outputList) {
    $("#main").append("<div id='result'></div>");
    $.each(outputList, function(index, value) {
        if (value != "") {
            var p = "<p>";
            $('#result').append(p.concat(value))
        }
    })
}
