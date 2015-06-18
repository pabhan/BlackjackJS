/*Deck Rendering*/
window.addEventListener("load",function()
{
	/* utilities */
	function writeInArea(text,area)
	{
		area.innerHTML = text;
	}
	
	/*Card Definition*/
	function Card(suit,rank) 
	{
		this.suit=suit;
		this.rank=rank;
	}
	Card.prototype.getCard = function()
	{
		return this.suit+ " " + this.rank;

	}

	function cardDisplay(card,myBody)
	{
		var cardImage = document.createElement("div");
		cardFace = document.createTextNode(card.getCard());
		cardImage.appendChild(cardFace);
		cardImage.setAttribute("class","card");
		myBody.appendChild(cardImage);
	}
	
	/*Deck Definition*/
	function Deck(suit,rank)
	{
		this.cards = [];
		this.suits = suit;
		this.ranks = rank;
		
		for(var i_suit=0; i_suit<suit.length; i_suit++)
			for(var i_rank=0; i_rank<rank.length; i_rank++)
			{
				this.cards.push(new Card(suit[i_suit],rank[i_rank]))
			}
	}

	Deck.prototype.shuffle = function()
	{
		var max=(Math.random()+1) * 60000;
		var ri1,ri2,temp;

		for(var i=0;i<max;i++)
		{
			ri1 = Math.floor(Math.random()*this.cards.length);
			ri2 = Math.floor(Math.random()*this.cards.length);
			temp = this.cards[ri1];
			this.cards[ri1] = this.cards[ri2];
			this.cards[ri2] = temp;
		}
	}
	
	Deck.prototype.howMany = function()
	{
		return this.cards.length
	}
	
	Deck.prototype.pickCard = function()
	{
		return this.cards.pop();
	}	
	
	Deck.prototype.restore = function()
	{
		while(this.cards.length>0)
			this.cards.pop()
		
		for(var i_suit=0; i_suit<this.suits.length; i_suit++)
			for(var i_rank=0; i_rank<this.ranks.length; i_rank++)
			{
				this.cards.push(new Card(suit[i_suit],rank[i_rank]))
			}
	}
	
	function Player(name)
	{
		this.name = name
		this.score = 0
		this.cards = []
		this.myBody = 0
		this.scoreBlock = 0
		this.fish = 100
	}
	
	function cardScore(card)
	{
		//console.log(card.rank)
		switch(card.rank)
		{
			case "A": return 1;
			case "II": return 2;
			case "III": return 3;
			case "IV": return 4;
			case "V": return 5;
			case "VI": return 6;
			case "VII": return 7;
			case "VIII": return 8;
			case "IX": return 9;
			case "X": return 10;
			case "J": return 10;
			case "Q": return 10;
			case "K": return 10;
		}
	}
	
	Player.prototype.computeScore = function()
	{
		var flag = 0;
		this.score=0;
		for(var card=0; card<this.cards.length; card++)
		{
			if(this.cards[card].rank=="A")
				flag += 1
			else
				this.score += cardScore(this.cards[card])
		}

		if(flag>0)
		{
			if((this.score+11+flag-1)>21)
				this.score=this.score+flag
			else
				this.score=this.score+11+flag-1
		}
			
				
	}
	
	Player.prototype.displayScore = function()
	{
		writeInArea(this.name+"\n"+this.score,this.scoreBlock)

		if(this.score>21)
		{
			this.scoreBlock.setAttribute("class","scoreAreaNeg")
		}
		else
			this.scoreBlock.setAttribute("class","scoreAreaPos")
	}
	
	Player.prototype.addCard = function(card)
	{
		this.cards.push(card)
		cardDisplay(card,this.myBody)
		this.computeScore()
		this.displayScore()
	}
	
	Player.prototype.reset = function()
	{
		this.score = 0
		while(this.cards.pop()) {}
		while(this.myBody.lastChild.className=="cardInactive")
			this.myBody.removeChild(this.myBody.lastChild)
	}
	
	Player.prototype.deactivate = function()
	{	
		var temp = this.myBody.firstChild
		var tempNext = temp.nextSibling
		while(temp)
		{
			tempNext = temp.nextSibling
			if(temp.className == "card")
				temp.setAttribute("class","cardInactive")
			
			temp = tempNext
		}
	}
	
	Player.prototype.dealerMatch = function(deck)
	{
		var i=0
		while(this.score<17)
		{
			this.addCard(deck.pickCard())
		}
		
	}
	
	/*Deck Generation*/
	var suit=["♠", "♥", "♦", "♣"]
	var rank=["A","II","III","IV","VI","VII","J","Q","K"]
	// var rank=["A","X"]
	var deck = new Deck(suit,rank)
		
	/*deck depiction*/
	var myBody = document.getElementById("deckArea")
	var deckShape = document.createElement("p")
	deckShape.setAttribute("class","deck")
	deckShape.setAttribute("id","deck")
	myBody.appendChild(deckShape)

	/*button insertion*/
	//startButton
	var buttonBody = document.getElementById("buttonArea")
	var startButton = document.createElement("div");
	var text = document.createTextNode("Start")
	startButton.appendChild(text)
	startButton.setAttribute("class","utilityButtonOff")
	startButton.setAttribute("id","startButton")
	buttonBody.appendChild(startButton)
	//cardButton
	var cardButton = document.createElement("div");
	var text = document.createTextNode("Card")
	cardButton.appendChild(text)
	cardButton.setAttribute("class","utilityButtonOff")
	cardButton.setAttribute("id","cardButton")
	buttonBody.appendChild(cardButton)
	//stayButton
	var stayButton = document.createElement("div");
	var text = document.createTextNode("Stay")
	stayButton.appendChild(text)
	stayButton.setAttribute("class","utilityButtonOff")
	stayButton.setAttribute("id","stayButton")
	buttonBody.appendChild(stayButton)	
	//betButton
	var betButton = document.createElement("div");
	var text = document.createTextNode("Bet")
	betButton.appendChild(text)
	betButton.setAttribute("class","utilityButton")
	betButton.setAttribute("id","betButton")
	buttonBody.appendChild(betButton)
	
	/*score depiction*/
	//player score
	var myBody = document.getElementById("scoreArea")
	var scoreShape = document.createElement("p")
	scoreShape.setAttribute("class","scoreAreaPos")
	scoreShape.setAttribute("id","score")
	myBody.appendChild(scoreShape)
	//dealer score 
	var dealerScoreShape = document.createElement("p")
	dealerScoreShape.setAttribute("class","scoreAreaPos")
	dealerScoreShape.setAttribute("id","dealerScore")
	myBody.appendChild(dealerScoreShape)	
	//result score 
	var resultShape = document.createElement("p")
	resultShape.setAttribute("class","resultArea")
	resultShape.setAttribute("id","result")
	myBody.appendChild(resultShape)
	//player fish
	var playerFishShape = document.createElement("p")
	text = document.createTextNode("")
	playerFishShape.appendChild(text)
	playerFishShape.setAttribute("class","fishActive")
	playerFishShape.setAttribute("id","playerFish")
	myBody.appendChild(playerFishShape)
	//fish
	var fishShape = document.createElement("p")
	fishShape.setAttribute("class","fishInactive")
	fishShape.setAttribute("id","fish")
	myBody.appendChild(fishShape)	

		
	/* Player generation */
	var name = prompt("Ciao!\nInserisci il tuo nome: ")
	var player = new Player(name)
	player.myBody = document.getElementById("cardArea")
	player.scoreBlock = document.getElementById("score")
	playerFishShape.innerHTML = player.fish
	/* Dealer generation */
	var dealer = new Player("dealer")
	dealer.myBody = document.getElementById("deckArea")
	dealer.scoreBlock = document.getElementById("dealerScore")

	/* Actions */
	var tempCard
	var event
	var fixedBet = 10
			
	// Start the game
	startButton.addEventListener("click",function()
	{

		if(startButton.className=="utilityButton")
		{
			player.reset();
			dealer.reset();
			deck.restore();
			deck.shuffle();
			
			deckShape.setAttribute("class","deck")
			
			writeInArea(0,scoreShape)
			writeInArea(0,dealerScoreShape)
			writeInArea("",resultShape)
			resultShape.setAttribute("class","resultArea")
			
			
			this.setAttribute("class","buttonHidden")

			cardButton.setAttribute("class","utilityButton")
			stayButton.setAttribute("class","utilityButton")
			betButton.setAttribute("class","utilityButtonOff")
			startButton.setAttribute("class","utilityButtonOff")
			
			dealer.addCard(deck.pickCard())
			
			player.addCard(deck.pickCard())			
			player.addCard(deck.pickCard())			
		}
	})	
	
	//stay and let the dealer play
	stayButton.addEventListener("click",function()
	{
		dealer.dealerMatch(deck)
		
		if((dealer.score<player.score || dealer.score>21) && player.score<=21)
		{
			writeInArea(player.name+"\nwins",resultShape)
			resultShape.setAttribute("class","resultAreaPos")
			player.fish += 2*(+fishShape.innerHTML)
			writeInArea(player.fish,playerFishShape)
		}
		else
		{
			writeInArea(dealer.name+"\nwins",resultShape)
			resultShape.setAttribute("class","resultAreaNeg")
		}
		writeInArea("",fishShape)
		fishShape.setAttribute("class","fishInactive")
		
		player.deactivate()
		dealer.deactivate()
		
		stayButton.setAttribute("class","utilityButtonOff")
		betButton.setAttribute("class","utilityButton")
		cardButton.setAttribute("class","utilityButtonOff")
	})

	//Betting
	betButton.addEventListener("click",function()
	{
		if(betButton.className=="utilityButton")
		{
			if(player.fish>0)
			{
				if(fishShape.className=="fishInactive")
				{
					fishShape.setAttribute("class","fishBetted")
				}
				fishShape.innerHTML=+fishShape.innerHTML+fixedBet		
				player.fish -= fixedBet
				writeInArea(player.fish,playerFishShape)
				
				if(startButton.className="utilityButtonOff")
					startButton.setAttribute("class","utilityButton")
			}
			
			if(player.fish==0)
				betButton.setAttribute("class","utilityButtonOff")
		}		
	})

	// Cards picking	
	cardButton.addEventListener("click",function()
	{
		if(player.score<21 && this.className == "utilityButton")
		{
			
			if(deck.howMany()>=1)
			{	
				player.addCard(deck.pickCard())

				if(deck.howMany()==0)
				{
					this.setAttribute("class","emptyDeck");
					button.setAttribute("class","buttonVisible")
				}
			}
			
		}
		if(player.score>=21)
		{
			cardButton.setAttribute("class","utilityButtonOff")
			event = new Event("click")
			stayButton.dispatchEvent(event)
		}
	})
	

})

