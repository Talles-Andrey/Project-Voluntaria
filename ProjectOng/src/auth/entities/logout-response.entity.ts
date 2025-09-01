import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseEntity {
  @ApiProperty({ example: 'Logout successful' })
  message: string;

  @ApiProperty({ example: 'volunteer', description: 'Type of user (volunteer or ngo)' })
  userType: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email of the logged out user' })
  email: string;
}
