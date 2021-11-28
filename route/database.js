console.clear();

var { User, Count } = require("../models/models");
var mongoose = require('mongoose');

const countObj = {
    userCount: 1,
    gameCount: 1,
    reportCount: 1
}
var { getAndIncreaseCount } = require("../lib/tools.js");
const uri =
    "mongodb+srv://" +
    process.env.DBUSERNAME +
    ":" +
    process.env.DBUSERPASS +
    "@cluster0.k4rvg.mongodb.net/" +
    process.env.DBNAME +
    "?retryWrites=true&w=majority";

// setInterval(()=>{
//    console.log('im the interval on server side')
// },1000)

var db = mongoose
    .connect(uri, {})
    .then(async (result) => {
        console.log("Connected to MongoDB");
        let c = await Count.findOne();
        if (!c) {
            let count = new Count(countObj).save().then(_res => {
                if (_res)
                    console.log('"Counts" created successfuly');
                else
                    console.log('There is an error while creating "Counts".');
            })
        }

        let firstUser = await User.findOne({ username: 'kaan' });
        if (!firstUser) {
            var userObj = {
                userid: 1,
                email: `kaan@mail.com`,
                fullname: `Kaan`,
                username: `kaan`,
                userpass: `$2b$10$bhUSxlCS7QMYXFEcvvUX6erLLnEOOAiYAeWp2FHcddIspSa8d7kzu`,
                suspend: false,
                verified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            let user = new User(userObj)
                .save()
                .then(async (result) => {
                    await getAndIncreaseCount("userCount");
                    console.log("CREATED_USER");
                })
                .catch((err) => {
                    console.log("\nCREATED_USER_ERROR\n", err);
                });
        } else {
            console.log("ALREADY_HAS_USER");
        }
    }).catch((err) => {
        console.log("db error");
        console.log(err);
        return;
    });



// //   var userObj = {
// //     userid: countObj.users,
// //     email: `kaan@mail.com`,
// //     fullname: `Kaan`,
// //     username: `kaan`,
// //     userpass: `$2b$10$bhUSxlCS7QMYXFEcvvUX6erLLnEOOAiYAeWp2FHcddIspSa8d7kzu`,
// //     biography: "",
// //     visibility: true,
// //     suspend: false,
// //     verified: true,
// //     createdAt: new Date(),
// //     updatedAt: new Date(),
// //   };
// //   let user = new User(userObj)
// //     .save()
// //     .then(async (result) => {
// //       await getAndIncreaseCount("users");
// //       console.log("CREATED_USER");
// //     })
// //     .catch((err) => {
// //       console.log("ALREADY_HAS_USER");
// //     });
// //   await new Count(countObj)
// //     .save()
// //     .then((res) => {
// //       console.log("\nCREATED_COUNTS");
// //     })
// //     .catch((err) => {
// //       console.log("\nALREADY_HAS_COUNTS");
// //     });

// //   let admin = new Admin({
// //     adminuserid: countObj.users,
// //     adminusername: `kaan`,
// //     adminuserpass: `$2b$10$bhUSxlCS7QMYXFEcvvUX6erLLnEOOAiYAeWp2FHcddIspSa8d7kzu`,
// //   })
// //     .save()
// //     .then((res) => {
// //       console.log("CREATED_ADMIN");
// //     })
// //     .catch((err) => {
// //       console.log("ALREADY_HAS_ADMIN");
// //     });
// })
// .catch((err) => {
//   console.log("db error");
//   console.log(err);
//   return;
// });