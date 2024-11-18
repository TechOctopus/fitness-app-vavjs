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

const Weight = sequelize.define(
  "Weight",
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
    tableName: "weights",
  }
);

const Systolic = sequelize.define(
  "Systolic",
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
      type: DataTypes.INTEGER,
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
    tableName: "systolics",
  }
);

const Diastolic = sequelize.define(
  "Diastolic",
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
      type: DataTypes.INTEGER,
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
    tableName: "diastolics",
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

User.hasMany(Weight, { foreignKey: "user_id" });
Weight.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Systolic, { foreignKey: "user_id" });
Systolic.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Diastolic, { foreignKey: "user_id" });
Diastolic.belongsTo(User, { foreignKey: "user_id" });

Method.hasMany(Weight, { foreignKey: "method_id" });
Weight.belongsTo(Method, { foreignKey: "method_id" });

Method.hasMany(Systolic, { foreignKey: "method_id" });
Systolic.belongsTo(Method, { foreignKey: "method_id" });

Method.hasMany(Diastolic, { foreignKey: "method_id" });
Diastolic.belongsTo(Method, { foreignKey: "method_id" });

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

export { sequelize, User, Method, Weight, Systolic, Diastolic, Ad, connect };
