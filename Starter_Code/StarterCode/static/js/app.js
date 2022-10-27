// Set up data

// first function

function makeChart(patientID) {
    d3.json("samples.json").then((data => {
    
    // define variables

    let metadata = data.metadata
    // let names = data.names
    let samples = data.samples
    
    // define filters
    
    let metadataFiltered = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]
    let sampleFiltered = samples.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

    // define chart variables

    let sampleValues = sampleFiltered.sample_values
    let otuIDs = sampleFiltered.otu_ids
    let otuLabels = sampleFiltered.otu_labels

    
    // definne chart - Bubble
    let bubbleData = [{
        // define chart values - Bubble
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            coler: otuIDs,
            size: sampleValues,
            colorscale: 'RdBu' 
        }
    }];
    
    // define chart layout - Bubble
    let bubbleLayout = {
        title: "Belly Button Samples",
        xaxis: {title: "OTU Identifiers"},
        yaxis: {title:"Microbial sample values"},
    };

    // show plot - Bubble
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)
    

    // define chart - gauge

    // define variable for frequency

    let washFreq = metadataFiltered.wfreq

    // define the trace

    let gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: "Washing times per week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                bar: {color: 'white'},
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 3], color: 'yellow' },
                    { range: [3, 6], color: 'orange' },
                    { range: [6, 9], color: 'pink' }
                ]
                    
            }
        }
    ];

    // define plot - gauge
    var gaugeLayout = { width: 400, height: 300, margin: { t: 0, b: 0 } };

    // display plot - gauge
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

    // define chart - Bar
    let barData = [{
        // define chart values - Bar
        x: sampleValues.slice(0,10).reverse(),
        y: otuIDs.slice(1,10).map(otu_id => `OTU: ${otu_id}`).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        type: 'bar',
        orientation: 'h',
        marker: {
            color: "red"
        }
    }]

    // define layout
    let barLayout = {
        title: "Top Ten Microbial Species in Belly Buttons",
        xaxis: {title:"Microbial sample values"},
        yaxis: {title: "OTU Identifiers"}
    };

    // show plot - Bar
    Plotly.newPlot('bar',barData,barLayout);


}))};

// second function

function showDemInfo(patientID) {
    let demInfo = d3.select("#sample-metadata");


    d3.json("samples.json").then(data => {
        let metadata = data.metadata
        let metadataFiltered = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        console.log(metadataFiltered)
        Object.entries(metadataFiltered).forEach(([key, value]) => {
            demInfo.append("p").text(`${key}: ${value}`)
        })


    })
}



// // third function
function optionChanged(patientID){
    console.log(patientID);
    makeChart(patientID);
    showDemInfo(patientID);

}

// FUNCTION #4 of 4
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value", patientID)
        })
        makeChart(patientIDs[0]);
        showDemInfo(patientIDs[0]);
    });
};

initDashboard();