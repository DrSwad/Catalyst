const fs = require("fs");
const vscode = require("vscode");
const path = require("path");
const utils = require("./utils");
const pref = require("../preferences");
// add file handeling logic here...

// problemData is object containing scraped problem data from Internet
const saveToCache = (problemData) => {
  // get cache folder root path
  const rootPath = pref.getCacheFolder();

  // get problem name
  // create md5 hash
  // check if filename with this hash exits or not
  // if it doesn't, create and save problem data to file
  const problemPath = utils.getProblemDataPath(problemData, rootPath);
  let jsonData = JSON.stringify(problemData);
  fs.writeFileSync(problemPath, jsonData);

  return problemPath;
};

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const createSourceCodeFile = (problemData) => {
  // getting path
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || !folders.length)
    throw new Error("No workspace is opened!!!");
  const rootPath = folders[0].uri.fsPath; // working directory

  const problemFilePath = utils.getProblemFilePath(problemData);
  if (!fs.existsSync(problemFilePath)) {
    const template = pref.getDefaultTemplate(problemData.language);
    ensureDirectoryExistence(problemFilePath);
    fs.writeFileSync(problemFilePath, template);
  }

  return problemFilePath;
};

module.exports = {
  saveToCache,
  createSourceCodeFile,
  utils,
};
