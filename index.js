const fetch = require("node-fetch");

class InformationFileSyntaxException extends Error {
  constructor(message) {
    super(message);
    this.name = "InformationFileSyntaxException";
  }
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

    if (!value.startsWith('"') || !value.endsWith('"')) {
      throw new InformationFileSyntaxException(
        `Value for key with identifier '${key}' is not a valid string (missing quotes at beginning or end).`
      );
    }

    if (value.length < 2) {
      throw new InformationFileSyntaxException(
        `Key with identifier '${key}' has no recognized value.`
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
