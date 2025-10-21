import type React from "react";
import { useEffect, useRef, useState } from "react";
import { getBubbleSortMoves } from "./utilities/bubbleSort";
import { getInsertionSortMoves } from "./utilities/insertionSort";
import { getSelectionSortMoves } from "./utilities/selectionSort";

export type moveType = {
	moveType: string;
	firstIdx: number;
	secondIdx: number;
};

const App = () => {
	const getSortingAlgorithmMoves = (arrayNumbers: number[]) => {
		const func = algorithmToFunction.get(sortingAlgorthim);
		if (!func) return [];
		const moves = func([...arrayNumbers]);
		return moves;
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
		// return [3, 2, 1]
		const generatedArray: number[] = [];
		for (let i = 0; i < arrayLength; i++) {
			const randomNumber = getRandomNumber(minNumber, maxNumber);
			generatedArray.push(randomNumber);
		}
		return generatedArray;
	};

	const handleNewArray = () => {
		if (numberOfItems === 0) return;
		setNumbersArray(() => {
			const newArray = getArrayOfRandomNumbers(numberOfItems, 1, 10);
			setMoves(getSortingAlgorithmMoves([...newArray]));
			return newArray;
		});
		setSwappedIndicies([-1, -1]);
		setComparedIndicies([-1, -1]);
		setIsSorting(false);
		currentMoveIndex.current = 0;
		clearInterval(intervalID);
	};

	const handleNumberOfItemsChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (isSorting) return;
		const value = +e.target.value;
		setNumberOfItems(value);
	};

	const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = +e.target.value;
		if (value < 0) return;
		setSpeed(value);
	};

	const handleSortingAlgorithmChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		if (isSorting) return;
		const algorithm = e.target.selectedOptions[0].value;
		setSortingAlgorithm(algorithm);
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
				setComparedIndicies([-1, -1]);
				setSwappedIndicies([-1, -1]);
				setIsSorting(false);
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
		}, speed);
		setIntervalID(id);
	};

	const [numberOfItems, setNumberOfItems] = useState<number>(5);
	const [sortingAlgorthim, setSortingAlgorithm] =
		useState<string>("bubbleSort");
	const [speed, setSpeed] = useState<number>(500);
	const [numbersArray, setNumbersArray] = useState<number[]>(() =>
		getArrayOfRandomNumbers(numberOfItems, 1, 10),
	);
	const [swappedIndicies, setSwappedIndicies] = useState<number[]>([-1, -1]);
	const [comparedIndicies, setComparedIndicies] = useState<number[]>([-1, -1]);

	const [isSorting, setIsSorting] = useState<boolean>(false);

	useEffect(() => {
		clearInterval(intervalID);
		play();
	}, [speed]);
	useEffect(() => {
		handleNewArray();
	}, [numberOfItems]);

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

	const algorithmToFunction = new Map<
		string,
		(arrayNumbers: number[]) => moveType[]
	>();
	algorithmToFunction.set("bubbleSort", getBubbleSortMoves);
	algorithmToFunction.set("selectionSort", getSelectionSortMoves);
	algorithmToFunction.set("insertionSort", getInsertionSortMoves);
	useEffect(() => {
		handleNewArray();
	}, [sortingAlgorthim]);

	return (
		<div className="min-h-screen flex flex-col gap-y-5 py-2 bg-slate-300 justify-start items-center">
			<div className="flex flex-col justify-center gap-x-2 w-[90vw] gap-y-2">
				<select
					name="sortingAlgorthim"
					value={sortingAlgorthim}
					className="w-full flex gap-x-2 items-center bg-slate-800 rounded-lg p-2 text-white"
					onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
						handleSortingAlgorithmChange(e)
					}
				>
					<option value="bubbleSort">Bubble Sort</option>
					<option value="selectionSort">Selection Sort</option>
					<option value="insertionSort">Insertion Sort</option>
				</select>
				<section className="w-full flex gap-x-2 items-center">
					<input
						type="number"
						min="0"
						value={numberOfItems}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleNumberOfItemsChange(e)
						}
						className="bg-slate-800 text-white p-2 rounded-lg w-20"
					/>
					<input
						type="range"
						min="0"
						max="5000"
						value={speed}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleSpeedChange(e)
						}
						className="w-full"
					/>
				</section>
				<section className="flex gap-x-2">
					<button
						onClick={handleNewArray}
						className="bg-red-500 w-1/2 py-2 px-5 mx-auto rounded-lg text-white cursor-pointer"
					>
						New
					</button>
					<button
						onClick={handleSort}
						className="bg-green-500 w-1/2 py-2 px-5 mx-auto rounded-lg text-white cursor-pointer"
					>
						{isSorting ? "Stop" : "Start"}
					</button>
				</section>
			</div>
			<div className="flex  justify-center items-end w-full h-fit overflow-hidden min-h-[80vh]">
				{numbersArray.map((num, idx) => (
					<div
						key={`${num}-${idx}`}
						style={{
							height: `${num * 8}vh`,
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
