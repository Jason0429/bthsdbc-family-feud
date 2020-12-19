export const handleChange = (e) => {
	setResponse(e.target.value);
}; // Updates response to input value

export const getCurrentFamilyTurn = () => {
	let one = familyOne.members.filter((m) => m.isTurn);
	let two = familyTwo.members.filter((m) => m.isTurn);
	return one.length > 0 ? 1 : 2;
}; // Returns 1 or 2 depending on which family has a turn

export const isValid = () => {
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
}; // Checks if response equals an answer choice
// Returns false if wrong or already chosen
