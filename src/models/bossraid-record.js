import { DataTypes, Model } from 'sequelize';

class BossraidRecord extends Model {
  static init(sequelize) {
    return super.init(
      {
        score: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        enterTime: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        endTime: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'BOSSRAID_RECORD',
        tableName: 'BOSSRAID_RECORD',
        charset: 'utf8mb4', //이모지 가능
        collate: 'utf8mb4_general_ci', //한글 저장되도록
        freezeTableName: true, //테이블명 이름 그대로 사용
        timestamps: true, //createdAt, updatedAt 컬럼 자동 추가
        underscored: true, //컬럼명 스네이크 형식으로 변경
      },
    );
  }

  static associate(db) {
    db.BossraidRecord.belongsTo(db.Bossraid, {
      foreignKey: 'bossraid_id',
      allowNull: false,
    });
  }
}

export default BossraidRecord;
