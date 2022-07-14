import sequelize from 'sequelize';
import redisClient from '../config/redis.js';
import BossRaidRecord from '../models/bossraid-record.js';
import BossRaid from '../models/bossraid.js';
import { rainkingDataKey } from '../utils/constants.js';

const getRankingData = async (userId) => {
  const topRankerInfo = await getTopRankerInfo();
  const myRankingInfo = getMyRankingInfo(topRankerInfo, userId);

  return {
    topRankerInfo,
    myRankingInfo,
  };
};

/*
  Top ranking data 가져오기
  1. 캐시 여부 확인
  2.1. 캐시가 있다면 레디스에 캐싱된 정보 반환
  2.2. 캐시가 없다면 랭킹 구한 후 캐싱 및 반환
*/
const getTopRankerInfo = async (userId) => {
  let topRankerInfo;

  const isCached = await redisClient.exists(rainkingDataKey);
  if (isCached) {
    topRankerInfo = await redisClient.get(rainkingDataKey);
  } else {
    topRankerInfo = await cachingTopRankerInfo(userId);
  }

  return JSON.parse(topRankerInfo);
};

const cachingTopRankerInfo = async (userId) => {
  let topRankerInfo = await BossRaidRecord.findAll({
    raw: true,
    attributes: [
      [
        sequelize.cast(sequelize.fn('sum', sequelize.col('score')), 'float'),
        'totalScore',
      ],
      [sequelize.cast(sequelize.col('user_id'), 'float'), 'userId'],
    ],
    include: {
      model: BossRaid,
      attributes: [],
    },
    group: 'user_id',
    limit: 5,
  });

  topRankerInfo.forEach((item, index) => {
    const isUserId = item.userId === parseInt(userId);

    item.isUserId = isUserId;
    item.ranking = index;
  });

  topRankerInfo = JSON.stringify(topRankerInfo);

  await redisClient.set(rainkingDataKey, topRankerInfo, 'EX', 60 * 60);
  return topRankerInfo;
};

const getMyRankingInfo = (topRankerInfo, userId) => {
  const myRankingInfo = topRankerInfo.filter(
    (item) => item['userId'] === parseInt(userId),
  );

  let filteredMyRankingInfo = null;

  if (myRankingInfo.length > 0) {
    filteredMyRankingInfo = {
      ranking: myRankingInfo[0].ranking,
      totalScore: myRankingInfo[0].totalScore,
    };
  }

  return filteredMyRankingInfo;
};

export { getRankingData, cachingTopRankerInfo };
