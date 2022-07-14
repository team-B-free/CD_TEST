import Joi from 'joi';

const endBossRaid = {
  body: Joi.object({
    userId: Joi.number().required(),
    raidRecordId: Joi.number().required(),
    isSolved: Joi.boolean().required(),
  }),
};

const getTopRanker = {
  headers: Joi.object({
    userid: Joi.number().required(),
  }).options({
    allowUnknown: true,
  }),
};

/**
 * @author 김영우
 * @version 1.0 보스레이드 시작 body 검증
 */
const enterBossRaid = {
  body: Joi.object({
    userId: Joi.number().required(),
    level: Joi.number().required(),
  }),
};

export default {
  endBossRaid,
  getTopRanker,
  enterBossRaid,
};
