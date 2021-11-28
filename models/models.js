const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fs = require("fs");

var countObj = { users: 1, posts: 1, reports: 1 };
const userSchema = new Schema({
  userid: {
    type: Number,
    require: true,
    unique: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  userpass: {
    type: String,
    require: true,
  },
  fullname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  suspend: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

const matchSchema = new Schema({
  matchid: {
    type: Number,
    required: true,
    unique: true
  },
  users: {
    type: String,
    required: true,
    unique: false
  },
  gameMode: {
    type: String,
    required: true,
    unique: false
  },
  gameEnd:{
    type: Boolean,
    required: true,
    default: false
  },
  winner: {
    type: Number,
    required: false,
    default: null
  },
  onlyAgainstComputer:{
    type: Boolean,
    required: false,
  },
  
  createdAt: {
    type: Date,
    required: false
  }
});
const Match = mongoose.model("Match", matchSchema);

const postSchema = new Schema({
  userid: {
    type: Number,
    required: true,
    unique: false,
  },
  postid: {
    type: Number,
    required: true,
    unique: true,
  },
  hashedpostid: {
    type: String,
    required: true,
    unique: true,
  },
  article: {
    type: String,
    required: false,
  },
  attacments: {
    type: Array,
    required: false,
    default: [],
  },
  visibility: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

const Post = mongoose.model("Post", postSchema);

const utmSchema = new Schema(
  {
    fromwhere: {
      type: String,
      require: true,
      unique: false,
    },
    whoadded: {
      type: String,
      require: true,
    },
    whichsite: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const UTM = mongoose.model("utm", utmSchema);

const reportSchema = new Schema(
  {
    reportid: {
      type: Number,
      required: true,
      unique: true,
    },
    userid: {
      type: String,
      require: true,
    },
    postid: {
      type: String,
      require: true,
    },
    reportnumber: {
      type: Number,
      required: true,
    },
    reporttext: {
      type: String,
      required: true,
    },
    reportlang: {
      type: String,
      required: false,
    },
    status: {
      default: 0,
      // 0 => not looked
      // 1 => accepted      -send notif to who reported-    -suspend post, or delete-
      // 2 => not accepted  -send notif to who reported-
    },
  },
  {
    timestamps: true,
  }
);
const Report = mongoose.model("Report", reportSchema);

const countSchema = new Schema({
  userCount: {
    type: Number,
    unique: true,
    default: countObj.users,
  },
  gameCount: {
    type: Number,
    unique: true,
    default: countObj.posts,
  },
  reportCount: {
    type: Number,
    unique: true,
    default: countObj.reports,
  },
});

const Count = mongoose.model("Count", countSchema);

const adminSchema = new Schema({
  adminuserid: {
    type: Number,
    require: true,
    unique: true,
  },
  adminusername: {
    type: String,
    require: true,
    unique: true,
  },
  adminuserpass: {
    type: String,
    require: true,
  },
});
const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  User,
  Post,
  UTM,
  Report,
  Admin,
  Count,
  Match
};


// createFolders();
// createFolders();
// // createFolders();
// var pathname = userpath + countObj.users;
// if (!fs.existsSync(pathname)) {
//   fs.mkdir(pathname, async (err) => {
//     if (err) console.log(err);
//   });
//   var files = ["profile", "blocked", "notifications", "liked", "saved"];
//   var userObjs = [
//     {
//       userid: countObj.users,
//       followers: {
//         c: 0,
//         who: [],
//       },
//       following: {
//         c: 0,
//         who: [],
//       },
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     [],
//     [],
//     [],
//     [],
//   ];
//   files.forEach((file, index) => {
//     let fullpathname = pathname + "/" + file + ".json";
//     fs.writeFile(fullpathname, JSON.stringify(userObjs[index]), (err) => {
//       if (err) console.log(`blogs.js line283 => ${err}`);
//       else {
//         console.log(`${file} created.`);
//       }
//     });
//   });
// }


// async function getCount() {
//   let count = await Count.find({});
//   return count;
// }
// async function createFolders() {
//   console.log(`\nCREATE_FOLDER\n`);
//   const paths = ["forbidden/", "forbidden/posts/", "forbidden/users/"];
//   let dir = __dirname.replace("\\lib", "\\");
//   paths.forEach(async (_path, i) => {
//     if (!fs.existsSync(_path)) {
//       await fs.promises.mkdir(_path);
//     }
//   });
// }