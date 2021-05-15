let data = {};

// Fetch the JSON data with D3
d3.json("./samples.json").then(d => {
    data = d;

    fill_subjets(d.names);

    fill_metadata(d.metadata[0]);
});

function optionChanged(value) {
    let metadata = data.metadata.filter(d => d.id == value)[0];
    fill_metadata(metadata);
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