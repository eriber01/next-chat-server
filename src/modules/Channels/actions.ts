import AppDataSource from "../../../config/data-source";
import { Channels } from "../../Entity/Channels";
import { UserChannels } from "../../Entity/UserChannels";


export const getChannelsForUser = async (userId: number) => {
  const repoChannels = AppDataSource.getRepository(Channels)
  const repoUserChannels = AppDataSource.getRepository(UserChannels)

  const userChannels = await repoUserChannels.find({ where: { userId }, relations: ['channels'] })

  console.log({ userId });

  return userChannels

}