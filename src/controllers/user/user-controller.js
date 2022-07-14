import userService from '../../services/user/user-service.js';

/**
 * @author 강채현
 * @version 1.0 유저 회원가입
 */
const signUp = async (req, res) => {
  const [statusCode, result] = await userService.signUp();

  return res.status(statusCode).send(result);
};

/**
 * @author 오주환
 * @version 1.0 유저 조회
 */
const userCheck = async (req, res) => {
  const { userId } = req.params;

  const [statusCode, result] = await userService.userCheck(userId);

  return res.status(statusCode).send(result);
};

export default {
  signUp,
  userCheck,
};
