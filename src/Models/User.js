const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(
  'postgresql://postgres:admin@144.126.238.113:5432/postgres'
)

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // By default, users are not admins
  },
})
const Profile = sequelize.define('Profile', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  allergies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  skinInfo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hairInfo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  annualIncome: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ethnicity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isCollegeGraduate: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
})

User.hasOne(Profile, { foreignKey: 'userId' })
Profile.belongsTo(User, { foreignKey: 'userId' })

module.exports = { User, Profile, sequelize }
