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
			return isHashtag ? `<a href="#" onclick="magic('${word}')">${word}</a>` : word;
		})
		.join(' ');
}

function insertMention(string) {
	const splitString = string.split(' ');
	return splitString
		.map(word => {
			const isHashtag = word[0] === '@';
			return isHashtag ? `<a href="#" onclick="magic2('${word}')">${word}</a>` : word;
		})
		.join(' ');
}

function insertImage(string) {
	const splitString = string.split(' ');
	return splitString
		.map(word => {
			const isHashtag = word.includes(".png") || word.includes(".jpg") || word.includes(".gif");
			return isHashtag ? `<img href="#" src="${word}" width="400">` : word;
		})
		.join(' ');
}

/* DEFAULT VARIABLES */
// Example Twitter Appstate

/* FUNCTION */

//Local-storage Functions

let tweetAppState = {};

function getAppState() {
	let newTweetsList = {
		currentUsername: 'Chuon Chuon',
		totalTweets: 2,
		tweets: [],
		reTweets: [],
	};

	tweetAppState = JSON.parse(localStorage.getItem('tweetsList')) || newTweetsList;
}

function saveAppState(appState) {
	localStorage.setItem('tweetsList', JSON.stringify(appState));
}

///Render functions

//Main-render-function
function renderTweets(tweetsArray) {
	let html = ''; //Create the html code string
	tweetsArray
		.map(tweet => {
			//Loop thought tweetsArray items
			if (tweet.type === 'original-tweet') {
				html += `
        <div class="media">
            <img class="mr-3 rounded-circle" src="https://cdn.discordapp.com/attachments/631710535011794947/631713824793427980/ChuonChuon__.jpg" width="64" height="64" alt="avatar">
            <div class="media-body">
                <h5 class="mt-0">${tweet.username} <small>${moment(tweet.tweetAt).fromNow()}</small></h5>

				<p class="tweet-content">${insertLink(tweet.body)}</p>
				
                <button class="btn btn-outline-danger btn-sm" id="like" onclick="like(${
					tweet.id
				})"><i class="${!tweet.isLiked? "far": "fas"} fa-heart"></i></button>

		        <button class="btn btn-danger btn-sm" id="delete" onclick=remove(${tweet.id})>Delete</button>
				
				</div>
		</div><hr>`;
			} else if (tweet.type === 'retweet') {
				let index = tweetAppState.tweets.findIndex(master => master.id === tweet.tweetID);
				// console.log(index)
				html += `
				<div class="media">
				<img class="mr-3 rounded-circle" src="https://cdn.discordapp.com/attachments/631710535011794947/631713824793427980/ChuonChuon__.jpg" width="64" height="64" alt="avatar">
				<div class="media-body">
				  <h5 class="mt-0">${tweet.username} retweeted <small>${moment(tweet.tweetAt).fromNow()}</h5>
				  <p class="media-content">${insertImage(insertMention(insertLink(tweet.body)))}</p>
				  <div class="media mt-3">
					<a class="pr-3" href="#">
					  <img class="rounded-circle" src="https://cdn.discordapp.com/attachments/631710535011794947/631713824793427980/ChuonChuon__.jpg" width="64" height="64" alt="avatar">
					</a>
					<div class="media-body">
					  <h5 class="mt-0">${tweetAppState.tweets[index].username} <small>${moment(
					tweetAppState.tweets[index].tweetAt
				).fromNow()}</h5>
					  <p>${insertImage(insertMention(insertLink(tweetAppState.tweets[index].body)))}</p>
					</div>
				  </div>
				  <button class="btn btn-outline-danger btn-sm" id="delete" onclick=like(${tweet.id})><i class="far fa-heart"></i></button>
				  <button class="btn btn-danger btn-sm float-right mx-2" id="delete" onclick=remove(${tweet.id},'${tweet.type}')><i class="fas fa-trash-alt"></i></button>   
				  <button class="btn btn-danger btn-sm float-right" id="comment2" data-toggle="collapse" data-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2"><i class="far fa-comment"></i></button>  
				  <button class="btn btn-danger btn-sm float-right mr-2" id="delete" onclick=reTweet(${tweet.id})><i class="fas fa-retweet"></i></button>
				  
				  <div class="collapse" id="collapseExample2">
					 <div class="card-text mt-3">
						<input class="form-control" type="text"></input>
						<button class="btn btn-danger btn=sm float-right mt-2" id= "send" m> send <i class="fas fa-paper-plane"></i></button>					
					 </div>
				  </div>
				</div>
			  </div><hr>`;
			}
		})
		.join(''); //Remove ',' from the list
	document.getElementById('tweets-list').innerHTML = html; //Get Element "tweets-list" and put the html code to that element"
	saveAppState(tweetAppState); // Save current AppState after every render
}

