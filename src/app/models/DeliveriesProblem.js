import Sequelize, { Model } from 'sequelize';

class DeliveriesProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Deliveries, {
      foreignKey: 'deliveries_id',
      as: 'deliveries',
    });
  }
}

export default DeliveriesProblems;
