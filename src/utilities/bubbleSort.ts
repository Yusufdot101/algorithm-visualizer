import type { moveType } from "../App";

export const getBubbleSortMoves = (arrayNumbers: number[]): moveType[] => {
	const moves: moveType[] = [];
	for (let i = 0; i < arrayNumbers.length - 1; i++) {
		for (let j = 0; j < arrayNumbers.length - i - 1; j++) {
			const move: moveType = {
				moveType: "compare",
				firstIdx: j,
				secondIdx: j + 1,
			};
			moves.push(move);
			if (arrayNumbers[j] > arrayNumbers[j + 1]) {
				[arrayNumbers[j], arrayNumbers[j + 1]] = [
					arrayNumbers[j + 1],
					arrayNumbers[j],
				];
				const move = {
					moveType: "swap",
					firstIdx: j,
					secondIdx: j + 1,
				};
				moves.push(move);
			}
		}
	}
	return moves;
};
