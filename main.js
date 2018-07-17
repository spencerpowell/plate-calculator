$('#weight').keyup(function() {
    const barWeight = 45;
    const enteredWeight = $('#weight').val();
    d3.select('#barbell').selectAll("*").remove();

    if (enteredWeight === '') {
        $('#errorText').text("Please enter a weight");
    } else if (enteredWeight % 5 != 0) {
        $('#errorText').text("The weight you enter must be divisible by 5!");
    } else if (enteredWeight > 500) {
        $('#errorText').text("Woah don't hurt yourself!  The entered weight cannot exceed 500 pounds");
    } else if (enteredWeight < 45) {
        $('#errorText').text("The weight you enter must be at least 45 pounds!");
    } else {
        $('#errorText').text("");

        const totalPlateWeight = enteredWeight - barWeight;
        renderBarAndPlates(getPlateResults(totalPlateWeight));
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

const renderBarAndPlates = function(plateResults) {
    const svgWidth = parseFloat(d3.select('#barbell').style('width'));
    const svgHeight = parseFloat(d3.select('#barbell').style('height'));
    const barWidth = parseInt(svgWidth / 3);
    const barHeight = parseInt(svgHeight / 9);
    const barX = parseInt((svgWidth - barWidth) / 2);
    const barY = parseInt(svgHeight / 2) - parseInt(barHeight / 2);

    renderBar(barX, barY, barWidth, barHeight);

    const plateWidth = parseInt(svgWidth / 22);
    const plateSpacing = parseInt(plateWidth / 5);
    const plateHeightDecrement = parseInt(svgHeight / 7);
    const initialLeftPlateX = barX - (plateWidth + plateSpacing);
    const initialRightPlateX = barX + barWidth + plateSpacing;
    const initialPlateY = 0;
    const initialPlateHeight = svgHeight;
    const verticalTextSpacing = 10;
    const horizontalTextSpacing = parseInt(plateWidth / 9);

    const initialLeftPlateTextX = initialLeftPlateX + horizontalTextSpacing;
    const initialRightPlateTextX = initialRightPlateX + horizontalTextSpacing;
    const plateTextY = parseInt(svgHeight / 2) + verticalTextSpacing;

    const plateStringArray = ["45", "35", "25", "10", "5", "2.5"]
    var numberOfPlates = 0;

    $.each(plateResults, function(index, value) {
        for (i = 0; i < value; i++) {
            const leftPlateX = initialLeftPlateX - (numberOfPlates * (plateWidth + plateSpacing));
            const rightPlateX = initialRightPlateX + (numberOfPlates * (plateWidth + plateSpacing));

            const textIsSingleDigit = plateStringArray[index] === "5";
            const textHasDecimal = plateStringArray[index] === "2.5";

            const extraPaddingIfNeeded = textIsSingleDigit ? (parseInt(plateWidth / 5))
                    : 0;
            const negativePaddingIfNeeded = textHasDecimal ? - (parseInt(plateWidth / 11))
                    : 0;

            const leftPlateTextX = initialLeftPlateTextX - (numberOfPlates * (plateWidth + plateSpacing)) + extraPaddingIfNeeded + negativePaddingIfNeeded;
            const rightPlateTextX = initialRightPlateTextX + (numberOfPlates * (plateWidth + plateSpacing)) + extraPaddingIfNeeded + negativePaddingIfNeeded;

            const plateY = initialPlateY + (index * parseInt(plateHeightDecrement / 2));
            const plateHeight = initialPlateHeight - (index * plateHeightDecrement);

            const plateText = plateStringArray[index];
            const fontSize = parseInt(plateWidth / 1.5);

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
                .style("font-size", fontSize)

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
                .style("font-size", fontSize)

            numberOfPlates++;
        }
    });

    const minBarEndWidth = 25;
    const barEndWidth = Math.max((plateWidth * 4) - (numberOfPlates * (plateWidth + plateSpacing)), minBarEndWidth);
    const leftBarEndX = initialLeftPlateX - (numberOfPlates * (plateWidth + plateSpacing)) - (barEndWidth - plateWidth);
    const rightBarEndX = initialRightPlateX + (numberOfPlates * (plateWidth + plateSpacing));
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
