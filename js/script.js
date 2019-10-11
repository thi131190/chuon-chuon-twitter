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
let tweetAppState = {
	currentUsername: 'Chuon Chuon',
	totalTweets: 2,
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
	reTweets: [
		{
			id: 1,
			username: 'Chuon Chuon',
			type: 'retweet',
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
			if(tweet.type==="original-tweet"){
			html += `
        <div class="media">
            <img class="mr-3" src="https://cdn.discordapp.com/attachments/631710535011794947/631713824793427980/ChuonChuon__.jpg" width="64" height="64" alt="avatar">
            <div class="media-body">
                <h5 class="mt-0">${tweet.username} <small>${moment(tweet.tweetAt).fromNow()}</small></h5>
                <p class="media-content">${insertLink(tweet.body)}</p>
                <button class="btn btn-outline-danger btn-sm" id="delete" onclick=like(${tweet.id})><i class="far fa-heart"></i></button>
				<button class="btn btn-danger btn-sm" id="delete" onclick=remove(${tweet.id},'${tweet.type}')>Delete</button>
				<button class="btn btn-danger btn-sm" id="delete" onclick=reTweet(${tweet.id})>ReTweet</button>    
				</div>
		</div><hr>`;
			}else if(tweet.type==="retweet"){
				let index = tweetAppState.tweets.findIndex(master => master.id === tweet.tweetID);
				console.log(index)
				html+=`
				<div class="media">
				<img class="mr-3" src="https://cdn.discordapp.com/attachments/631710535011794947/631713824793427980/ChuonChuon__.jpg" width="64" height="64" alt="avatar">
				<div class="media-body">
				  <h5 class="mt-0">${tweet.username} just retweeted <small>${moment(tweet.tweetAt).fromNow()}</h5>
				  <p class="media-content">${insertLink(tweet.body)}</p>
				  <div class="media mt-3">
					<a class="pr-3" href="#">
					  <img src="https://cdn.discordapp.com/attachments/631710535011794947/631713824793427980/ChuonChuon__.jpg" width="64" height="64" alt="avatar">
					</a>
					<div class="media-body">
					  <h5 class="mt-0">${tweetAppState.tweets[index].username} <small>${moment(tweetAppState.tweets[index].tweetAt).fromNow()}</h5>
					  <p>${insertLink(tweetAppState.tweets[index].body)}</p>
					</div>
				  </div>
				  <button class="btn btn-outline-danger btn-sm" id="delete" onclick=like(${tweet.id})><i class="far fa-heart"></i></button>
				  <button class="btn btn-danger btn-sm" id="delete" onclick=remove(${tweet.id},'${tweet.type}')>Delete</button>
				  <button class="btn btn-danger btn-sm" id="delete" onclick=reTweet(${tweet.id})>ReTweet</button>    
				</div>
			  </div><hr>`

			}
		})
		.join(''); //Remove ',' from the list
	document.getElementById('tweets-list').innerHTML = html; //Get Element "tweets-list" and put the html code to that element"
}



// remove tweets
function remove(id, type) {
	if(type==='original-tweet'){ //if type is original tweet, delete all the retweets if have
		let index = tweetAppState.tweets.findIndex(tweet => tweet.id === id); //Find current index of the given id
		tweetAppState.tweets.splice(index, 1); //Remove the tweet in that index
		tweetAppState.reTweets = tweetAppState.reTweets.filter(retweet => retweet.tweetID !== id)
	}else if(type==="retweet"){ //just delete it self
		let index = tweetAppState.reTweets.findIndex(retweet => retweet.id === id); //Find current index of the given id
		tweetAppState.reTweets.splice(index, 1); //Remove the tweet in that index
	}
	renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets)); //Re-render the tweet array
}

// like tweets
function like(id) {
	tweetAppState.tweets.concat(tweetAppState.reTweets).map(tweet => {
		if (tweet.id === id) {
			//Loop thouch tweets arrays and change the isLiked variable to true of false
			tweet.isLiked = !tweet.isLiked;
			console.log(tweet.isLiked);
		}
	});
}

function onTweet() {
	let newTweet = {
		id: tweetAppState.totalTweets = tweetAppState.totalTweets+1, // Plus 1 to current tweets object
		type: 'original-tweet',
		username: tweetAppState.currentUsername, //Get current username
		tweetAt: Date.now(), //Get current time
		body: text.value, //Get the value of the text input form
	};
	tweetAppState.tweets.unshift(newTweet); //Push new message to the top of array
	text.value = ''; //Clean the textbox
	remain.innerHTML = ``; //Clean the tweet remain
	tweet.disabled = true; //Disable post button
	renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets)); //Re-render the modified tweet list
}

function reTweet(id) {
	let newTweet = {
		id: tweetAppState.totalTweets = tweetAppState.totalTweets+1, // Plus 1 to current tweets object
		type: 'retweet',
		username: tweetAppState.currentUsername, //Get current username
		tweetID: id,
		tweetAt: Date.now(), //Get current time
		body: text.value, //Get the value of the text input form
	};
	tweetAppState.reTweets.unshift(newTweet); //Push new message to the top of array
	text.value = ''; //Clean the textbox
	remain.innerHTML = ``; //Clean the tweet remain
	tweet.disabled = true; //Disable post button
	renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets)); //Re-render the modified tweet list
}


renderTweets(tweetAppState.tweets.concat(tweetAppState.reTweets)); //Call the function to render currently get from tweetAppState object
