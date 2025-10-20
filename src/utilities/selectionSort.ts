import type { moveType } from "../App";

export const getSelectionSortMoves = (arrayNumbers: number[]): moveType[] => {
	console.log(arrayNumbers);
	const moves: moveType[] = [];
	for (let i = 0; i < arrayNumbers.length - 1; i++) {
		let minNumberIdx = i;
		for (let j = i + 1; j < arrayNumbers.length; j++) {
			const move: moveType = {
				moveType: "compare",
				firstIdx: minNumberIdx,
				secondIdx: j,
			};
			moves.push(move);
			if (arrayNumbers[minNumberIdx] > arrayNumbers[j]) {
				minNumberIdx = j;
			}
		}
		[arrayNumbers[minNumberIdx], arrayNumbers[i]] = [
			arrayNumbers[i],
			arrayNumbers[minNumberIdx],
		];
		const move: moveType = {
			moveType: "swap",
			firstIdx: minNumberIdx,
			secondIdx: i,
		};
		moves.push(move);
	}
	return moves;
};
