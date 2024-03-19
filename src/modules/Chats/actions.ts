import AppDataSource from '../../../config/data-source';
import { Channels } from '../../Entity/Channels';
import { Chats } from '../../Entity/Chats';
import { UserChannels } from '../../Entity/UserChannels';
import { onSaveChatI } from './interface';

export const onSaveChats = async (data: onSaveChatI): Promise<Chats> => {
  const repoChannel = AppDataSource.getRepository(Channels)
  const repoUserChanel = AppDataSource.getRepository(UserChannels)

  try {

    const res = await AppDataSource.transaction(async txn => {

      let channelId = data.channelId

      if (!channelId) {
        const channel = await txn.save(repoChannel.create({ name: 'default' }))
        channelId = channel.id
      }

      const userChanel = await repoUserChanel.findOne({ where: { channelId, userId: data.userId } })

      const payloadUserChannel: UserChannels = {
        id: userChanel?.id,
        userId: data.userId,
        channelId,
      }

      await txn.save(UserChannels, payloadUserChannel)

      const payloadChats: Chats = {
        ...data,
        channelId
      }

      const chat = await txn.save(Chats, payloadChats)

      return chat
    })

    return res
  } catch (error) {
    console.log(error);
    throw new Error("Error Send the Chat");
  }
}