document.addEventListener("DOMContentLoaded", function() {
    // Call your JavaScript function
    initialize();
});

function initialize() {
    // Display parameters
    var ballRatioValue = getRandomNumber();
    var groupSizeValue = getRandomGroupSize();
    var ballColorValue = getballColor();
    var LotteryConditionValue = getLotteryCondition();
    // Update HTML content
    document.getElementById('ballRatioValue').textContent = ballRatioValue + '%';
    document.getElementById('groupSizeValue').textContent = groupSizeValue;
    document.getElementById('ballColorValue').textContent = ballColorValue;
    document.getElementById('LotteryConditionValue').textContent = LotteryConditionValue + '%' +" " +'people';

    document.getElementById('ballRatioInput').value = ballRatioValue;
    document.getElementById('groupSizeInput').value = groupSizeValue;
    document.getElementById('ballColorInput').value = ballColorValue;
    document.getElementById('LotteryConditionInput').value = LotteryConditionValue;
}


function getRandomNumber() {
    var options = [55, 85];
    var randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}

// Function to get a random group size (7 or 25)
function getRandomGroupSize() {
    var options = [7, 25];
    var randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}
function getballColor() {
    var options = ['red', 'blue'];
    var randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}
function getLotteryCondition() {
    var options = [50,75,100];
    var randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}
function captureChoices() {
    var pitcherColorChoice = document.querySelector('input[name="pitcherColor"]:checked').value;
    var participateLotteryChoice = document.querySelector('input[name="participateLottery"]:checked').value;

    document.getElementById('pitcherColorChoice').value = pitcherColorChoice;
    document.getElementById('participateLotteryChoice').value = participateLotteryChoice;
}