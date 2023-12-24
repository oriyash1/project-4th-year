const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const session = require('express-session');
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function readPasswordsFromCSV() {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'codes.csv');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const lines = data.split('\n');
            const passwords = lines.map(line => {
                const parts = line.split(',');
                return parts[2]; // Assuming the password is the third element in each line
            });
            resolve(passwords);
        });
    });
}

app.use(session({
    secret: 'your secret key',  // Choose a secret for session encoding
    resave: false,
    saveUninitialized: true
}));

// Handles the submission of code
app.post('/submit-code', (req, res) => {
    const code = req.body.code;
    console.log(`Received code: ${code}`);
    req.session.userCode = code;
    res.redirect('/mainGame');
});

app.post('/submit-answer', async (req, res) => {
    const answer = req.body.answer;
    const userCode = req.session.userCode || 'No code submitted';

    // Get the new parameters: ball ratio, group size, ball color, and lottery condition
    const ballRatio = req.body.ballRatio;
    const groupSize = req.body.groupSize;
    const ballColor = req.body.ballColor;
    const LotteryCondition = req.body.LotteryCondition;
    const pitcherColorChoice = req.body.pitcherColorChoice;
    const participateLotteryChoice = req.body.participateLotteryChoice;

    let uniquePassword;
    let isUnique = false;
    while (!isUnique) {
        uniquePassword = generatePassword();
        const existingPasswords = await readPasswordsFromCSV();

        if (!existingPasswords.includes(uniquePassword)) {
            isUnique = true;
        }
    }

    // Store the generated password and all parameters in the session
    req.session.generatedPassword = uniquePassword;
    req.session.ballRatio = ballRatio;
    req.session.groupSize = groupSize;
    req.session.ballColor = ballColor;
    req.session.LotteryCondition = LotteryCondition;
    req.session.pitcherColorChoice = pitcherColorChoice;
    req.session.participateLotteryChoice = participateLotteryChoice;

    // Append the code, answer, and parameters to a CSV file
    const csvLine =`"${userCode}","${ballColor}","${ballRatio}","${groupSize}","${LotteryCondition}","${pitcherColorChoice}","${participateLotteryChoice}","${uniquePassword}"\n`;
    fs.appendFileSync(path.join(__dirname, 'codes.csv'), csvLine, (err) => {
        if (err) throw err;
        console.log('Parameters were saved to the CSV file!');
    });

    // Redirect to a new page to display the password
    res.redirect('/password');
});
// Function to generate a random password
function generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = 8;
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

// Route to serve password.html
app.get('/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'password.html'));
});

// Route to provide the password data
app.get('/get-password', (req, res) => {
    const generatedPassword = req.session.generatedPassword || 'No password generated';
    res.json({ password: generatedPassword });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mainGame.html'));
});

app.get('/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'password.html'));
});

app.get('/mainGame', (req, res) => {
    res.sendFile(path.join(__dirname, 'questions.html'));
});

app.listen(port, () => {
    console.log("Server running on port", port);
});
