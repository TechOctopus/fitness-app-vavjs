import { Sequelize, DataTypes } from "sequelize";

const database = "app";
const user = "postgres";
const password = "postgres";

const sequelize = new Sequelize(database, user, password, {
  host: "db",
  dialect: "postgres",
});

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    tableName: "users",
  }
);

const Method = sequelize.define(
  "Method",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "methods",
  }
);

const Measurement = sequelize.define(
  "Measurement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
    },
    method_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "methods",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "measurements",
  }
);

const Ad = sequelize.define(
  "Ad",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    target_url: {
      type: DataTypes.STRING,
    },
    click_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "ads",
  }
);

User.hasMany(Measurement, { foreignKey: "user_id" });
Measurement.belongsTo(User, { foreignKey: "user_id" });

Method.hasMany(Measurement, { foreignKey: "method_id" });
Measurement.belongsTo(Method, { foreignKey: "method_id" });

async function connect() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // create admin user if not exists
    const admin = await User.findOne({ where: { email: "admin@localhost" } });
    if (!admin) {
      await User.create({
        email: "admin@localhost",
        name: "admin",
        password: "admin",
        age: 30,
      });
    }
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { sequelize, User, Method, Measurement, Ad, connect };
