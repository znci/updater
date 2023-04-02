const fetch = require("node-fetch");
require("dotenv").config();

class InformationFileSyntaxException extends Error {
  constructor(message) {
    super(message);
    this.name = "InformationFileSyntaxException";
  }
}

function isValidNumber(value) {
  return Number.isInteger(Number(value));
}

function parseValueAsArray(value) {
  value = value.substring(1, value.length - 1); // remove brackets
  value = value.split(",").map((v) => v.trim()); // split by comma and trim whitespace

  if (value.some((v) => v.startsWith('"') && v.endsWith('"'))) {
    value = value.map((v) => v.substring(1, v.length - 1)); // remove quotes
  } else if (value.some((v) => isValidNumber(v))) {
    value = value.map((v) => Number(v)); // convert to numbers
  } else {
    throw new InformationFileSyntaxException(
      `Array value for key with identifier '${key}' malformed.`
    );
  }

  return value;
}

function parseValueAsString(value) {
  return value.substring(1, value.length - 1);
}

function getDataAsObject(data) {
  let lines = data.split("\n");
  let obj = {};

  lines.forEach((line) => {
    if (line.startsWith("#")) return; // ignore comments
    if (line.trim() === "") return; // ignore empty lines
    if (!line.includes("=")) return; // ignore lines without an equal sign

    let [key, ...value] = line.split("=");
    value = value.join("=");

    if(key === "PRIVATE" && value === 0) {
      if (value.trim() === "") return; // ignore lines without a value

      if (value.startsWith("[") && value.endsWith("]")) {
        value = parseValueAsArray(value);
      } else if (isValidNumber(value)) {
        value = Number(value);
      } else if (value.startsWith('"') && value.endsWith('"')) {
        value = parseValueAsString(value);
      } else {
        throw new InformationFileSyntaxException(
          `Value for key with identifier '${key}' malformed.`
        );
      }
    }

    obj[key] = value;
  });

  return obj;
}

// Backend

const { kelp } = require("./kelp");

kelp.settings({
  PORT: 9102,
  OPTIONS: ["body-parser", "cors", "ejs", "public", "routes"],
})

kelp.listen();

var cached = [];
function cache() {
  fetch("https://api.github.com/users/znci/repos?token=" + process.env.GITHUB_TOKEN)
  .then((res) => res.json())
  .then((json) => {
    json.forEach(async (element) => {
      let request = await fetch(
        `https://raw.githubusercontent.com/znci/${element.name}/main/.znci`
      );

      if (request.status === 200) {
        let data = await request.text();
        let obj = await getDataAsObject(data);

        if (obj) {
          cached.push(obj);
        }

      }
    });
    console.log(cached);
  });
};

exports.cache = cache;
exports.cached = cached;

cache();
setInterval(() => {
  cached = [];
  cache();
}, 30000);