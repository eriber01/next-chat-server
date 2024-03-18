import AppDataSource from '../../../config/data-source';
import { Channels } from '../../Entity/Channels';
import { Chats } from '../../Entity/Chats';
import { UserChannels } from '../../Entity/UserChannels';
import { onSaveChatI } from './interfaces';

export const onSaveChats = async (data: onSaveChatI) => {
  const repoChannel = AppDataSource.getRepository(Channels)

  try {

    await AppDataSource.transaction(async txn => {


      let channelId = data.channelId

      if (!channelId) {
        const channel = await txn.save(repoChannel.create({ name: 'default' }))
        channelId = channel.id
      }

      const payloadUserChannel = {
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
  } catch (error) {
    console.log(error);
    throw new Error("Error Send the Chat");
  }
}