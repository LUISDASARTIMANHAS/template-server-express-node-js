const fs = require("fs");

// example: const data = fopen("./data.json")
function fopen(filePath) {
    const database = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(database);

    return data;
}

// example: fwrite("./data.json", data)
function fwrite(filePath, data) {
    const formatData = JSON.stringify(data, null, 2)
    fs.writeFileSync(filePath, formatData, "utf8");
    return true;
}

module.exports = { fopen, fwrite };