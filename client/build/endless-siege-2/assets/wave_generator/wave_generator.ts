const fs = require("fs-extra");

generateWave(0.15);

let waves = [];

function generateWave(value) {

    fs.readFile("./waves.json", "utf8", function read(err, data) {

        if (err) {
            console.log(err);
            return;
        }

        data = JSON.parse(data);

        data.forEach(element => {
            for (let i = 1; i < 61; ++i) {

                if (element["wave_" + i]) {

                    let newLength = element["wave_" + i].enemies.length - Math.floor(element["wave_" + i].enemies.length * value);
                    
                    console.log(element["wave_" + i].enemies.length, newLength);
                    while (element["wave_" + i].enemies.length > newLength) {
                        element["wave_" + i].enemies.pop();
                    }
                }
            }
        });

        fs.writeFile("./new_waves.json", JSON.stringify(data), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Waves created!");
        });
    });
}
