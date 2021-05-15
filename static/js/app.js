const url_data = "./samples.json";
let data = 
// Fetch the JSON data with D3
d3.json(url_data).then(d => {
    data = d;

    fill_subjets(d.names);
    //fill_metadata(data);
});

function optionChanged(value) {
    let metadata = data.metadata.filter(d => d.id == value);

    let list = [];
    for ([key, value] of Object.entries(metadata[0])) {
        console.log(key, value);
        list.push({'key': key, 'value': value});
    }

    fill_metadata(list);
    console.log(list);
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
    var dataset = d3.select("#metadata");

    var selection = dataset.selectAll("p")
        .data(metadata);

    selection.enter()
        .append("p")
        .merge(selection)
        .text(d => `${d.key}: ${d.value}`);
}