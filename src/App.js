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
	// Take turns family
	// Calculate scores

	const [familyOne, setFamilyOne] = useState(data.familyOne);
	const [familyTwo, setFamilyTwo] = useState(data.familyTwo);
	const [question, setQuestion] = useState(data.questions[0]);
	const [turn, setTurn] = useState(1);
	const [response, setResponse] = useState("");

	// Updates response to input value
	const handleChange = (e) => {
		setResponse(e.target.value.trim());
	};

	// Reveals word if correct
	// Calls on handleTurn()
	const handleSubmit = (e) => {
		if (e.keyCode === 13) {
			setQuestion((prevState) => ({
				question: prevState.question,
				answers: prevState.answers.map((ans) => {
					if (ans.answer.toLowerCase() === response.toLowerCase()) {
						return { ...ans, isRevealed: !ans.isRevealed };
					} else {
						handleTurn();
						return ans;
					}
				})
			}));

			setResponse("");
		}
	};

	// Switches family turn
	const handleTurn = () => {
		setTurn((prevState) => (prevState === 1 ? 2 : 1));
	};

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
							<td>{member}</td>
						</tr>
					))}
					<th>Family Two - {familyTwo.score}</th>
					{familyTwo.members.map((member) => (
						<tr>
							<td>{member}</td>
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
