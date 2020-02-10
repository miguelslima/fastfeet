import * as Yup from 'yup';

import Recipients from '../models/Recipients';

class RecipientsController {
  async index(req, res) {
    const recipient = await Recipients.findAll({ order: [['id', 'ASC']] });

    return res.json(recipient);
  }

  async show(req, res) {
    const recipient = await Recipients.findByPk(req.params.id);

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const recipient = await Recipients.create(req.body);
    const {
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    } = recipient;
    return res.json({
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    if (!req.params.id) {
      return res.status(401).json({ error: 'ID dont found' });
    }

    const recipients = await Recipients.findByPk(req.params.id);

    if (!recipients) {
      return res.status(401).json({ error: 'Recipient does not exists' });
    }

    const {
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    } = await recipients.update(req.body);

    return res.json({
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    });
  }

  async destroy(req, res) {
    const recipient = await Recipients.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exists' });
    }

    if (!req.params.id) {
      return res.status(400).json({ error: 'ID dont found' });
    }

    await recipient.destroy();

    return res.json({ deleted: true });
  }
}

export default new RecipientsController();
