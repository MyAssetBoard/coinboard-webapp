$.ajax({
  url: "https://www.changer.com/api/v2/rates/ethereum_ETH/advcash_USD",
  // Handle as Text
  dataType: "text",
  success: function(data) {
    // Parse JSON file
    var json = $.parseJSON(data);
    //Store data into a variable
    // Display Players
    $('#adveth').html('Eth/advcash USD : ' + json.rate);
  }
});
