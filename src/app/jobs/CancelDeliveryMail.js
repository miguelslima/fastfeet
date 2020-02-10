import Mail from '../../lib/Mail';

class CancelDeliveryMail {
  get key() {
    return 'CancelDeliveryMail';
  }

  async handle({ data }) {
    const { deliveries } = data;

    console.log('Chegou aqui! Cancelar');
    await Mail.sendMail({
      to: `${deliveries.deliveryman.name} <${deliveries.deliveryman.email}>`,
      subject: 'Novo cancelamento de encomenda.',
      template: 'CancelDeliveryMail',
      context: {
        deliverymans: deliveries.deliveryman.name,

        product: deliveries.product,
      },
    });
  }
}

export default new CancelDeliveryMail();
