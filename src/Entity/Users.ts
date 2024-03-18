import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chats } from "./Chats";
import { Channels } from "./Channels";
import { UserChannels } from "./UserChannels";

@Entity({ name: 'users', schema: 'next_chats' })

export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'auth_id' })
  authId: string;

  @Column({ name: 'nick_name', nullable: true })
  nickName?: string;

  @Column({ name: 'pass', nullable: true })
  pass?: string;

  @OneToMany(() => Chats, chats => chats.user)
  chats: Chats[]

  @OneToMany(() => UserChannels, channel => channel.userId)
  channel: UserChannels[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}