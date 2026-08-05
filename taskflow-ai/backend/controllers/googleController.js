const {
  getAuthUrl,
  getToken,
} = require("../services/googleCalendarService");

exports.googleLogin = (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const tokens = await getToken(code);

    console.log("Google Tokens:", tokens);

    res.send(`
      <h2>Google Calendar Connected Successfully ✅</h2>
      <p>Copy this Refresh Token and save it.</p>
      <pre>${tokens.refresh_token}</pre>
    `);

  } catch (error) {
    console.error(error);
    res.status(500).send("Google Authentication Failed");
  }
};