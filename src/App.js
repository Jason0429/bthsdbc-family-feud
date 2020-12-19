import React from "react";
import styled from "styled-components";
import { data } from "./data/data.js";
import ohana from "./img/ohana.jpg";
import cartoon from "./img/cartoon-db.png";
import { useState } from "react";
import "./App.css";
import Wave from "react-wavify";

const Game = styled.div`
	display: flex;
	width: 100%;
	height: 100vh;
`;

const Banner = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	width: 100%;
	height: 100px;
	padding: 0 50px;

	font-weight: 600;
	font-size: 1.3em;
	color: #fff;

	img {
		border-radius: 100%;
		width: 50px;
		height: 50px;
	}
`;

const PlayerTable = styled.table`
	padding: 10px;
	width: 90%;
	min-width: 200px;
	border-radius: 15px;
	background: #ffffff;
	flex: 0.5;
	z-index: 100;

	th {
		padding: 10px;
		font-size: 1.1em;
	}

	tr {
		text-align: center;
		border-bottom: 1px solid lightgray;

		td {
			padding: 10px;
			border-radius: 15px;

			&.selected {
				background: #fff;
				color: #000;
				box-shadow: 0 0 15px 3px #00000020;
			}
		}
	}
`;

const HalfWrapperLeft = styled.div`
	flex: 0.4;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const HalfWrapperRight = styled.div`
	flex: 0.6;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const FeudTable = styled.table`
	width: 80%;
	min-width: 500px;
	border-radius: 15px;
	background: #00000099;
	padding: 30px;
	z-index: 100;
	color: #fff;

	th {
		font-size: 1.8em;
		padding-bottom: 30px;
		border-bottom: 1px solid lightgray;
	}

	tr {
		width: 100%;
		align-items: center;

		td {
			font-size: 1.3em;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20px;
			border-bottom: 1px solid lightgray;
			visibility: hidden;

			&.reveal {
				visibility: visible;
			}
		}

		input {
			background: transparent;
			border: none;
			border-bottom: thin solid #fff;
			width: calc(100% - 5px);
			padding: 10px;
			font-size: 1.2em;
			color: #fff;

			&:focus {
				outline: none;
			}
		}

		&:last-child {
			height: 100px;
			display: flex;
			align-items: center;
			top: 20px;
			border-bottom: none;
		}
	}
