let text = document.getElementById('text');
let remain = document.getElementById('remain-letter');
let tweet = document.getElementById('tweet');
const MAX_NUM = 140;

text.addEventListener('input', countRemain);

// count characters
function countRemain() {
	let remainLetter = MAX_NUM - text.value.length;
	if (remainLetter < 0) {
		remain.innerHTML = `<span class="remaining">Remaining letter is ${remainLetter}</span>`;
		remain.style.color = 'red';
		tweet.disabled = true;
	} else if (text.value.length === 0) {
		tweet.disabled = true;
		remain.innerHTML = ``;
	} else {
		remain.style.color = 'black';
		remain.innerHTML = `<span class="remaining">Remaining letter is ${remainLetter}</span>`;
		tweet.disabled = false;
	}
}
// produce hashtags with an achor tag
function insertLink(string) {
	const splitString = string.split(' ');
	return splitString
		.map(word => {
			const isHashtag = word[0] === '#';
			return isHashtag ? `<a href="#" onclick="magic()">${word}</a>` : word;
		})
		.join(' ');
}

/* DEFAULT VARIABLES */
// Example Twitter Appstate
tweetAppState = {
	currentUsername: 'Chuon Chuon',
	totalTweets: 1,
	totalComments: 1,
	tweets: [
		{
			id: 1,
			username: 'Chuon Chuon',
			type: 'original-tweet',
			tweetAt: 1570695718369,
			isLiked: false,
			body:
				'i’m a simple pup. i don’t need much. just your attention at all times. and for everyone i ever meet to love me a whole bunch.',
		},
	],
	retweets: [
		{
			username: 'Chuon Chuon',
			tweetID: 1,
			commentAt: 1570695718369,
			isLiked: false,
			body:
				"#Chloe, if you leave the room i’m in. i will always follow you to the next one. whatever this adventure is, you don't have to do this alone.",
		},
	],
};

/* FUNCTION */

///Render functions

//Main-render-function
function renderTweets(tweetsArray) {
	let html = ''; //Create the html code string
	tweetsArray
		.map(tweet => {
			//Loop thought tweetsArray items
			html += `
        <div class="media">
            <img class="mr-3" src="https://cdn.discordapp.com/attachments/631710535011794947/631713824793427980/ChuonChuon__.jpg" width="64" height="64" alt="avatar">
            <div class="media-body">
                <h5 class="mt-0">${tweet.username} <small>${moment(tweet.tweetAt).fromNow()}</small></h5>
                <p class="tweet-content">${insertLink(tweet.body)}</p>
                <button class="btn btn-outline-danger btn-sm" id="delete" onclick=like(${
					tweet.id
				})><i class="far fa-heart"></i></button>
		        <button class="btn btn-danger btn-sm" id="delete" onclick=remove(${tweet.id})>Delete</button>
            </div>
        </div><hr>`;
		})
		.join(''); //Remove ',' from the list
	document.getElementById('tweets-list').innerHTML = html; //Get Element "tweets-list" and put the html code to that element"
}

// remove tweets
function remove(id) {
	let index = tweetAppState.tweets.find(tweet => tweet.id === id); //Find current index of the given id
	tweetAppState.tweets.splice(index, 1); //Remove the tweet in that index
	renderTweets(tweetAppState.tweets); //Re-render the tweet array
}

// like tweets
function like(id) {
	tweetAppState.tweets.map(tweet => {
		if (tweet.id === id) {
			//Loop thouch tweets arrays and change the isLiked variable to true of false
			tweet.isLiked = !tweet.isLiked;
			console.log(tweet.isLiked);
		}
	});
}

function onTweet() {
	let newTweet = {
		id: tweetAppState.totalTweets++, // Plus 1 to current tweets object
		username: tweetAppState.currentUsername, //Get current username
		tweetAt: Date.now(), //Get current time
		body: text.value, //Get the value of the text input form
	};
	tweetAppState.tweets.unshift(newTweet); //Push new message to the top of array
	text.value = ''; //Clean the textbox
	remain.innerHTML = ``; //Clean the tweet remain
	tweet.disabled = true; //Disable post button
	renderTweets(tweetAppState.tweets); //Re-render the modified tweet list
}

renderTweets(tweetAppState.tweets); //Call the function to render currently get from tweetAppState object
