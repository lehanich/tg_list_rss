import { Result } from './Result';

export interface Posts extends Result {
  result: Post[]
}

export interface SenderUser {
  id: number,
  title: string,
  username: string,
  type: 'channel'
}

export interface Photo {
  file_id: string,
  file_unique_id: string,
  file_size: number,
  width: number,
  height: number
}

export interface Entity {
  offset: number,
  length: number,
  type: 'hashtag'
}

export interface ChannelPost {
  message_id: number,
  media_group_id: number,
  sender_chat: SenderUser,
  chat: SenderUser,
  date: number,
  photo: Photo[],
  caption?: string,
  caption_entities?: Entity[],
  text: string
}

export interface Post {
  update_id: number,
  channel_post: ChannelPost,
}
