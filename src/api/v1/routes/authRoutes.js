const express = require("express");
const router = express.Router();
// include controllers and middlewares

router.use("/local", require("./localStrategies"));

router.use("/oauth/google", require("../controllers/googleOAuth")); // http://localhost:3000/api/v1/auth/oauth/google
// router.use("/oauth/facebook", require("../controllers/facebookOAuth")); // http://localhost:3000/api/v1/auth/oauth/facebook
// router.use("/oauth/linkedIn", require("../controllers/linkedInOAuth")); // http://localhost:3000/api/v1/auth/oauth/linkedIn

router.use("/password", require("./passwordRoutes")); // http://localhost:3000/api/v1/auth/password

// router.use("/facebook", require("../config/facebookStrategy")); // http://localhost:3000/api/v1/auth/facebook
// router.use("/linkedIn", require("../config/linkedInStrategy")); // http://localhost:3000/api/v1/auth/linkedIn
// router.use("/apple", require("../config/appleStrategy")); // http://localhost:3000/api/v1/auth/apple

module.exports = router;
