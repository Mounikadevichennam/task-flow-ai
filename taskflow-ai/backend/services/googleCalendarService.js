const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar"
    ]
  });
};

const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

const createCalendarEvent = async (
  refreshToken,
  eventData
) => {
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client
  });

  const startTime = new Date(eventData.dateTime);

const event = {
  summary: eventData.title,
  description: eventData.description || "",
  start: {
    dateTime: startTime.toISOString(),
    timeZone: "Asia/Kolkata"
  },
  end: {
    dateTime: new Date(
      startTime.getTime() + 60 * 60 * 1000
    ).toISOString(),
    timeZone: "Asia/Kolkata"
  }
};

  return await calendar.events.insert({
    calendarId: "primary",
    resource: event
  });
};

module.exports = {
  getAuthUrl,
  getToken,
  createCalendarEvent
};