const fetch = require("node-fetch");

class InformationFileSyntaxException extends Error {
  constructor(message) {
    super(message);
    this.name = "InformationFileSyntaxException";
  }
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

function isValidNumber(value) {
  return Number.isInteger(Number(value));
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

    if (value.trim() === "") return; // ignore lines without a value

    console.log(`Key: ${key}, Value: ${value}`);

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

    obj[key] = value;
  });

  return obj;
}

fetch("https://api.github.com/users/znci/repos")
  .then((res) => res.json())
  .then((json) => {
    json.forEach(async (element) => {
      let request = await fetch(
        `https://raw.githubusercontent.com/znci/${element.name}/main/.znci`
      );

      if (request.status === 200) {
        let data = await request.text();
        let obj = getDataAsObject(data);

        console.log(obj);
      }
    });
  });
