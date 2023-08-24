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
const Orders = sequelize.define('orders', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: false,
    },
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
})
const Reviews = sequelize.define('reviews', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: Users, // Assuming Users is defined
      key: 'id',
    },
    allowNull: false,
  },
  // productId: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: Products, // Assuming Products is defined
  //     key: 'id',
  //   },
  //   allowNull: false,
  // },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reviewDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
})
Users.hasOne(Profile, { foreignKey: 'userId' })
Profile.belongsTo(Users, { foreignKey: 'userId' })
Users.hasMany(Orders, { foreignKey: 'userId' })
Orders.belongsTo(Users, { foreignKey: 'userId' })
Users.hasMany(Reviews, { foreignKey: 'userId' })
const fetchUserWithProfileById = async (userId) => {
  try {
    const userWithProfile = await Users.findOne({
      where: { id: userId },
      include: [
        {
          model: Profile,
          required: false, // This makes it a LEFT JOIN
        },
      ],
    })

    if (!userWithProfile) {
      throw new Error('User not found')
    }

    return userWithProfile.toJSON()
  } catch (error) {
    console.error('Error fetching user with profile:', error)
    throw error
  }
}
const fetchUserWithOrdersById = async (userId) => {
  try {
    const userWithOrders = await Users.findOne({
      where: { id: userId },
      include: [
        {
          model: Orders, // Replace with your Orders model
          required: false, // This makes it a LEFT JOIN
        },
      ],
    })

    if (!userWithOrders) {
      throw new Error('User not found')
    }

    return userWithOrders.toJSON()
  } catch (error) {
    console.error('Error fetching user with orders:', error)
    throw error
  }
}

module.exports = {
  Users,
  Profile,
  sequelize,
  fetchUserWithProfileById,
  Orders,
  fetchUserWithOrdersById,
}
