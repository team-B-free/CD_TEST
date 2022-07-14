import moment from 'moment';
import bossRaidService from '../../services/bossraid/bossraid-service.js';

const endBossRaid = async (req, res) => {
  const reqTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const { userId, raidRecordId: bossRaidRecordId, isSolved } = req.body;

  const [statusCode, result] = await bossRaidService.endBossRaid(
    userId,
    bossRaidRecordId,
    isSolved,
    reqTime,
  );

  return res.status(statusCode).send(result);
};

const getBossRaidInfo = async () => {
  /**
   * @author 박성용
   * @version 1.0 22.07.12 보스레이드 정보 조회 기능
   *
   */
  const bossRaidInfoData = await bossRaidService.bossRaidInfo();
  return res.status(bossRaidInfoData.status).send(bossRaidInfoData);
};

/**
 * @author 김영우
 * @version 1.0 보스레이드 시작 기능
 */
const enterBossRaid = async (req, res, next) => {
  const { userId, level } = req.body;

  const [statusCode, result] = await bossRaidService.enterBossRaid(
    userId,
    level,
  );

  return res.status(statusCode).json(result);
};

const getTopRanker = async (req, res) => {
  const { userid: userId } = req.headers;

  const [statusCode, result] = await bossRaidService.getTopRanker(userId);

  return res.status(statusCode).send(result);
};

export default {
  endBossRaid,
  getBossRaidInfo,
  enterBossRaid,
  getTopRanker,
};
