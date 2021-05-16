let data = {};

// Fetch the JSON data with D3
d3.json("./samples.json").then(d => {
    data = d;

    fill_subjets(d.names);
    fill_metadata(d.metadata[0]);

    plot_bar(d.samples[0], d.metadata[0].id);
    plot_bubble(d.samples[0], d.metadata[0].id);
});

function optionChanged(value) {
    let metadata = data.metadata.filter(d => d.id == value)[0];
    let sample = data.samples.filter(d => d.id == value)[0];

    fill_metadata(metadata);
    plot_bar(sample, value);
    plot_bubble(sample, value);
}

function plot_bar(d, id) {
    var results = [];
    d.sample_values.forEach((key, i) => results[d.sample_values[i]] = {
        'sample_value': d.sample_values[i],
        'otu_id': `OTU ${d.otu_ids[i]} `,
        'otu_label': d.otu_labels[i]
    });

    results.sort(function(x, y){
        return d3.descending(x.sample_value, y.sample_value);
    });

    // Get top 10 results
    top10 = results.slice(0, 10);

    console.log(top10);
    console.log(top10.map(d => d.sample_value));
    var trace1 = {
        x: top10.map(d => d.sample_value).reverse(),
        y: top10.map(d => d.otu_id).reverse(),
        text: top10.map(d => d.otu_label).reverse(),
        type: "bar",
        orientation: 'h'
    };

    var data = [trace1];

    var layout = {
        title: `Top 10 OTUs found in individual ${id}`
    };

    Plotly.newPlot("bar", data, layout);
}

function plot_bubble(d, id) {
    let colors = d.otu_ids.map(d => 
        `#${(d3.format("03")(d)).substring(0, 3)}`
    ).reverse();
    
    var trace1 = {
        x: d.otu_ids,
        y: d.sample_values,
        text: d.otu_labels,
        mode: 'markers',
        marker: {
          size: d.sample_values,
          color: colors
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: `OTUs found in individual ${id}`,
        showlegend: false
      };
      
      Plotly.newPlot('bubble', data, layout);
}

function fill_subjets(names) {
    var dataset = d3.select("#selDataset");
    
    var selection = dataset.selectAll("option")
        .data(names);
        
    selection.enter()
        .append("option")
        .merge(selection)
        .text(d => d);
}

function fill_metadata(metadata) {
    let pair_list = to_pair_list(metadata);

    var dataset = d3.select("#metadata");

    var selection = dataset.selectAll("p")
        .data(pair_list);

    selection.enter()
        .append("p")
        .merge(selection)
        .text(d => `${d.key}: ${d.value}`);
}

function to_pair_list(obj) {
    let list = [];
    for ([key, value] of Object.entries(obj)) {
        list.push({'key': key, 'value': value});
    }
    return list;
}