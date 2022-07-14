import { logger } from '../../config/winston.js';
import getStaticData from '../../modules/static-data.js';
import checkExpired from '../../modules/time.js';
import BossRaid from '../../models/bossraid.js';
import BossRaidRecord from '../../models/bossraid-record.js';
import User from '../../models/user.js';
import enterCheck from '../../modules/enter-check.js';
import statusCode from '../../utils/status-code.js';
import message from '../../utils/response-message.js';
import { errResponse, response } from '../../utils/response.js';
import { getRankingData } from '../../modules/ranking-data.js';

const endBossRaid = async (userId, bossRaidRecordId, isSolved, reqTime) => {
  try {
    let staticData = await getStaticData();
    staticData = JSON.parse(staticData);

    const { bossRaidLimitSeconds } = staticData;

    const data = await BossRaidRecord.findOne({
      where: {
        bossraid_id: bossRaidRecordId,
      },
      include: {
        model: BossRaid,
        attributes: ['user_id', 'level'],
      },
      attributes: ['bossraid_id', 'enter_time', 'end_time'],
    });

    const bossRaidRecordUserId = data.BOSSRAID['user_id'];
    if (bossRaidRecordUserId !== userId) {
      return [
        statusCode.BAD_REQUEST,
        errResponse(statusCode.BAD_REQUEST, message.NOT_USER_RAIDRECORDID),
      ];
    }

    const endTime = data.getDataValue('end_time');
    if (endTime) {
      return [
        statusCode.BAD_REQUEST,
        errResponse(statusCode.BAD_REQUEST, message.ALREADY_END_RAIDRECORDID),
      ];
    }

    const enterTime = data.getDataValue('enter_time');

    const isExpired = checkExpired(enterTime, reqTime, bossRaidLimitSeconds);
    if (isExpired) {
      return [
        statusCode.BAD_REQUEST,
        errResponse(statusCode.BAD_REQUEST, message.EXPIRED_RAIDRECORDID),
      ];
    }

    const level = data.BOSSRAID['level'];
    let score = 0;

    if (isSolved) {
      score = staticData.levels[level].score;
    }

    const allBossRiadData = await BossRaid.findAll({
      attributes: ['id'],
    });

    const bossRaidIds = allBossRiadData.map((item) => item.getDataValue('id'));

    await BossRaidRecord.update(
      {
        endTime: reqTime,
        score,
      },
      {
        where: { id: bossRaidRecordId },
      },
    );

    await BossRaid.update(
      {
        canEnter: true,
        enteredUserId: null,
      },
      {
        where: {
          id: bossRaidIds,
        },
      },
    );

    return [statusCode.OK, response(statusCode.NO_CONTENT, message.SUCCESS)];
  } catch (error) {
    logger.error(`endBossRaid Service Err: ${error}`);
    return [
      statusCode.DB_ERROR,
      errResponse(statusCode.DB_ERROR, message.INTERNAL_SERVER_ERROR),
    ];
  }
};

const bossRaidInfo = async (req) => {
  /**
   * @author 박성용
   * @version 1.0 22.07.12 보스레이드 정보 조회 기능
   */
  try {
    let bossRaidInfo = await BossRaid.findAll();

    let canEnter, enteredUserId;

    for (const key in bossRaidInfo) {
      enteredUserId = bossRaidInfo[key].enteredUserId;

      // 현재 입장한 유저가 없으면 입장 가능
      if (!enteredUserId) {
        canEnter = bossRaidInfo[key]['canEnter'] = enterCheck(1);
      } else {
        canEnter = bossRaidInfo[key]['canEnter'] = enterCheck(0);
      }
    }
    const data = {
      canEnter: canEnter,
      enteredUserId: enteredUserId,
    };

    // 성공시
    return response(statusCode.OK, message.SUCCESS, data);
  } catch (err) {
    return errResponse(statusCode.BAD_REQUEST, message.BAD_REQUEST);
  }
};

/**
 * @author 김영우
 * @version 1.0 보스레이드 시작 기능
 */
const enterBossRaid = async (userId, level) => {
  try {
    const bossRaids = await BossRaid.findAll();
    // 보스레이드중인지 검증
    const isEnter = bossRaids.filter(
      (bossRaid) =>
        bossRaid.enteredUserId !== null && bossRaid.canEnter !== true,
    )[0];
    if (isEnter) {
      return [statusCode.OK, response(statusCode.OK, { isEntered: false })];
    }

    const bossRaid = await BossRaid.create({
      user_id: userId,
      level,
      canEnter: false,
      enteredUserId: userId,
    });

    await BossRaidRecord.create({
      bossraid_id: bossRaid.id,
    });

    const data = {
      isEntered: true,
      raidRecordId: bossRaid.id,
    };
    return [
      statusCode.CREATED,
      response(statusCode.CREATED, message.SUCCESS, data),
    ];
  } catch (err) {
    console.error(err);
    return [
      statusCode.INTERNAL_SERVER_ERROR,
      errResponse(
        statusCode.INTERNAL_SERVER_ERROR,
        message.INTERNAL_SERVER_ERROR,
      ),
    ];
  }
};

const getTopRanker = async (userId) => {
  try {
    const isExistUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!isExistUser) {
      return [
        statusCode.BAD_REQUEST,
        errResponse(statusCode.BAD_REQUEST, message.BAD_REQUEST),
      ];
    }

    const rankingData = await getRankingData(userId);

    return [
      statusCode.OK,
      errResponse(statusCode.OK, message.SUCCESS, rankingData),
    ];
  } catch (error) {
    logger.error(`getTopRanker Service Err: ${error}`);
    return [
      statusCode.DB_ERROR,
      errResponse(statusCode.DB_ERROR, message.INTERNAL_SERVER_ERROR),
    ];
  }
};

export default {
  endBossRaid,
  bossRaidInfo,
  enterBossRaid,
  getTopRanker,
};
