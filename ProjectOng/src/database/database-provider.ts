import { User } from 'src/users/entities/user.entity';
import { Ngo } from 'src/ngos/entities/ngo.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Campaign } from 'src/campaigns/entities/campaign.entity';
import { Donation } from 'src/donations/entities/donation.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Opportunity } from 'src/opportunities/entities/opportunity.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'voluntariar',
  port: Number(process.env.DATABASE_PORT) || 5432,
  synchronize: true,
  entities: [User, Ngo, Project, Campaign, Donation, Enrollment, Rating, Opportunity],
  logging: process.env.NODE_ENV === 'development',
};

export const dataSource = new DataSource(dataSourceOptions);

// Inicialização da conexão
export const initializeDatabase = async (): Promise<void> => {
  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
};

export default dataSource;
