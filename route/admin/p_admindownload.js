module.exports = async function p_login(req, res, User) {
  if (!req.session.adminusername) {
    res.json({ status: 0 });
    return
  }
  async function wait(c) {
    setTimeout(() => {
      console.log("sa");
    }, c * 1000);
  }
  var os = require("os");
  const { zip } = require("zip-a-folder");
  var dir = __dirname.replace("\\route\\admin", "");

  if (req.connection.remoteAddress != `::1`)
    dir = __dirname.replace("/route/admin", "");

  console.log(`DIR_AFTER_CONTROL: ${dir}`);
  let date = Date.now();
  var fileName = `backup_${date}.zip`;
  var zipFile = `${dir}/${fileName}`;
  var zipFileName = `${fileName}`;
  class TestMe {
    static async main() {
      await zip(`${dir}/forbidden`, zipFile);
    }
  }
  try {
    await TestMe.main();
    res.download(zipFile, zipFileName);
  } catch (error) {
    console.log("THERE_IS_DOWNLOAD_ERROR");
  }
};
