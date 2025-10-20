import type { moveType } from "../App";

export const getInsertionSortMoves = (arrayNumbers: number[]): moveType[] => {
	const moves: moveType[] = [];
	for (let i = 1; i < arrayNumbers.length; i++) {
		let j = i - 1;
		while (j >= 0) {
			let move: moveType = {
				moveType: "compare",
				firstIdx: i,
				secondIdx: j,
			};
			moves.push(move);
			if (arrayNumbers[j] <= arrayNumbers[i]) break;
			[arrayNumbers[i], arrayNumbers[j]] = [arrayNumbers[j], arrayNumbers[i]];
			move = {
				moveType: "swap",
				firstIdx: i,
				secondIdx: i - 1,
			};
			moves.push(move);
			i--;
			j--;
		}
	}

	return moves;
};