// remove tweets
function remove(id, type) {
	if (type === 'original-tweet') {
		//if type is original tweet, delete all the retweets if have
		let index = tweetAppState.tweets.findIndex(tweet => tweet.id === id); //Find current index of the given id
		tweetAppState.tweets.splice(index, 1); //Remove the tweet in that index
		tweetAppState.reTweets = tweetAppState.reTweets.filter(retweet => retweet.tweetID !== id);
	} else if (type === 'retweet') {
		//just delete it self
		let index = tweetAppState.reTweets.findIndex(retweet => retweet.id === id); //Find current index of the given id
		tweetAppState.reTweets.splice(index, 1); //Remove the tweet in that index
	}
	renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets).sort((a, b) => b.id - a.id)); //Re-render the tweet array
}

// like tweets
function like(id) {
	tweetAppState.tweets.concat(tweetAppState.reTweets).map(tweet => {
		if (tweet.id === id) {
			//Loop thouch tweets arrays and change the isLiked variable to true of false
			tweet.isLiked = !tweet.isLiked;
			// console.log(tweet.isLiked);
		}
	});
	renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets).sort((a, b) => b.id - a.id));
}

function onTweet() {
	let newTweet = {
		id: (tweetAppState.totalTweets = tweetAppState.totalTweets + 1), // Plus 1 to current tweets object
		type: 'original-tweet',
		username: tweetAppState.currentUsername, //Get current username
		tweetAt: Date.now(), //Get current time
		body: text.value, //Get the value of the text input form
		isLiked: false,
	};
	tweetAppState.tweets.unshift(newTweet); //Push new message to the top of array
	text.value = ''; //Clean the textbox
	remain.innerHTML = ``; //Clean the tweet remain
	tweet.disabled = true; //Disable post button
	renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets).sort((a, b) => b.id - a.id)); //Re-render the modified tweet list
}

function reTweet(id) {
	let isRetweeted = tweetAppState.reTweets.findIndex(retweet => retweet.id === id) != -1; //Check if object is a retweet of a original tweet
	if (!isRetweeted) {
		let newTweet = {
			id: (tweetAppState.totalTweets = tweetAppState.totalTweets + 1), // Plus 1 to current tweets object
			type: 'retweet',
			username: tweetAppState.currentUsername, //Get current username
			tweetID: id,
			tweetAt: Date.now(), //Get current time
			body: text.value, //Get the value of the text input form
			isLiked: false,
		};
		tweetAppState.reTweets.unshift(newTweet); //Push new message to the top of array
		text.value = ''; //Clean the textbox
		remain.innerHTML = ``; //Clean the tweet remain
		tweet.disabled = true; //Disable post button
	} else {
		let fatherId = tweetAppState.reTweets.find(retweet => retweet.id === id).tweetID;
		let newTweet = {
			id: (tweetAppState.totalTweets = tweetAppState.totalTweets + 1), // Plus 1 to current tweets object
			type: 'retweet',
			username: tweetAppState.currentUsername, //Get current username
			tweetID: fatherId,
			tweetAt: Date.now(), //Get current time
			body: text.value, //Get the value of the text input form
		};
		tweetAppState.reTweets.unshift(newTweet); //Push new message to the top of array
		text.value = ''; //Clean the textbox
		remain.innerHTML = ``; //Clean the tweet remain
		tweet.disabled = true; //Disable post button
	}
	renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets).sort((a, b) => b.id - a.id)); //Re-render the modified tweet list
}

function magic(hashtags){ //filter the list with hashtag
	renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets).sort((a, b) => b.id - a.id).filter(tweet => tweet.body.includes(hashtags)))
}

getAppState(); //Get previous appstate in localstorage, if there none, create a new one.
renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets).sort((a, b) => b.id - a.id)); //Call the function to render currently get from tweetAppState object
