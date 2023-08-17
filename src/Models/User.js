const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize(
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
)

const Users = sequelize.define('users', {
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
const Profile = sequelize.define('profile', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
    unique: true,
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

Users.hasOne(Profile, { foreignKey: 'userId' })
Profile.belongsTo(Users, { foreignKey: 'userId' })

module.exports = { Users, Profile, sequelize }
