import { Map, PLANET_ENDPOINT, Operation } from "./types";

export const BASE_API = "https://challenge.crossmint.io/api/";
export const candidateId = "d06f8a01-7a83-4ec1-b99f-40cad85ec178";

/**
 *   Utility function to delay Promises, to prevent
 *   being blocked by the API for sending too many requests.
 */

export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

// Fetching and validating my candidate map.
export async function getCandidateMap(): Promise<Map> {
	return fetch(BASE_API.concat(`map/${candidateId}/goal`), {
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.error) {
				throw new Error(
					"Failed to fetch candidate's map: ".concat(data.statusText)
				);
			} else {
				return data;
			}
		});
}

/**
 *   Change an specific tile on the API map with either POST or DELETE.
 *   Given `row`, `col`, `method`, generic `PLANET_ENDPOINT` variant,
 *   and a `quality` of the Astral Object.
 *
 *   Example:
 *
 *   ```tsx
 *   const response = await performOperation<PLANET_ENDPOINT.POLYANETS>({ row: 0, col: 0 });
 *   ```
 */

export const performOperation = async <
	T extends PLANET_ENDPOINT = PLANET_ENDPOINT.POLYANETS
>({
	method = "POST",
	row,
	col,
	quality,
	planetEndpoint = PLANET_ENDPOINT.POLYANETS,
}: Operation<T>) => {
	let qualityKey = "";

	if (planetEndpoint === PLANET_ENDPOINT.SOLOONS) {
		qualityKey = "color";
	}

	if (planetEndpoint === PLANET_ENDPOINT.COMMETHS) {
		qualityKey = "direction";
	}

	const body = JSON.stringify({
		row,
		column: col,
		candidateId,
		[qualityKey]: quality,
	});

	return fetch(BASE_API.concat(planetEndpoint), {
		method,
		body,
		headers: {
			"Content-Type": "application/json",
		},
	}).then((response) => {
		if (!response.ok) {
			console.error(response);
			console.log(body);
			console.log("Quality: ", quality);
			console.log("Endpoint: ", planetEndpoint);
		} else {
			return response;
		}
	});
};
