const fs = require("fs");
const config = fs.readFileSync("./config/config.json");
const AppleAuth = require("apple-auth");
const jwt = require("jsonwebtoken");

let auth = new AppleAuth(
    config,
    fs.readFileSync("./config/AuthKey.p8").toString(), //read the key file
    "text"
  );
  
  app.post("/auth", async (req, res) => {
    try {
       //authenticate our code we recieved from apple login with our key file
      const response = await auth.accessToken(req.body.authorization.code);
      // decode our token
      const idToken = jwt.decode(response.id_token);
  
      
      const user = {};
      user.id = idToken.sub;
      //extract email from idToken
      if (idToken.email) user.email = idToken.email;
      
      //check if user exists in the returned response from Apple
      //Apple returns the user only once, so you might want to save their details
      // in a database for future logins
      
      if (req.body.user) { 
        const { name } = JSON.parse(req.body.user);
        user.name = name;
      }
  
      res.json(user); // Respond with the user
    } catch (error) {
      console.log(error);
    }
  });