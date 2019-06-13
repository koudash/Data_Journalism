// Retrieve data from .csv file and plot the chart
d3.csv('../static/db/data.csv').then((acsData) => {
    
    // .......... Data processing .......... //
    acsData.forEach((d) => {
        d.poverty = parseFloat(d.poverty);
        d.povertyMoe = parseFloat(d.povertyMoe);
        d.age = parseFloat(d.age);
        d.ageMoe = parseFloat(d.ageMoe);        
        d.income = parseFloat(d.income);
        d.incomeMoe = parseFloat(d.incomeMoe);
        d.healthcare = parseFloat(d.healthcare);
        d.healthcareLow = parseFloat(d.healthcareLow);
        d.healthcareHigh = parseFloat(d.healthcareHigh);
        d.obesity = parseFloat(d.obesity);
        d.obesityLow = parseFloat(d.obesityLow);
        d.obesityHigh = parseFloat(d.obesityHigh);
        d.smokes = parseFloat(d.smokes);
        d.smokesLow = parseFloat(d.smokesLow);
        d.smokesHigh = parseFloat(d.smokesHigh);                               
    });

    // .......... Variables .......... //
    // Arrays with x- and y-axis titles and tool tip info
    let xArr = [
        {"xAxisVal": "poverty",
        "xAxisTitle": "In Poverty (%)",
        "xAxisToolTip": "Poverty:",
        "xColor": "66ff66"},
        {"xAxisVal": "age",
        "xAxisTitle": "Age (Median)",
        "xAxisToolTip": "Age:",
        "xColor": "80dfff"},             
        {"xAxisVal": "income",
        "xAxisTitle": "Household Income (Median)",
        "xAxisToolTip": "MHI:",
        "xColor": "669999"}
    ];

    let yArr = [
        {"yAxisVal": "healthcare",
        "yAxisTitle": "Lacks Healthcare (%)",
        "yAxisToolTip": "No Healthcare:",
        "yColor": "ff3385"},
        {"yAxisVal": "smokes",
        "yAxisTitle": "Smokes (%)",
        "yAxisToolTip": "Smokers:",
        "yColor": "ff9933"},             
        {"yAxisVal": "obesity",
        "yAxisTitle": "Obese (%)",
        "yAxisToolTip": "Obesity:",
        "yColor": "ff1a1a"}
    ];

    // Initial Params
    let xSelVal = xArr[0].xAxisVal,
        ySelVal = yArr[2].yAxisVal;
    let xColor = "",
        yColor = "";

    // .......... Chart Dimensions .......... //
    // Set up width and height of 'svg' element
    let svgWidth = 700,
        svgHeight = 560;

    // Set up margin of the chart 
    let margin = {
        top: 20,
        right: 40,
        bottom: 100,
        left: 120
    };

    // Determine width and height of chart
    let chartWidth = svgWidth - margin.left - margin.right,
        chartHeight = svgHeight - margin.top - margin.bottom;

    // .......... Chart Elements .......... //
    // Create an SVG Wrapper, append an SVG group that will hold the chart, and shift the latter by left and top margins
    let svg = d3.select("#scatter")
        .append('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("class", "mb-4");

    let chartGroup = svg.append('g')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ELEMENTS - "circle"
    let circlesGroup = chartGroup.selectAll('circle')
        .data(acsData)
        .enter()
        .append('circle')
        .attr("class", "stateCircle");

    // ELEMENTS - "text" for circles
    let circleTextsGroup = chartGroup.selectAll(".stateText")
        .data(acsData)
        .enter()
        .append("text")
        .attr("class", "stateText");

    // ELEMENT - "g" for axes
    let xAxis = chartGroup.selectAll("#x-axis")
        .data(["x-axis"])
        .enter()
        .append('g')
        .attr("class", "chart-axis")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${chartHeight})`);

    let yAxis = chartGroup.selectAll("#y-axis")
        .data(["y-axis"])
        .enter()
        .append('g')
        .attr("class", "chart-axis")
        .attr("id", "y-axis");

    // ELEMENTS - "g" for x- and y-axis title groups
    let xTitleWrapper = chartGroup.append('g')
        .attr("id", "x-title")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    let yTitleWrapper = chartGroup.append('g')
        .attr("id", "y-title")
        .attr("transform", `translate(-20, ${chartHeight / 2}) rotate(-90)`); 
    
    // ELEMENTS - "text" for x- and y-axis titles
    // Note that "xArr" and "yArr" have the same length
    for (let i = 0; i < xArr.length; i++) {

        // "text" for x-titles
        xTitleWrapper.append('text')
            .attr("id", xArr[i].xAxisVal)
            .attr("value", xArr[i].xAxisVal)
            .attr("x", 0)
            .attr("y", 20 * (i + 1))
            .text(xArr[i].xAxisTitle);
        // "text" for y-titles
        yTitleWrapper.append('text')
            .attr("id", yArr[i].yAxisVal)
            .attr("value", yArr[i].yAxisVal)
            .attr("x", 0)
            .attr("y", -20 * (i + 1))
            .text(yArr[i].yAxisTitle);

    }

    // .......... Initial plotting of the chart .......... //
    plotChart();
    
    // .......... Event listener to switch x-axis .......... // 
    d3.select("#x-title").selectAll('text').on("click", function() {

        // Update "xSelVal" and re-plot the chart
        if (d3.select(this).attr("value") !== xSelVal) {
            // Update "xSelVal" if different from the current one
            xSelVal = d3.select(this).attr("value");
            // Re-plot the chart
            plotChart();
        }

        // Variables to store x- and y-coord relative to 'svg' element
        let mouseX = event.pageX - $('svg').offset().left,
            mouseY = event.pageY - $('svg').offset().top;
        
        // APPEND CIRCLE TO 'SVG'
        d3.select('svg')
            .append('circle')
            .attr("id", "temp-circle")
            .attr("cx", mouseX)
            .attr("cy", mouseY)
            .attr("r", 25)
            .attr("fill", "none")
            .style("stroke", xColor)
            .attr("stroke-width", 3);
      
        // REMOVE CIRCLE
        d3.select("#temp-circle")
            .transition()
            .duration(100)
            .remove(); 

    }); 

    // .......... Event listener to switch y-axis .......... //
    d3.select("#y-title").selectAll('text').on("click", function() {

        // Update "ySelVal" and re-plot the chart    
        if (d3.select(this).attr("value") !== ySelVal) {
            // Update "ySelVal" if different from the current one            
            ySelVal = d3.select(this).attr("value");
            // Re-plot the chart
            plotChart();
        }   

        // Variables to store x- and y-coord relative to 'svg' element
        let mouseX = event.pageX - $('svg').offset().left,
            mouseY = event.pageY - $('svg').offset().top;
        
        // APPEND CIRCLE TO 'SVG'
        d3.select('svg')
            .append('circle')
            .attr("id", "temp-circle")
            .attr("cx", mouseX)
            .attr("cy", mouseY)
            .attr("r", 25)
            .attr("fill", "none")
            .style("stroke", yColor)
            .attr("stroke-width", 3);
      
        // REMOVE CIRCLE
        d3.select("#temp-circle")
            .transition()
            .duration(100)
            .remove();             
   
    }); 

    // |||||||||||||||||||| FUNCTIONS |||||||||||||||||||| //
    /**
     * Based on data from .csv file to plot/update chart with selected x- and y- info as active axes
     */
    function plotChart() {

        // Determine color
        xArr.forEach((param) => {            
            if (param.xAxisVal === xSelVal) xColor = param.xColor;
        });
        yArr.forEach((param) => {
            if (param.yAxisVal === ySelVal) yColor = param.yColor;
        });              

        
        // Determine scales of x- and y-axis in the chart
        let xLinearScale = xScale(acsData, xSelVal),
            yLinearScale = yScale(acsData, ySelVal);

        // Create axis functions
        let bottomAxis = d3.axisBottom(xLinearScale),
            leftAxis = d3.axisLeft(yLinearScale);

        // Update x- and y-axis
        xAxis.transition()
            .call(bottomAxis);
        yAxis.transition()
            .call(leftAxis);
        
        // Update color of axes ticks and texts
        xAxis.select('path').style("stroke", xColor);
        xAxis.selectAll("line").style("stroke", xColor);
        xAxis.selectAll('text').style("fill", xColor);            
        yAxis.select('path').style("stroke", yColor);
        yAxis.selectAll("line").style("stroke", yColor);
        yAxis.selectAll('text').style("fill", yColor);

        // Update x-axis titles
        xTitleWrapper.selectAll('text')
            .transition()
            .style("fill", "#c9c9c9")
            .attr("class", "inactive axis-text");         
        xTitleWrapper.select(`#${xSelVal}`)
            .transition()
            .style("fill", xColor)
            .attr("class", "active axis-text");

        // Update y-axis titles            
        yTitleWrapper.selectAll('text')
            .transition()
            .style("fill", "#c9c9c9")
            .attr("class", "inactive axis-text");            
        yTitleWrapper.select(`#${ySelVal}`)
            .transition()
            .style("fill", yColor)
            .attr("class", "active axis-text"); 

        // Update circles
        circlesGroup.transition()
            .duration(500)
            .attr("cx", (d) => xLinearScale(d[xSelVal]))
            .attr("cy", (d) => yLinearScale(d[ySelVal]))
            .attr("r", 10)
            .style("fill", yColor);

        // Update circle texts
        circleTextsGroup.transition()
            .duration(500)
            .attr("x", (d) => xLinearScale(d[xSelVal]))
            .attr("y", (d) => yLinearScale(d[ySelVal]))   
            .attr("dy", 3.5)
            .text((d) => d.abbr)
            .style("fill", xColor);

        // .......... Event listener for tool tips .......... //
        // Determine x- and y-label to be displayed in tool tips
        xArr.forEach((param) => {            
            if (param.xAxisVal === xSelVal) xToolTipLabel = param.xAxisToolTip;
        });
        yArr.forEach((param) => {
            if (param.yAxisVal === ySelVal) yToolTipLabel = param.yAxisToolTip;
        });              

        // Setup tool tip
        let toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-20, -60])
            .html((d) => {
                return `${d.state}<br>${xToolTipLabel} ${d[xSelVal]}%<br>${yToolTipLabel} ${d[ySelVal]}%`;
            });
       
        // APPEND TOOL TIP
        circlesGroup.call(toolTip);

        // Event listeners for circle and tool tip
        circlesGroup

            .on("mouseover", function(d) {
                // Show tool tip
                toolTip.show(d, this);
                // Setup selected circle
                d3.select(this)
                    .style("fill", "black")  
                    .attr("stroke-width", 2.5)
                    .attr("r", 14);
            })

            .on("mouseout", function(d) {
                // Hide tool tip
                toolTip.hide(d, this);
                // Setup selected circle
                d3.select(this)
                    .style("fill", yColor)
                    .attr("stroke-width", 1)
                    .attr("r", 10);                
            });        

        // End of "plotChart()"" function
        }

    /**
     * Determine x-axis scale based on the values of selected category (column in data from .csv file)
     * @param {*} acsData Entire data read from .csv file
     * @param {*} xSelVal Selected X axis of the chart
     */
    function xScale(acsData, xSelVal) {
        
        // Determine lower and upper limits of domain
        let domainLoLim = d3.min(acsData, (d) => d[xSelVal]) * 0.9,
            domainUpLim = d3.max(acsData, (d) => d[xSelVal]) * 1.1; 
    
        // Create scales
        let xLinearScale = d3.scaleLinear()
                                .domain([domainLoLim, domainUpLim])
                                .range([0, chartWidth]);
        
        return xLinearScale;

    }

    /**
     * Determine y-axis scale based on the values of selected category (column in data from .csv file)
     * @param {*} acsData Entire data read from .csv file
     * @param {*} ySelVal Selected Y axis of the chart
     */
    function yScale(acsData, ySelVal) {

        // Determine lower and upper limits of domain
        let domainLoLim = d3.min(acsData, d => d[ySelVal]) * 0.9,
            domainUpLim = d3.max(acsData, d => d[ySelVal]) * 1.1; 
        
        // Create scales
        let yLinearScale = d3.scaleLinear()
                                .domain([domainLoLim, domainUpLim])
                                .range([chartHeight, 0]);
    
        return yLinearScale;

    }

// end of "d3.csv"
});
 