import axios from "axios";
import { AppError } from "../../errors/AppError.js";

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
  console.log("response: ", response);
  console.log("response.data: ", response.data);
  console.log("response.data.access_token: ", response.data.access_token);
  accessToken = response.data.access_token;
  return accessToken
}

export async function getBroadcastId(accessToken: string) {
    const response = await axios.get(
    "https://api.twitch.tv/helix/users",
    {
        headers: {
            'Client-Id': process.env.TWITCH_CLIENT_ID!,
            'Authorization': `Bearer ${accessToken}`,
        },
        params: {
            login: "aninhacattv"
        },
    }
  );

  if(!response.data.data.length){
    throw new AppError("Canal não encontrado", 200)
  }
  console.log("broadcast_id: ", response.data.data[0].id);
  const broadcast_id = response.data.data[0].id
  return broadcast_id
}