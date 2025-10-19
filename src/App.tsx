import { useEffect, useRef, useState } from "react";
import { getBubbleSortMoves } from "./utilities/bubbleSort";

export type moveType = {
	fromIdx: number;
	toIdx: number;
};

const App = () => {
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
			const bubbleSortMoves = getBubbleSortMoves([...newArray]);
			setMoves(bubbleSortMoves);
			return newArray;
		});
		setFromIdx(-1);
		setToIdx(-1);
		setIsSorting(false);
		currentMoveIndex.current = 0;
		clearInterval(intervalID);
	};

	const handleSort = () => {
		setIsSorting((prev) => !prev);
	};

	const [moves, setMoves] = useState<moveType[]>([]);

	const swapTwoNumbers = (fromIdx: number, toIdx: number) => {
		setFromIdx(fromIdx);
		setToIdx(toIdx);
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
			swapTwoNumbers(move.fromIdx, move.toIdx);
		}, 100);
		setIntervalID(id);
	};

	const [numberOfItems, setNumberOfItems] = useState<number>(50);
	const [numbersArray, setNumbersArray] = useState<number[]>(() =>
		getArrayOfRandomNumbers(numberOfItems, 1, 10),
	);
	const [fromIdx, setFromIdx] = useState<number>(-1);
	const [toIdx, setToIdx] = useState<number>(-1);

	const [isSorting, setIsSorting] = useState<boolean>(false);

	useEffect(() => {
		setNumbersArray((prev) => {
			const updated = [...prev];
			[updated[fromIdx], updated[toIdx]] = [updated[toIdx], updated[fromIdx]];
			return updated;
		});
	}, [fromIdx, toIdx]);

	useEffect(() => {
		play();
	}, [isSorting]);

	useEffect(() => {
		const bubbleSortMoves = getBubbleSortMoves([...numbersArray]);
		setMoves(bubbleSortMoves);
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
							width: `${95 / numberOfItems}vw`,
							background: `${idx === fromIdx ? "red" : idx === toIdx ? "green" : ""}`,
						}}
						className="bg-slate-900 text-white text-[8px] flex justify-center pt-2 border-[1px] border-black border-collapse"
					>
						{num}
					</div>
				))}
			</div>
		</div>
	);
};

export default App;
