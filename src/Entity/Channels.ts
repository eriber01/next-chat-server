import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chats } from "./Chats";
import { UserChannels } from "./UserChannels";

@Entity({ name: 'channels', schema: 'next_chats' })

export class Channels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Chats, chats => chats.channelId)
  chats: Chats[]

  @OneToMany(() => UserChannels, channel => channel.channelId)
  channel: UserChannels[]

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}