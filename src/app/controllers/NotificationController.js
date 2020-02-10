// import { Op } from 'sequelize';

// import Notification from '../schemas/Notification';
import Deliverymans from '../models/Deliverymans';
import Deliveries from '../models/Deliveries';

class NotificationController {
  async index(req, res) {
    // const { ended = 'true' } = req.query;
    const { id } = req.params;

    const deliveryman = await Deliverymans.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const deliveries = await Deliveries.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        // end_date: ended === 'true' ? { [Op.not]: null } : null,
      },
      order: ['end_date', 'start_date', 'id'],
    });

    return res.json(deliveries);
  }

  //   async update(req, res) {
  //     const notification = await Notification.findByIdAndUpdate(
  //       req.params.id,
  //       { read: true },
  //       { new: true }
  //     );
  //     return res.json(notification);
  //   }
}

export default new NotificationController();
