const fs = require("fs");
const args = process.argv;
let readPath;
let writePath;
if (args.length === 4) {
  readPath = args[2];
  writePath = args[3];
} else if (args.length === 3) {
  readPath = args[2];
  writePath = minName(args[2]);
} else {
  throw new Error(
    `[-]Please pass the right arguments you enterd ${args.length} argument and you should enter 4 arguments`
  );
}
const compose = (...functions) => (args) =>
  functions.reduceRight((arg, fn) => fn(arg), args);

function minName(name) {
  // this function will add .min before the extention of the file
  for (let i = name.length - 1; i >= 0; i--) {
    if (name[i] === ".") {
      return name.slice(0, i + 1) + "min" + name.slice(i, name.length);
    }
  }
  throw new Error("this file is not supported");
}
function getInput(path) {
  // in this function i will read the files content and return it
  let input = fs.readFileSync(path, "utf8");
  return input;
}
function minfiy(data) {
  // this function is the function that will minfiy the files and it's going to have time complixty of O(n)
  if (typeof data !== "string") {
    return;
  }
  let inString = false;
  let inComment = false;
  let minfiedData = "";
  for (let i = 0; i < data.length; i++) {
    if (inComment) {
      continue;
    }
    if (data[i] === "/") {
      if (data[i + 1] === "/" || data[i + 1] === "*") {
        inComment = true;
        continue;
      }
    }
    // if iam in a string i will not modify the white space in it
    if (data[i] === '"' || data[i] === "'" || data[i] === "`") {
      inString = !inString;
    }
    if (inString) {
      minfiedData += data[i];
      continue;
    }
    if (data[i] === " ") {
      // here i will check if the space is between two letters or between letter and number or two numbers and if it is add it
      if (
        ((data[i - 1] >= "a" && data[i - 1] <= "z") ||
          (data[i - 1] >= "A" && data[i - 1] <= "Z") ||
          (data[i - 1] >= "0" && data[i - 1] <= "9")) &&
        ((data[i + 1] >= "a" && data[i + 1] <= "z") ||
          (data[i + 1] >= "A" && data[i + 1] <= "Z") ||
          (data[i + 1] >= "0" && data[i + 1] <= "9"))
      ) {
        minfiedData += data[i];
        continue;
      } else {
        // if not leave it
        continue;
      }
    }
    if (data[i] === "\n" || data[i] === "\r") {
      if (inComment) {
        inComment = false;
      }
      continue;
    } else {
      minfiedData += data[i];
    }
  }
  return minfiedData;
}
function makeOutput(data, path) {
  fs.writeFileSync(path, data, "utf8");
  return true;
}
function convertBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) {
    return "n/a";
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) {
    return bytes + " " + sizes[i];
  }
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
function getSizeDiffrence(path1Size, path2Size) {
  return `[+] Before {${path1Size}} : After {${path2Size}}`;
}

const getAndMinfyInput = compose(minfiy, getInput);
makeOutput(getAndMinfyInput(readPath), writePath);
// makeOutput(minfiy(getInput(args[2])), args[3]);
console.log(
  getSizeDiffrence(
    convertBytes(fs.statSync(readPath).size),
    convertBytes(fs.statSync(writePath).size)
  )
);
