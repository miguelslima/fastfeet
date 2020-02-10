import * as Yup from 'yup';
import File from '../models/File';

import Deliverymans from '../models/Deliverymans';

class DeliverymansController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliverymans = await Deliverymans.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymans);
  }

  async show(req, res) {
    const { id } = req.params;

    const deliverymans = await Deliverymans.findByPk(id, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const deliverymans = await Deliverymans.create(req.body);
    const { id, name, email, avatar_id } = deliverymans;
    return res.json({ id, name, email, avatar_id });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    if (!req.params.id) {
      return res.status(401).json({ error: 'ID dont found' });
    }

    const deliverymans = await Deliverymans.findByPk(req.params.id);

    if (!deliverymans) {
      return res.status(401).json({ error: 'deliverymans does not exists' });
    }

    const { name, email, avatar_id } = await deliverymans.update(req.body);

    return res.json({ name, email, avatar_id });
  }

  async destroy(req, res) {
    const deliverymans = await Deliverymans.findByPk(req.params.id);

    if (!deliverymans) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    if (!req.params.id) {
      return res.status(400).json({ error: 'ID dont found' });
    }

    await deliverymans.destroy();

    return res.json({ deleted: 'Deliveryman successfully deleted' });
  }
}

export default new DeliverymansController();
