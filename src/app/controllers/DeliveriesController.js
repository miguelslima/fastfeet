import * as Yup from 'yup';
// import { startOfHour, parseISO, format } from 'date-fns';
// import pt from 'date-fns/locale/pt';

import Queue from '../../lib/Queue';
import NewDelivery from '../jobs/NewDelivery';
import CancelDeliveryMail from '../jobs/CancelDeliveryMail';

import Recipients from '../models/Recipients';
import Deliverymans from '../models/Deliverymans';
import File from '../models/File';
import Deliveries from '../models/Deliveries';

class DeliveriesController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Deliveries.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'product', 'start_date', 'canceled_at', 'end_date'],
      include: [
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
          model: Recipients,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'state',
            'city',
            'zipcode',
          ],
        },
      ],
    });
    return res.json(deliveries);
  }

  async show(req, res) {
    const deliveries = await Deliveries.findByPk(req.params.id);

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number()
        .positive()
        .required(),
      deliveryman_id: Yup.number()
        .positive()
        .required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const { recipient_id, deliveryman_id } = req.body;

    const deliveryman = await Deliverymans.findByPk(deliveryman_id);

    if (!deliveryman)
      return res.status(400).json({ error: 'Deliveryman not found' });

    const recipient = await Recipients.findByPk(recipient_id);

    if (!recipient)
      return res.status(400).json({ error: 'Recipient not found' });

    const deliveries = await Deliveries.create(req.body);

    await deliveries.reload({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipients,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'complement',
            'number',
            'zipcode',
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
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    await Queue.add(NewDelivery.key, {
      deliveries,
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    if (!req.params.id) {
      return res.status(401).json({ error: 'ID dont found' });
    }

    const deliveries = await Recipients.findByPk(req.params.id);

    if (!deliveries) {
      return res.status(401).json({ error: 'Delivery does not exists' });
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
    } = await deliveries.update(req.body);

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveries = await Deliveries.findByPk(id, {
      include: [
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
      ],
    });

    if (!deliveries) {
      return res.status(401).json({ error: 'Deliveries not found' });
    }

    await deliveries.destroy();

    await Queue.add(CancelDeliveryMail.key, { deliveries });

    return res.json({ message: 'Delivery successfully deleted ' });
  }
}

export default new DeliveriesController();
