require("dotenv").config();
const {
  readInput,
  inquirerMenu,
  pause,
  listPlaces,
} = require("./helpers/inquirer");
const Searches = require("./models/searches");
const main = async () => {
  const searches = new Searches();

  let opt;
  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        const term = await readInput("City: ");
        const places = await searches.city(term);

        const id = await listPlaces(places);
        if (id === "0") continue;

        const placeSelect = places.find((l) => l.id === id);

        searches.addHistory(placeSelect.name);
        const weather = await searches.weatherPlace(
          placeSelect.lat,
          placeSelect.lng
        );
        console.clear();
        console.log("\nInformation of the city\n".green);
        console.log("City", placeSelect.name);
        console.log("Lat", placeSelect.lat);
        console.log("Lng", placeSelect.lng);
        console.log("Temperature", weather.temp);
        console.log("Max", weather.max);
        console.log("Min", weather.min);
        console.log("what's the weather like ", weather.desc.green);

        break;
      case 2:
        searches.historyCapitalize.forEach((element, index) => {
          const idx = `${index + 1}.`.red;
          console.log(`${idx} ${element}`);
        });
        break;
      case 0:
        break;
    }

    if (opt !== 0) await pause();
  } while (opt !== 0);
};

main();
