let data = {};

// Fetch the JSON data with D3
d3.json("./samples.json").then(d => {
    data = d;

    fill_subjets(d.names);
    fill_metadata(d.metadata[0]);

    plot_bar(d.samples[0], d.metadata[0].id);
    plot_bubble(d.samples[0], d.metadata[0].id);
    plot_gauge(d.metadata[0], d.metadata[0].id);
});

function optionChanged(value) {
    let metadata = data.metadata.filter(d => d.id == value)[0];
    let sample = data.samples.filter(d => d.id == value)[0];

    fill_metadata(metadata);

    plot_bar(sample, value);
    plot_bubble(sample, value);
    plot_gauge(metadata, value);
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

function plot_gauge(metadata, id) {
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: metadata.wfreq,
            title: { text: `Scrubs Per Week` },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {
                    range: [null, 9]
                },
                steps: [
                    { range: [0, 1], color: "#f9f3ed" },
                    { range: [1, 2], color: "#f4f0e5" },
                    { range: [2, 3], color: "#e9e6c8" },
                    { range: [3, 4], color: "#e4e9b0" },
                    { range: [4, 5], color: "#d4e499" },
                    { range: [5, 6], color: "#b6cc8f" },
                    { range: [6, 7], color: "#8ac087" },
                    { range: [7, 8], color: "#88bd8d" },
                    { range: [8, 9], color: "#84b589" },
                ]
            }
        }
    ];

    var layout = {
        title: `Belly button Washing Frequency (${id})`
    };

    Plotly.newPlot('gauge', data, layout);
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