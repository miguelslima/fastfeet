import Sequelize from 'sequelize';

import Users from '../app/models/Users';
import Recipients from '../app/models/Recipients';
import Deliverymans from '../app/models/Deliverymans';
import Deliveries from '../app/models/Deliveries';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [Users, Recipients, Deliverymans, File, Deliveries];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
