import axios from "axios";

let accessToken = "";

export async function getOAuthToken() {
    const response = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials"
      }
    }
  );
  console.log("response: ",response);
  accessToken = response.data.access_token;
}