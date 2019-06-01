function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
     // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  var url = `metadata/${sample}`;
  d3.json(url).then(function (sampledata) {
    console.log(sampledata);
    var data=sampledata;
    var panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(sampledata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}:${value}`);
    });

  // BONUS: Build the Gauge Chart
  buildGauge(sampledata.WFREQ);
});
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data
    // credit for colorscale: 
    // https://community.plot.ly/t/what-colorscales-are-available-in-plotly-and-which-are-the-default/2079
  var url = `/samples/${sample}`;
  d3.json(url).then(function (sampledata){
      console.log(sampledata);
      var trace = 
      {
        x: sampledata["otu_ids"],
        y: sampledata["sample_values"],
        text: sampledata["otu_labels"],
        mode: 'markers',
        marker: 
          {
            size: sampledata["sample_values"],
            color: sampledata["otu_ids"],
            colorscale: 'Earth'
          }
      };
  var data=[trace];
  var layout = {xaxis: { title: 'OTU ID' }};

  Plotly.newPlot("bubble", data, layout);  

  });

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
