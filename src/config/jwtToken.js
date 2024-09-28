const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

cookieGenerator = async (user, res) => {
  try {
    const token = await generateToken(user._id);

    const cookieValue = {
      token: token,
      city: user.city,
    };

    res.cookie("userData", JSON.stringify(cookieValue), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 3, // 3 days
    });

    console.log("responded with cookie");

    res.status(200).json({
      success: true,
      message: "Login confirmed",
    });
  } catch (err) {
    res.status(400);

    throw new Error(err ? err.message : "Something went wrong");
  }
};

module.exports = {generateToken, cookieGenerator};