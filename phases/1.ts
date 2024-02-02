import { performOperation, getCandidateMap, delay } from "../utils";
import { PLANET_ENDPOINT, TILE } from "../types";

// 1 - Get my map
const { goal } = await getCandidateMap();

console.log("GOAL -->", goal);

// 2 - Parse my map and iterate the array of promises
for (let row = 0; row < goal.length; row++) {
	for (let col = 0; col < goal[row].length; col++) {
		if (goal[row][col] === TILE.POLYANET) {
			await performOperation<PLANET_ENDPOINT.POLYANETS>({
				row,
				col,
			});
			// wait a while to not get blocked by the API
			await delay(1000);
		}
	}
}

console.log("Finished!");
