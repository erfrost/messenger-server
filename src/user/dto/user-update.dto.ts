export class UserUpdateDto {
  readonly user_id: string;
  readonly user_link: string;
  readonly name: string;
  readonly surName: string;
  readonly description: string;
  readonly family_status: string;
  readonly city: string;
  readonly age: number;
  readonly isOnline: boolean;
}
