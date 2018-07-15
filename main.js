$('#weight').keyup(function() {
    const barWeight = 45;
    const enteredWeight = $('#weight').val();
    d3.select('#barbell').selectAll("*").remove();
    if (enteredWeight === '') {
        $('#errorText').text("Please enter a weight");
    } else if (enteredWeight % 5 != 0) {
        $('#errorText').text("The weight you enter must be divisible by 5!");
    } else if (enteredWeight > 900) {
        $('#errorText').text("Woah don't hurt yourself!  The entered weight cannot exceed 900 pounds");
    } else {
        $('#errorText').text("");
        $('#result').remove();
        const totalPlateWeight = enteredWeight - barWeight;
        renderBarbellWithWeights(getPlateResults(totalPlateWeight));
    }
})

// returns an array of ints
const getPlateResults = function(remainingPlateWeight, index = 0, accumulatedArray = []) {
    if (remainingPlateWeight === 0) {
        return accumulatedArray;
    }
    const plateWeights = [90, 70, 50, 20, 10, 5];
    const currentPlateWeight = plateWeights[index];

    return getPlateResults (
        remainingPlateWeight % currentPlateWeight,
        index + 1,
        accumulatedArray.concat(parseInt(remainingPlateWeight/currentPlateWeight))
    );
}

const renderBarbellWithWeights = function(plateResults) {
    const svgWidth = parseFloat(d3.select('#barbell').style('width'));
    const svgHeight = parseFloat(d3.select('#barbell').style('height'));
    const barWidth = 300;
    const barHeight = 10;
    const barX = parseInt((svgWidth - barWidth) / 2);
    const barY = parseInt(svgHeight / 2) - parseInt(barHeight / 2);

    renderBar(barX, barY, barWidth, barHeight);

    const plateWidth = 25;
    const initialLeftPlateX = barX - (plateWidth + 5);
    const initialRightPlateX = barX + barWidth + 5;
    const initialPlateY = 0;
    const initialPlateHeight = svgHeight;


    const initialLeftPlateTextX = initialLeftPlateX + 3;
    const initialRightPlateTextX = initialRightPlateX + 3;
    const plateTextY = parseInt(svgHeight / 2) + 5;

    const plateStringArray = ["45", "35", "25", "10", "5", "2.5"]
    var numberOfPlates = 0;

    $.each(plateResults, function(index, value) {
        for (i = 0; i < value; i++) {
            let leftPlateX = initialLeftPlateX - (numberOfPlates * 30);
            let rightPlateX = initialRightPlateX + (numberOfPlates * 30);

            const textIsSingleDigit = plateStringArray[index] === "5";
            const textHasDecimal = plateStringArray[index] === "2.5";

            const extraPaddingIfNeeded = textIsSingleDigit ? 5 : 0;
            const negativePaddingIfNeeded = textHasDecimal ? -2 : 0;

            let leftPlateTextX = initialLeftPlateTextX - (numberOfPlates * 30) +    extraPaddingIfNeeded + negativePaddingIfNeeded;
            let rightPlateTextX = initialRightPlateTextX + (numberOfPlates * 30) +  extraPaddingIfNeeded + negativePaddingIfNeeded;

            let plateY = initialPlateY + (index * 6);
            let plateHeight = initialPlateHeight - (index * 12);

            let plateText = plateStringArray[index];

            d3.select('#barbell')
                .append("rect")
                .attr("x", leftPlateX)
                .attr("y", plateY)
                .attr("width", plateWidth)
                .attr("height", plateHeight)
            d3.select('#barbell')
                .append("text")
                .attr("x", leftPlateTextX)
                .attr("y", plateTextY)
                .text(plateText)

            d3.select('#barbell')
                .append("rect")
                .attr("x", rightPlateX)
                .attr("y", plateY)
                .attr("width", plateWidth)
                .attr("height", plateHeight)
            d3.select('#barbell')
                .append("text")
                .attr("x", rightPlateTextX)
                .attr("y", plateTextY)
                .text(plateText)

            numberOfPlates++;
        }
    });

    let barEndWidth = Math.max(80 - (numberOfPlates * 30), 10);
    let leftBarEndX = initialLeftPlateX - (numberOfPlates * 30) - (barEndWidth - 25);
    let rightBarEndX = initialRightPlateX + (numberOfPlates * 30);
    renderBarEnds(leftBarEndX, rightBarEndX, barY, barEndWidth, barHeight);
}

const renderBar = function(barX, barY, barWidth, barHeight) {
    d3.select('#barbell')
        .append("rect")
        .attr("x", barX)
        .attr("y", barY)
        .attr("width", barWidth)
        .attr("height", barHeight)
}

const renderBarEnds = function(leftBarEndX, rightBarEndX, barEndY, barEndWidth, barEndHeight) {
    d3.select('#barbell')
        .append("rect")
        .attr("x", leftBarEndX)
        .attr("y", barEndY)
        .attr("width", barEndWidth)
        .attr("height", barEndHeight)

    d3.select('#barbell')
        .append("rect")
        .attr("x", rightBarEndX)
        .attr("y", barEndY)
        .attr("width", barEndWidth)
        .attr("height", barEndHeight)
}
