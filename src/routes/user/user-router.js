import { Router } from 'express';
import userController from '../../controllers/user/user-controller.js';
import { validate } from 'express-validation';
import userValidator from '../../validations/user/user-validator.js';

const router = Router();

router.post('/', userController.signUp); // 유저 생성
router.get(
  '/:userId',
  validate(userValidator.userCheck),
  userController.userCheck,
); // 유저 조회

export default router;
