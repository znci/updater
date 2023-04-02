const fetch = require("node-fetch");

function findVersion(data) {
	return new Promise((resolve, reject) => {
		const newLine = data.split("\n");
		newLine.forEach(v => {
			const split = v.split("=");
			const keyword = split[0];
			const value = split[1];
			resolve(value);
		})
	})
}

fetch("https://api.github.com/users/znci/repos").then(res => res.json()).then(json => {
	json.forEach(element => {
		let index = 0;
		fetch(`https://raw.githubusercontent.com/znci/${element.name}/main/.znci`).then(res => res.text()).then(data => {
			findVersion(data).then(version => {
				if(version) {
					console.log(`${element.name} - ${version}`);
				}
			})
		})
	});
})