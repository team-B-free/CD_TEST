import '../utils/env.js';
import dotenv from 'dotenv';

dotenv.config();

import { logger } from '../config/winston.js';

import Sequelize from 'sequelize';
import User from './user.js';
import Bossraid from './bossraid.js';
import BossraidRecord from './bossraid-record.js';

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: process.env.DB_TIMEZONE,
  },
);

const db = {};

db.sequelize = sequelize;

db.User = User;
db.Bossraid = Bossraid;
db.BossraidRecord = BossraidRecord;

User.init(sequelize);
Bossraid.init(sequelize);
BossraidRecord.init(sequelize);

User.associate(db);
Bossraid.associate(db);
BossraidRecord.associate(db);

export default db;
