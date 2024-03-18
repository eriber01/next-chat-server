import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users";
import { Channels } from "./Channels";

@Entity({ name: 'user_channels', schema: 'next_chats' })

export class UserChannels {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'channel_id' })
  channelId: number;

  @ManyToOne(() => Channels)
  @JoinColumn({ name: 'channel_id' })
  channels?: Channels

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}