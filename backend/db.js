const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://admin:admin3012@ac-vk04pt4-shard-00-00.eblkogj.mongodb.net:27017,ac-vk04pt4-shard-00-01.eblkogj.mongodb.net:27017,ac-vk04pt4-shard-00-02.eblkogj.mongodb.net:27017/?ssl=true&replicaSet=atlas-5e64yy-shard-0&authSource=admin&appName=Cluster0"
    );

    console.log("MongoDB Atlas Connected ✅");
  } catch (error) {
    console.error("DB Error:", error);
  }
};

module.exports = connectDB;