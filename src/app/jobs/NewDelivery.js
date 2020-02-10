import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'NewDelivery';
  }

  async handle({ data }) {
    console.log('Chegou aqui! Novo');

    const { deliveries } = data;

    await Mail.sendMail({
      to: `${deliveries.deliveryman.name} <${deliveries.deliveryman.email}>`,
      subject: 'Um novo produto está disponível para entrega.',
      template: 'NewDelivery',
      context: {
        deliverymans: deliveries.deliveryman.name,
        recipient: deliveries.recipient.name,
        product: deliveries.product,
      },
    });
  }
}

export default new NewDelivery();
