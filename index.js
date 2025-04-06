const express = require('express');

const app = express();

app.use(express.static(__dirname + "/public"));

app.listen(3000, () => {
  console.log('server started');
});

app.get("/user/:id", (request, response) => {

  function update_file() {

    fs = require("fs")

    //fs.appendFile("public/user_details.txt", "Hello", function (err) { if (err) throw err })

  }

  //update_file()

  response.json({ name: "Some Person" })
  
})

