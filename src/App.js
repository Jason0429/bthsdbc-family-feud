import React from "react";
import styled from "styled-components";
import { data } from "./data/data.js";
import ohana from "./img/ohana.jpg";
import { useState } from "react";
import "./App.css";

const Game = styled.div`
	display: flex;
	width: 100%;
	height: 100vh;
	/* align-items: center; */
	/* justify-content: space-between; */
`;

const Banner = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	width: 100%;
	height: 150px;
	justify-content: center;

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
	background: #fff;
	box-shadow: 0 0 15px 3px #00000020;
	flex: 0.5;

	th {
		padding: 10px;
		font-size: 1.1em;
	}

	tr {
		text-align: center;
		border-bottom: 1px solid lightgray;

		td {
			padding: 10px;

			&.selected {
				background: #c4c4c460;
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
	background: #00000090;
	padding: 30px;
	color: #fff;

	th {
		font-size: 1.8em;
		padding-bottom: 30px;
		border-bottom: 1px solid lightgray;
	}

	tr {
		width: 100%;
		align-items: center;
		border-bottom: 1px solid lightgray;

		td {
			font-size: 1.3em;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20px;
			border-bottom: 1px solid #c4c4c420;
			visibility: hidden;

			&.reveal {
				visibility: visible;
			}
		}

		input {
			width: calc(100% - 5px);
			padding: 10px;
			font-size: 1.2em;
			border-radius: 15px;
			border: none;

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
	const [question, setQuestion] = useState(data.questions[0]);

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

	// Returns boolean if value is last member
	function isLastMember(family, value) {
		return family === 1
			? value === familyOne.members.length - 1
			: value === familyTwo.members.length - 1;
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
