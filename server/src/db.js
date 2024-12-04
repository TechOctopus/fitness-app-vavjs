import { Sequelize, DataTypes } from "sequelize";
import pg from "pg";
import { hash } from "./password.js";

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
      type: DataTypes.INTEGER,
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

Method.hasMany(Weight, { foreignKey: "method_id", onDelete: "CASCADE" });
Weight.belongsTo(Method, { foreignKey: "method_id" });

Method.hasMany(Systolic, { foreignKey: "method_id", onDelete: "CASCADE" });
Systolic.belongsTo(Method, { foreignKey: "method_id" });

Method.hasMany(Diastolic, { foreignKey: "method_id", onDelete: "CASCADE" });
Diastolic.belongsTo(Method, { foreignKey: "method_id" });

async function connectToDB() {
  try {
    const client = new pg.Client({
      user: "postgres",
      host: "db",
      database: "postgres",
      password: "postgres",
      port: 5432,
    });

    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS ${database}`);
    await client.query(`CREATE DATABASE ${database}`);
    await client.end();

    await sequelize.authenticate();
    await sequelize.sync();

    await User.create({
      email: "admin",
      name: "admin",
      password: hash("admin"),
      age: 30,
    });

    await Ad.create({
      // License(s): CC-BY 4.0
      image_url:
        "https://opengameart.org/sites/default/files/pixel_art_flat_text_fonts_-_preview.png",
      target_url: "https://opengameart.org/content/pixel-art-flat-text-fonts",
    });

    await Method.create({
      name: "Swimming",
      description: "Swimming in the pool",
    });

    await Method.create({
      name: "Running",
      description: "Running in the park",
    });

    await Method.create({
      name: "Walking",
      description: "Walking in the park",
    });

    await Weight.create({
      date: new Date("2021-01-01"),
      value: 40,
      user_id: 1,
      method_id: 1,
    });

    await Weight.create({
      date: new Date("2002-01-02"),
      value: 20,
      user_id: 1,
      method_id: 1,
    });

    await Weight.create({
      date: new Date("2022-01-03"),
      value: 70,
      user_id: 1,
      method_id: 2,
    });

    await Weight.create({
      date: new Date("2004-01-03"),
      value: 10,
      user_id: 1,
      method_id: 2,
    });

    await Weight.create({
      date: new Date("2008-01-03"),
      value: 22,
      user_id: 1,
      method_id: 1,
    });

    await Weight.create({
      date: new Date("2012-01-03"),
      value: 32,
      user_id: 1,
      method_id: 1,
    });

    await Weight.create({
      date: new Date("2001-01-03"),
      value: 4,
      user_id: 1,
      method_id: 3,
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export {
  sequelize,
  User,
  Method,
  Weight,
  Systolic,
  Diastolic,
  Ad,
  connectToDB,
};
