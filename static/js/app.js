
//Loading the samples.json file using the d3.json() function and fetch the json data

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
  console.log(data);
});
// To Place url in a constant variable and be avalable to use
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// To nitialize the dashboard at the begining
function init() {

//Creating a dropdown menu to display the IDs of the samples and values to the dropdown using the select and append funcitons

let dropdown = d3.select("#selDataset");

    d3.json(url).then((data) => {
        
         let names = data.names;

         names.forEach((id) => {

         console.log(id);

         dropdown.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list and log the value
        let sample_one = names[0];

           console.log(sample_one);

        // Build the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);
           
    });
};

//edited one 

// Function that populates metadata info with D3
function buildMetadata(sample) {
    
        d3.json(url).then((data) => {

        // To retrieve all metadata and filter it , use this codes
        let metadata = data.metadata;

        let value = metadata.filter(result => result.id == sample);

        console.log(value)

        // To get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Builds the bar chart using this code
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve  sample data
        let sampleInfo = data.samples;

        // Filtering based on sample value and getting first index
        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};


async function buildBubbleChart(sample) {

    try {
      // Use D3 to retrieve all of the data
      const data = await d3.json(url);
      
      // Retrieve all sample data
      const sampleInfo = data.samples;
  
      // Filter based on the value of the sample
      const value = sampleInfo.filter(result => result.id == sample);
  
      // Get the first index from the array
      const valueData = value[0];
  
      // Get the otu_ids, lables, and sample values
      const otu_ids = valueData.otu_ids;
      const otu_labels = valueData.otu_labels;
      const sample_values = valueData.sample_values;
  
      // Log the data to the console
      console.log(otu_ids,otu_labels,sample_values);
  
      // Set up the trace for bubble chart
      const trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      };
  
// Set up the layout
const layout = {
    title: "Bacteria Per Sample",
    hovermode: "closest",
    xaxis: {title: "OTU ID"},
    yaxis: {title: "Sample values"},
    yaxis2: {
      title: "Belly Button Washing Frequency Scrubs per Week",
      overlaying: "y",
      side: "right"
    }
  };
  
  // Call Plotly to plot the bubble chart
  Plotly.newPlot("bubble", [trace1], layout)
 } catch (error) {
    console.error(error);
  }
  };
  
// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Calling all functions to display the charts
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

init();

    
    
   
    