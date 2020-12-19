import { questionsAndAnswers } from "./questionsAndAnswers";

export const data = {
	familyOne: {
		members: [
			{
				name: "Student",
				isTurn: true
			},
			{
				name: "Student",
				isTurn: false
			},
			{
				name: "Student",
				isTurn: false
			},
			{
				name: "Student",
				isTurn: false
			},
			{
				name: "Student",
				isTurn: false
			}
		],
		score: 0,
		lastTurn: 0
	},
	familyTwo: {
		members: [
			{
				name: "Student",
				isTurn: false
			},
			{
				name: "Student",
				isTurn: false
			},
			{
				name: "Student",
				isTurn: false
			},
			{
				name: "Student",
				isTurn: false
			},
			{
				name: "Student",
				isTurn: false
			}
		],
		score: 0,
		lastTurn: 0
	},
	questions: questionsAndAnswers
};
