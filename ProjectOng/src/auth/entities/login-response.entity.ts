import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseEntity {
  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string', example: 'uuid' },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
      userType: { type: 'string', example: 'volunteer' },
    },
  })
  user: {
    id: string;
    email: string;
    name: string;
    userType: string;
  };
}
