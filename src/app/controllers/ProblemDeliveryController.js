import * as yup from 'yup';

import Deliveries from '../models/Deliveries';
import Deliverymans from '../models/Deliverymans';
import DeliveriesProblem from '../models/DeliveriesProblem';
import File from '../models/File';
import Recipients from '../models/Recipients';

class DeliveryProblemController {
  async index(req, res) {
    const { delivery_id } = req.params;

    const delivery = await Deliveries.findByPk(delivery_id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const problems = await DeliveriesProblem.findAll({
      where: {
        delivery_id,
      },
      attributes: ['id', 'description'],
      include: [
        {
          model: Deliveries,
          as: 'delivery',
          attributes: ['product', 'start_date', 'end_date', 'canceled_at'],
          include: [
            {
              model: Recipients,
              as: 'recipient',
              attributes: [
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
              attributes: ['name', 'email'],
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
        },
      ],
    });

    return res.status(200).json(problems);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      description: yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    const { delivery_id } = req.params;

    const delivery = await Deliveries.findByPk(delivery_id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery is canceled' });
    }

    const { description } = req.body;
    const problem = await DeliveriesProblem.create({
      delivery_id,
      description,
    });

    await problem.reload({
      attributes: ['id', 'description'],
      include: [
        {
          model: Deliveries,
          as: 'delivery',
          attributes: ['product', 'start_date', 'end_date', 'canceled_at'],
          include: [
            {
              model: Recipients,
              as: 'recipient',
              attributes: [
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
              attributes: ['name', 'email'],
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
        },
      ],
    });

    return res.status(201).json(problem);
  }
}

export default new DeliveryProblemController();
