function getChannel(nomeCanale) {
    $.ajax({
      type: "POST",
      url: base_url + "getChannel.php",
      data: JSON.stringify({
        "sid": sid,
        "ctitle": nomeCanale
      }),
      success: function (data) {
        json = JSON.parse(data);
        elenco_posts = json.posts;
        console.log("The ajax request for getChannel succeeded!");
        //console.log("The result is: ");
        //console.dir(data);
      },
      error: function (error) {
        console.log(error.responseText);
      }
    })
  }