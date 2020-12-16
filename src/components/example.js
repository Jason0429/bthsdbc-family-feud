let dataSet = {
	question: "What would you find in a haunted house? ",
	answers: [
		{
			answer: "Ghosts",
			people: "24",
			show: false
		},
		{
			answer: "Cobwebs",
			people: "18",
			show: false
		},
		{
			answer: "Spiders",
			people: "14",
			show: false
		},
		{
			answer: "Mice",
			people: "12",
			show: false
		},
		{
			answer: "Dust",
			people: "10",
			show: false
		},
		{
			answer: "",
			people: "",
			show: false
		},
		{
			answer: "",
			people: "",
			show: false
		},
		{
			answer: "",
			people: "",
			show: false
		}
	]
};

const [response, setResponse] = useState("");
const [data, setData] = useState(dataSet);

const handleSubmit = (response) => {
	for (var i = 0; i < dataSet.answers.length; i++) {
		if (
			dataSet.answers[i].answer.toLowerCase() ===
			response.toLowerCase().trim()
		) {
			dataSet.answers[i].show = true;
			setData(dataSet);
		}
	}
};

return (
	<div className="App">
		<div className="game">
			<div className="title">
				Welcome to BTHS Dragon Boat Family Feud!
			</div>
			<div className="question">{data.question}</div>
			<div className="answer-container">
				{data.answers.map((answerRow) => (
					<div
						className={
							answerRow.show ? "answer-row active" : "answer-row"
						}
					>
						<div className="answer">{answerRow.answer}</div>
						<div className="people">{answerRow.people}</div>
					</div>
				))}
			</div>
			<div className="input">
				Enter Response: &nbsp;
				<input
					type="text"
					onChange={(event) => {
						setResponse(event.target.value);
					}}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							handleSubmit(event.target.value);
							event.target.value = "";
						}
					}}
				/>
			</div>
		</div>
	</div>
);
