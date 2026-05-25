// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     // console.log(
//     //   process.env.MONGO_URI
//     //     ? process.env.MONGO_URI
//     //     : "MONGO_URI is not defined",
//     // );
//     // const conn = await mongoose.connect(process.env.MONGO_URI, {
//     //   useNewUrlParser: true,
//     //   useUnifiedTopology: true,
//     // });
//     const conn = await mongoose
//       .connect(process.env.MONGO_URI)
//       .then(() => {
//         console.log("MongoDB Connected");
//       })
//       .catch((err) => {
//         console.error(`Error: ${err.message}`);
//         process.exit(1);
//       });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
