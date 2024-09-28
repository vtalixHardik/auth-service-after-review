const express = require("express")
const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");


const app = express();
const PORT = 3000;


async function key(kid) {
  const client = jwksClient({
    jwksUri: "https://appleid.apple.com/auth/keys",
    timeout: 30000
  });

  return await client.getSigningKey(kid);
} 

app.post("/auth/apple", async (req, res) => {
  const { id_token } = req.body
  const { header } = jwt.decode(id_token, {
    complete: true
  })

  const kid = header.kid
  const publicKey = (await key(kid)).getPublicKey()
  console.log(publicKey)

  const { sub, email } = jwt.verify(id_token, publicKey);
  return { sub, email }
})