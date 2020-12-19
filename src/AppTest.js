/*
HANDLESUBMIT
*/
setQuestion((prevState) => ({
	question: prevState.question,
	answers: prevState.answers.map((ans) => {
		if (ans.answer.toLowerCase() === response.toLowerCase()) {
			if (turn.family === 1) {
				setFamilyOne((prevState) => ({
					...prevState,
					score: prevState.score + ans.num
				}));
			} else {
				setFamilyTwo((prevState) => ({
					...prevState,
					score: prevState.score + ans.num
				}));
			}
			handleTurn(true);
			return { ...ans, isRevealed: !ans.isRevealed };
		} else {
			handleTurn(false);
			return ans;
		}
	})
}));

setResponse("");

/*
HANDLTURN
*/

let lastMemberIndexInFamilyOne = familyOne.members.length - 1;
let lastMemberIndexInFamilyTwo = familyTwo.members.length - 1;

// let thisTurnWon?
// If family increased points, then stay same family but increment member
// Else change family and increment member

let familyToModify;
if (thisTurnWon) {
	if (turn.family === 1) familyToModify = familyOne;
	else familyToModify = familyTwo;
} else {
	if (turn.family === 1) familyToModify = familyTwo;
	else familyToModify = familyOne;
}

if (thisTurnWon) {
	setTurn((prevState) => ({
		...prevState,
		member: () => {
			if (prevState.member === familyToModify.members.length) return 0;
			else return prevState.member + 1;
		}
	}));

	if (turn.family === 1) {
		setFamilyOne((prevState) => ({
			...prevState,
			lastTurn:
				turn.member === 0
					? prevState.members.length - 1
					: turn.member - 1,
			members: () => {
				const arr = prevState.members;

				// Disable isTurn for old member
				if (turn.member === 0) {
					arr[familyOne.members.length - 1].isTurn = !arr[
						familyOne.members.length - 1
					].isTurn;
				} else {
					arr[turn.member - 1].isTurn = !arr[turn.member - 1];
				}

				// Enable isTurn for new member
				arr[turn.member].isTurn = !arr[turn.member].isTurn;
				return arr;
			}
		}));
	} else {
		setFamilyTwo((prevState) => ({
			...prevState,
			lastTurn:
				turn.member === 0
					? prevState.members.length - 1
					: turn.member - 1,
			members: () => {
				const arr = prevState.members;

				// Disable isTurn for old member
				if (turn.member === 0) {
					arr[familyTwo.members.length - 1].isTurn = !arr[
						familyTwo.members.length - 1
					].isTurn;
				} else {
					arr[turn.member - 1].isTurn = !arr[turn.member - 1];
				}

				// Enable isTurn for new member
				arr[turn.member].isTurn = !arr[turn.member].isTurn;
				return arr;
			}
		}));
	}
} else {
	// If !thisTurnWon
	// Change turn.family to other team
	// Change turn.member to other team incremented by 1
	// !turn.family update lastTurn
	// !turn.family disable all isTurn
	// turn.family disable lastTurn
	// turn.family enable lastTurn + 1

	setTurn((prevState) => ({
		family: prevState.family === 1 ? 2 : 1,
		member: () => {
			let fam;
			if (prevState.family === 1) fam = familyTwo;
			else fam = familyOne;

			let idx = fam.members.filter((m) => {
				if (m.isTurn) return familyTwo.members.indexOf(m);
			});

			console.log(idx);
			return idx;
		}
	}));

	// Modify families when !thisTurnWon
	if (turn.family === 1) {
		// Update lastTurn but disable all isTurn
		setFamilyTwo((prevState) => ({
			...prevState,
			lastTurn: () => {
				return () => {
					for (let i = 0; i < prevState.members.length; i++) {
						if (prevState.members[i].isTurn) return i;
					}
				};
			},
			members: () => {
				return prevState.members.map((m) => {
					// Disable all isTurn
					if (m.isTurn) m.isTurn = !m.isTurn;
				});
			}
		}));

		// setFamilyOne(prevState => ({
		// 	...prevState,
		// 	members: () => {

		// 	}
		// }));
	} else {
		return;
	}
}

// setTurn((prevState) => ({
// 	family: prevState.family === 1 ? 2 : 1,
// 	member: () => {
// 		let fam = prevState.family === 1 ? familyOne : familyTwo;

// 		for (let i = 0; i < fam.members.length; i++) {
// 			if (fam.members[i].isTurn) {
// 				if (i === fam.members.length - 1) {
// 					return 0;
// 				} else {
// 					return i + 1;
// 				}
// 			}
// 		}
// 	}
// }));
