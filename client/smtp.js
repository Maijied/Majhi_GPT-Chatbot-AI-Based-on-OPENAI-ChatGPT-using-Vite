let feedback = document.getElementById('feedback_value').value;
console.log('feedback', feedback);
function sendEmail() {
	Email.send({
	Host: "smtp.gmail.com",
	Username : "mdshuvo40@gmail.com",
	Password : "lgsimadgqnpjzimt",
	To : 'mdshuvo40@gmail.com',
	From : "majhi-gpt@gmail.com",
	Subject : "Majhi-gpt Feedback",
	Body : feedback,
	}).then(
		message => alert("mail sent successfully")
	);
}