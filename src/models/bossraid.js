import { DataTypes, Model } from 'sequelize';

class Bossraid extends Model {
  static init(sequelize) {
    return super.init(
      {
        canEnter: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        enteredUserId: {
          type: DataTypes.INTEGER,
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        boss: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '운영자 보스',
        },
      },
      {
        sequelize,
        modelName: 'BOSSRAID',
        tableName: 'BOSSRAID',
        charset: 'utf8mb4', //이모지 가능
        collate: 'utf8mb4_general_ci', //한글 저장되도록
        freezeTableName: true, //테이블명 이름 그대로 사용
        timestamps: true, //createdAt, updatedAt 컬럼 자동 추가
        underscored: true, //컬럼명 스네이크 형식으로 변경
      },
    );
  }

  static associate(db) {
    db.Bossraid.hasMany(db.BossraidRecord, {
      foreignKey: 'bossraid_id',
      allowNull: false,
    });
    db.Bossraid.belongsTo(db.User, {
      foreignKey: 'user_id',
      allowNull: false,
    });
  }
}

export default Bossraid;
