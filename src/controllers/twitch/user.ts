import axios from "axios";

export async function getChatters() {
  const response = await axios.get(
  "https://api.twitch.tv/helix/chat/chatters",
  {
    params: {
      broadcaster_id: "123456789",
      moderator_id: "123456789"
    },
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
    }
  }
  );

  console.log(response.data);

}