`;

function App() {
	// Question -> answers -> answer, num, isRevealed
	const [question, setQuestion] = useState(data.questions[getRandomIndex()]);

	// Family One -> members, lastTurn, score
	const [familyOne, setFamilyOne] = useState(data.familyOne);

	// Family Two -> members, lastTurn, score
	const [familyTwo, setFamilyTwo] = useState(data.familyTwo);

	// Input response
	const [response, setResponse] = useState("");

	// Family and Index of Member
	const [turn, setTurn] = useState({
		family: getCurrentFamilyTurn(),
		member: 0
	});

	// Return random index of questions array
	function getRandomIndex() {
		let max = data.questions.length - 1;
		return Math.floor(Math.random() * (max + 1));
	}

	// Gets next member and checks
	function getNextMember(family) {
		if (family === 1)
			return familyOne.lastTurn === familyOne.members.length - 1
				? 0
				: familyOne.lastTurn + 1;
		else
			return familyTwo.lastTurn === familyTwo.members.length - 1
				? 0
				: familyTwo.lastTurn + 1;
	}

	// Updates response to input value
	function handleChange(e) {
		setResponse(e.target.value);
	}

	// Returns 1 or 2 depending on which family has a turn
	function getCurrentFamilyTurn() {
		let one = familyOne.members.filter((m) => m.isTurn);
		let two = familyTwo.members.filter((m) => m.isTurn);
		return one.length > 0 ? 1 : 2;
	}

	// Checks if response equals an answer choice
	// Returns false if wrong or already chosen
	function isValid() {
		for (let i = 0; i < question.answers.length; i++) {
			if (
				question.answers[i].answer.toLowerCase() ===
					response.toLowerCase() &&
				!question.answers[i].isRevealed
			) {
				return question.answers[i].num;
			}
		}
		return false;
	}

	// Returns a copy of members array with
	// previous member isTurn disabled and
	// next member isTurn enabled
	function getSameFamilyAndModifyNextMember(family, nextTurn, score) {
		if (family === 1) {
			let copy = [...familyOne.members];
			copy[familyOne.lastTurn].isTurn = false;
			copy[nextTurn].isTurn = true;

			setFamilyOne((prevState) => ({
				...prevState,
				lastTurn: nextTurn,
				score: prevState.score + score,
				members: [...copy]
			}));
		} else {
			let copy = [...familyTwo.members];
			copy[familyTwo.lastTurn].isTurn = false;
			copy[nextTurn].isTurn = true;

			setFamilyTwo((prevState) => ({
				...prevState,
				lastTurn: nextTurn,
				score: prevState.score + score,
				members: [...copy]
			}));
		}
	}

	function switchFamilyAndModifyNextMember(family) {
		if (family === 1) {
			setFamilyOne((prevState) => ({
				...prevState,
				members: prevState.members.map((m) => ({ ...m, isTurn: false }))
			}));

			let copy = [...familyTwo.members];
			copy[getNextMember(2)].isTurn = true;

			setFamilyTwo((prevState) => ({
				...prevState,
				lastTurn: getNextMember(2),
				members: [...copy]
			}));
		} else {
			setFamilyTwo((prevState) => ({
				...prevState,
				members: prevState.members.map((m) => ({ ...m, isTurn: false }))
			}));

			let copy = [...familyOne.members];
			copy[getNextMember(1)].isTurn = true;

			setFamilyOne((prevState) => ({
				...prevState,
				lastTurn: getNextMember(1),
				members: [...copy]
			}));
		}
	}

	// When user enters response
	function handleSubmit(e) {
		if (e.keyCode === 13) {
			let scoreOrFalse = isValid(); // Returns score if true, else false

			// If response is an answer choice
			if (scoreOrFalse !== false) {
				// Reveal answer choice
				setQuestion(
					(prevState) => ({
						...prevState,
						answers: prevState.answers.map((ans) =>
							ans.answer.toLowerCase() === response.toLowerCase()
								? { ...ans, isRevealed: true }
								: ans
						)
					}),
					// Set next turn
					// Keep same family
					// Increment member index
					setTurn(
						(prevState) => ({
							...prevState,
							member: getNextMember(prevState.family)
						}),
						getSameFamilyAndModifyNextMember(
							turn.family,
							getNextMember(turn.family),
							scoreOrFalse
						)
					)
				);
			} else {
				// If wrong
				// Change families
				// Modify member to lastTurn + 1
				setTurn(
					(prevState) => ({
						family: prevState.family === 1 ? 2 : 1,
						member:
							prevState.family === 1
								? getNextMember(2)
								: getNextMember(1)
					}),
					switchFamilyAndModifyNextMember(
						// Pass 1 to disable 1 and enable 2
						// Pass 2 to disable 2 and enable 1
						turn.family
					)
				);
			}

			setResponse("");
		}
	}

	// Separate function to modify next member turn and return object
	return (
		<Game className="App">
			{/* <img src={cartoon} id="background-img" /> */}
			<Wave
				id="wave"
				fill="#345F6E"
				paused={false}
				options={{
					height: 20,
					amplitude: 30,
					speed: 0.5,
					points: 3
				}}
			/>
			<Banner>
				<img src={ohana} alt="Ohana" />
				&nbsp;&nbsp;BTHS Family Feud
			</Banner>
			<HalfWrapperLeft>
				<PlayerTable>
					<th>Family One - {familyOne.score}</th>
					{familyOne.members.map((member) => (
						<tr>
							<td className={member.isTurn ? "selected" : ""}>
								{member.name}
							</td>
						</tr>
					))}
					<th>Family Two - {familyTwo.score}</th>
					{familyTwo.members.map((member) => (
						<tr>
							<td className={member.isTurn ? "selected" : ""}>
								{member.name}
							</td>
						</tr>
					))}
				</PlayerTable>
			</HalfWrapperLeft>
			<HalfWrapperRight>
				<FeudTable>
					<th>{question.question}</th>
					{question.answers.map((a) => (
						<tr>
							<td className={a.isRevealed ? "reveal" : ""}>
								<div>{a.answer}</div>
								<div>{a.num}</div>
							</td>
						</tr>
					))}
					<tr>
						<input
							type="text"
							placeholder="Type your answer"
							onChange={handleChange}
							value={response}
							onKeyDown={handleSubmit}
						/>
					</tr>
				</FeudTable>
			</HalfWrapperRight>
		</Game>
	);
}

export default App;
