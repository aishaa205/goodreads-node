const { default: axios } = require("axios");

exports.addImgurImage = async (imageUrl) => {
  try {
    const clientId = process.env.IMGUR_CLIENT_ID;
    //console.log(clientId);
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      { image: imageUrl },
      {
        headers: {
          Authorization: `Client-ID ${clientId}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Imgur URL:", response.data.data.link);
    return response.data.data.link//.replace("imgur", "i.imgur");
  } catch (error) {
    console.log(error);
    return error;
  }
};
