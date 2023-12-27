import axios from "axios";

const getPlaylists = async (userId: string) => {
  const res = await axios.get("/api/prisma/playlists/getPlaylists/" + userId);

  return res.data;
};

export default getPlaylists;
