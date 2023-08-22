import axios from "axios";

const getPlaylists = async (userId: string) => {
  const res = await axios.get("/api/prisma/getPlaylists/" + userId);

  return res.data;
};

export default getPlaylists;
