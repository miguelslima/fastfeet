import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import RecipientsControllers from './app/controllers/RecipientsController';
import SessionControllers from './app/controllers/SessionController';
import DeliverymanControllers from './app/controllers/DeliverymanControllers';
import FileControllers from './app/controllers/FileControllers';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliveriesActionController from './app/controllers/DeliveriesActionController';
import WithdrawController from './app/controllers/WithdrawController';
import DeliveryController from './app/controllers/DeliveryController';
import AdminDeliveriesController from './app/controllers/AdminDeliveriesController';

import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionControllers.store);

routes.get('/deliveryman/:id/deliveries', DeliveriesActionController.index);

routes.patch(
  '/deliveryman/:id/deliveries/:delivery_id/withdraw',
  WithdrawController.update
);

routes.patch(
  '/deliveryman/:id/deliveries/:delivery_id/deliver',
  upload.single('file'),
  DeliveryController.update
);

routes.use(authMiddleware);

routes.get('/recipients', RecipientsControllers.index);
routes.get('/recipients/:id', RecipientsControllers.show);
routes.post('/recipients', RecipientsControllers.store);
routes.put('/recipients/:id', RecipientsControllers.update);
routes.delete('/recipients/:id', RecipientsControllers.destroy);

routes.get('/deliveryman', DeliverymanControllers.index);
routes.get('/deliveryman/:id', DeliverymanControllers.show);
routes.post('/deliveryman', DeliverymanControllers.store);
routes.put('/deliveryman/:id', DeliverymanControllers.update);
routes.delete('/deliveryman/:id', DeliverymanControllers.destroy);

routes.get('/deliveries', DeliveriesController.index);
routes.post('/deliveries', DeliveriesController.store);
routes.delete('/deliveries/:id', DeliveriesController.delete);

routes.get('/notifications/:id/deliveries', NotificationController.index);

routes.get('/problems', AdminDeliveriesController.index);
routes.patch(
  '/problems/:problems_id/cancel-delivery',
  AdminDeliveriesController.update
);

routes.post('/files', upload.single('file'), FileControllers.store);

export default routes;
