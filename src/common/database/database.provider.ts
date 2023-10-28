import { DataSource } from 'typeorm';

const env = process.env;

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mongodb',
        url: `mongodb://${env.MONGO_DB_USERNAME}:${env.MONGO_DB_PASSWORD}@${env.MONGO_DB_HOST}:${env.MONGO_OUTSIDE_PORT}/${env.MONGO_DB_NAME}?authSource=admin`,
        host: env.MONGO_DB_HOST,
        port: parseInt(env.MONGO_OUTSIDE_PORT),
        username: env.MONGO_DB_USERNAME,
        password: env.MONGO_DB_PASSWORD,
        database: env.MONGO_DB_NAME,
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
        authSource: 'admin',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        logging: 'all',
      });

      return dataSource.initialize();
    },
  },
];
