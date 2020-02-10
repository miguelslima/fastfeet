import { Op } from 'sequelize';

import Queue from '../../lib/Queue';
import CancelDeliveryMail from '../jobs/CancelDeliveryMail';

import Deliveries from '../models/Deliveries';
import Deliverymans from '../models/Deliverymans';
import DeliveriesProblem from '../models/DeliveriesProblem';
import File from '../models/File';
import Recipients from '../models/Recipients';

class AdminDeliveriesController {
  async index(req, res) {
    const problems = await DeliveriesProblem.findAll({
      attributes: ['deliveries_id'],
    });

    const idsWithProblems = problems.map(p => p.delivery_id);

    const deliveries = await Deliveries.findAll({
      where: {
        id: {
          [Op.in]: idsWithProblems,
        },
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipients,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'postal_code',
            'compliment',
            'state',
            'city',
          ],
        },
        {
          model: Deliverymans,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.status(200).json(deliveries);
  }

  async update(req, res) {
    const { problem_id } = req.params;

    const problem = await DeliveriesProblem.findByPk(problem_id);
    if (!problem) {
      return res.status(400).json({ error: 'Problem not found' });
    }

    const delivery = await Deliveries.findByPk(problem.delivery_id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery alredy canceled' });
    }

    await delivery.update({ canceled_at: new Date() });
    await delivery.reload({
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipients,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'postal_code',
            'compliment',
            'state',
            'city',
          ],
        },
        {
          model: Deliverymans,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    await Queue.add(CancelDeliveryMail.key, { delivery });

    return res.status(200).json(delivery);
  }
}

export default new AdminDeliveriesController();
