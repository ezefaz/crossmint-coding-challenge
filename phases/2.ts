import { getCandidateMap, performOperation, delay } from "../utils";
import { PLANET_ENDPOINT, Quality, TILE } from "../types";

// 1 - Get my map
const { goal } = await getCandidateMap();

// 2 - Parse my map and iterate the array of promises
for (let row = 0; row < goal.length; row++) {
	for (let col = 0; col < goal[row].length; col++) {
		//  skip spaces
		if (goal[row][col] === TILE.SPACE) continue;

		// type-cast from a string to enum
		const fullTile = goal[row][col] as TILE;

		// since Polyanet is the only Tile without a quality
		// it will be handled here and `continue` the loop
		if (fullTile === TILE.POLYANET) {
			await performOperation({ row, col });
			await delay(700);
			continue;
		}

		// handle comeths and saloons, `split` will always work, type-safe
		// separate quality (up, down, red, etc) from tile (soloon, cometh)
		// type-cast the strings into it's corresponding Enum variant.
		const [quality, planet] = fullTile.split("_");
		const parsedPlanet = planet.toLowerCase().concat("s") as PLANET_ENDPOINT;

		await performOperation<typeof parsedPlanet>({
			row,
			col,
			quality: quality.toLowerCase() as Quality<typeof parsedPlanet>,
			planetEndpoint: parsedPlanet,
		});

		// wait a while to not get blocked by the API
		await delay(700);
	}
}

console.log("Finished!");
