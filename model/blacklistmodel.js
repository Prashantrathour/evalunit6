const mongoose = require("mongoose");
const blacklist = mongoose.Schema({
  token: [String]
 
});

const blacklistmodel = mongoose.model("blacklist", blacklist);
module.exports = { blacklistmodel };
