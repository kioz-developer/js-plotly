const url_data = "./samples.json";

// Fetch the JSON data with D3
d3.json(url_data).then(data => {
    console.log(data);
});