import { useEffect, useRef, useState } from "react";
import { getBubbleSortMoves } from "./utilities/bubbleSort";
import { getSelectionSortMoves } from "./utilities/selectionSort";

export type moveType = {
	moveType: string;
	firstIdx: number;
	secondIdx: number;
};

const App = () => {
	const getSortingAlgorithmMoves = (arrayNumbers: number[]) => {
		const selectionSortMoves = getSelectionSortMoves([...arrayNumbers]);
		return selectionSortMoves;
	};
	const getRandomNumber = (minNumber: number, maxNumber: number): number => {
		const num = Math.random() * maxNumber - 1 + minNumber;
		return Math.round(num * 10) / 10; // round to the nearest tenth
	};
	const getArrayOfRandomNumbers = (
		arrayLength: number,
		minNumber: number,
		maxNumber: number,
	): number[] => {
		const generatedArray: number[] = [];
		for (let i = 0; i < arrayLength; i++) {
			const randomNumber = getRandomNumber(minNumber, maxNumber);
			generatedArray.push(randomNumber);
		}
		return generatedArray;
	};

	const handleNewArray = () => {
		setNumbersArray(() => {
			const newArray = getArrayOfRandomNumbers(numberOfItems, 1, 10);
			setMoves(getSortingAlgorithmMoves(newArray));
			return newArray;
		});
		setSwappedIndicies([-1, -1]);
		setComparedIndicies([-1, -1]);
		setIsSorting(false);
		currentMoveIndex.current = 0;
		clearInterval(intervalID);
	};

	const handleSort = () => {
		setIsSorting((prev) => !prev);
	};

	const [moves, setMoves] = useState<moveType[]>([]);

	const swapTwoNumbers = (swappedIndicies: number[]) => {
		setComparedIndicies([-1, -1]);
		setSwappedIndicies(swappedIndicies);
	};
	const [intervalID, setIntervalID] = useState<number>(0);
	const currentMoveIndex = useRef(0);
	const play = async () => {
		if (!isSorting) {
			clearInterval(intervalID);
			return;
		}
		const id = setInterval(() => {
			if (currentMoveIndex.current >= moves.length) {
				return;
			}
			const move = moves[currentMoveIndex.current];
			currentMoveIndex.current++;
			if (move.moveType === "swap") {
				swapTwoNumbers([move.firstIdx, move.secondIdx]);
			} else {
				setSwappedIndicies([-1, -1]);
				setComparedIndicies([move.firstIdx, move.secondIdx]);
			}
		}, 50);
		setIntervalID(id);
	};

	const [numberOfItems, setNumberOfItems] = useState<number>(50);
	const [numbersArray, setNumbersArray] = useState<number[]>(() =>
		getArrayOfRandomNumbers(numberOfItems, 1, 10),
	);
	const [swappedIndicies, setSwappedIndicies] = useState<number[]>([-1, -1]);
	const [comparedIndicies, setComparedIndicies] = useState<number[]>([-1, -1]);

	const [isSorting, setIsSorting] = useState<boolean>(false);

	useEffect(() => {
		const [firstIdx, secondIdx] = [swappedIndicies[0], swappedIndicies[1]];
		setNumbersArray((prev) => {
			const updated = [...prev];
			[updated[firstIdx], updated[secondIdx]] = [
				updated[secondIdx],
				updated[firstIdx],
			];
			return updated;
		});
	}, [swappedIndicies]);

	useEffect(() => {
		play();
	}, [isSorting]);

	useEffect(() => {
		const moves = getSortingAlgorithmMoves([...numbersArray]);
		setMoves(moves);
	}, []);

	return (
		<div className="min-h-screen flex flex-col gap-y-5 py-5 bg-slate-300 justify-between items-center">
			<div className="flex justify-center gap-x-2 w-[90vw]">
				<button
					onClick={handleNewArray}
					className="bg-red-500 w-1/2 py-2 px-5 mx-auto rounded-lg text-white cursor-pointer"
				>
					New Number
				</button>
				<button
					onClick={handleSort}
					className="bg-green-500 w-1/2 py-2 px-5 mx-auto rounded-lg text-white cursor-pointer"
				>
					{isSorting ? "Stop Sorting" : "Start Sorting"}
				</button>
			</div>
			<div className="flex  justify-center items-end w-full min-h-">
				{numbersArray.map((num, idx) => (
					<div
						key={`${num}-${idx}`}
						style={{
							height: `${num * 9}vh`,
							width: `${98 / numberOfItems}vw`,
							background: `${comparedIndicies.includes(idx) ? "orange" : idx === swappedIndicies[0] ? "red" : idx === swappedIndicies[1] ? "green" : ""}`,
						}}
						className="bg-slate-900 text-white text-[8px] flex justify-center pt-2 border-[1px] border-black border-collapse"
					></div>
				))}
			</div>
		</div>
	);
};

export default App;
