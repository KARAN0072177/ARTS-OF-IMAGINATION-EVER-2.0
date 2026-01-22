import Upload from "../models/Upload.mjs";
import EmailUser from "../models/User.mjs";
import GoogleUser from "../models/GoogleUser.mjs";
import GitHubUser from "../models/GitHubUser.mjs";
import DiscordUser from "../models/DiscordUser.mjs";

export const getAdminStats = async () => {
  try {
    const totalImages = await Upload.countDocuments();
    const emailUsers = await EmailUser.countDocuments();
    const googleUsers = await GoogleUser.countDocuments();
    const githubUsers = await GitHubUser.countDocuments();
    const discordUsers = await DiscordUser.countDocuments();

    const totalUsers = emailUsers + googleUsers + githubUsers + discordUsers;

    return {
      totalImages,
      totalUsers,
      emailUsers,
      googleUsers,
      githubUsers,
      discordUsers,
    };
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return null;
  }
};