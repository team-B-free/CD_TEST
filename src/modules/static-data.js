import fetch from 'node-fetch';
import redisClient from '../config/redis.js';
import { staticDataKey } from '../utils/constants.js';

/*
  static data 가져오기
  1. 캐시 여부 확인
  2.1. 캐시가 있다면 레디스에 캐싱된 정보 반환
  2.2. 캐시가 없다면 s3 접근해서 정보 가져온 후 캐싱 및 반환
 */
const getStaticData = async () => {
  let staticData;

  const isCached = await redisClient.exists(staticDataKey);
  if (isCached) {
    console.log('캐싱된 데이터 가져오기');

    staticData = await redisClient.get(staticDataKey);
  } else {
    console.log('s3  접근');

    staticData = await getStaticDataFromS3();
    staticData = JSON.stringify(staticData);
    await redisClient.set(staticDataKey, staticData, 'EX', 60 * 60 * 24 * 30);
  }

  return staticData;
};

const getStaticDataFromS3 = async () => {
  try {
    const s3URL =
      'https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json';

    const response = await fetch(s3URL, {
      method: 'GET',
    });

    const data = await response.json();

    return data.bossRaids[0];
  } catch (error) {
    console.log(`getStaticDataFromS3 Err: ${error}`);
  }
};

export default getStaticData;
