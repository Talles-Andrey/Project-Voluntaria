import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';

export class ProjectWithUsersEntity {
  @ApiProperty({
    type: Project,
    description: 'Dados do projeto',
  })
  project: Project;

  @ApiProperty({
    type: 'array',
    description: 'Lista de usuários inscritos no projeto',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID do usuário' },
        name: { type: 'string', description: 'Nome do usuário' },
        email: { type: 'string', description: 'Email do usuário' },
        city: { type: 'string', description: 'Cidade do usuário' },
        state: { type: 'string', description: 'Estado do usuário' },
        userType: { type: 'string', description: 'Tipo do usuário' },
        skills: { type: 'array', items: { type: 'string' }, description: 'Habilidades do usuário' },
        experience: { type: 'string', description: 'Experiência do usuário' },
      },
    },
  })
  users: {
    id: string;
    name: string;
    email: string;
    city: string;
    state: string;
    userType: string;
    skills: string[];
    experience: string;
  }[];
}
