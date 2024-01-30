export class SendMessageDto {
  readonly chat_id: string;
  readonly sender_link: string;
  readonly recipient_link: string;
  readonly message_content: string;
  readonly date: Date;
  readonly socket_room_id: string;
}
