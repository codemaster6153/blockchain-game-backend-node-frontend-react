const fs = require('fs');
const axios = require('axios');


async function aux() {
  try {
    const response = await axios.get(`http://localhost:3001/api/maze-game/aux`);
    return response.data.id;
  } catch (e) {
    console.error(e.response.data);
  }
}

(async () => {
  const ids = [];
  const frequencies = {};
  for (let i = 0; i < 900; i++) {
    const id = await aux();
    ids.push(id);
    if (frequencies[id]) {
      frequencies[id]++;
    } else {
      frequencies[id] = 1;
    }
  }

  const sortedFrequencies = Object.entries(frequencies).sort((a, b) => b[1] - a[1]);

  const data1 = sortedFrequencies.map(([id, frequency]) => `${id} ${frequency}`).join('\n');
  const data2 = sortedFrequencies.map(([id, frequency]) => frequency).join('\n');

  fs.writeFile('ids_freqs.txt', data1, function (err) {
    if (err) throw err;
    console.log('El archivo "ids_freqs.txt" se ha guardado correctamente.');
  });

  fs.writeFile('freqs.txt', data2, function (err) {
    if (err) throw err;
    console.log('El archivo "freqs.txt" se ha guardado correctamente.');
  });
})();




