import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users";
import { Channels } from "./Channels";

@Entity({ name: 'chats', schema: 'next_chats' })

export class Chats {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'message' })
  message: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users

  @Column({ name: 'channel_id' })
  channelId: number;

  @ManyToOne(() => Channels)
  @JoinColumn({ name: 'channel_id' })
  channel?: Channels

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}