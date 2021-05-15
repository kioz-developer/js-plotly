const url_data = "./samples.json";

// Fetch the JSON data with D3
d3.json(url_data).then(data => {
    //console.log(data.names);
    
    fillSubjets(data.names);
});

function fillSubjets(names) {
    var selDataset = d3.select("#selDataset");
    
    var selection = selDataset.selectAll("option")
        .data(names);
        
    selection.enter()
        .append("option")
        .merge(selection)
        .text(d => d);
}