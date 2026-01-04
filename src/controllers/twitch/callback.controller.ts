import type { Request, Response } from "express";
import axios from "axios";

export async function loginTwitch(req: Request, res: Response) {
const code = req.query.code;

  const tokenResponse = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/auth/twitch/callback",
      },
    }
  )

  const accessToken = tokenResponse.data.access_token;
  console.log("accessToken: ", accessToken)

  // Buscar dados do usuário
  const userResponse = await axios.get("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID,
    },
  });

  const twitchUser = userResponse.data.data[0];

  console.log(twitchUser);
  
  return res.status(200).json({ message: "TUDO CERTO"})

}