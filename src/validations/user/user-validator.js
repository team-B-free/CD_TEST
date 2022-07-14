import Joi from 'joi';

const userCheck = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};

export default {
  userCheck,
};
