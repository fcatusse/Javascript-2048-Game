const MAP_SIZE = 4;

var SCORE = 0;
var MAP = new Array();
var WIN = false;
var WIN_SCORE = 2048;

(function($) {

	//$(document).ready(function () {

 	$.fn.startGame = function()
	{
		console.log("Game Start");
		init();

		/*

			KEYBOARD MANAGER

		*/

		$(document).keyup( function(e) {
			switch(e.which) {
				case 37:
					console.log("Move left");
					move("left", false);
					break;
				case 38:
					console.log("Move up");
					move("top", false);
					break;
				case 39:
					console.log("Move right");
					move("right", false);
					break;
				case 40:
					console.log("Move bottom");
					move("bottom", false);
					break;
			}
		});

		/*

			MAP

		*/

		function init(option)
		{
			WIN = false;
			SCORE = 0;

			if (getCookie("cookie2048"))
			{
				MAP = JSON.parse(getCookie("cookie2048"));
				console.log(MAP);
			}
			else
			{
				for (var j=0; j < MAP_SIZE; j++)
				{
					MAP[j] = new Array();
					for (var i=0; i < MAP_SIZE; i++)
					{
						MAP[j][i] = 0;
					}
				}
				addNewTile();
				console.log(MAP);
			}
			display();
		}
		
		/*

			MOVE YOUR MAP !

		*/

		
		function move(direction, modified) 
		{
			var is_move = false;
			
			var k = 0;
			while (k < MAP_SIZE)
			{
				var i = 0;
				while (i < MAP_SIZE) 
				{
					var j = 0;
					while (j < MAP_SIZE)
					{
						switch(direction)
						{
							case "left":
								if ( (MAP[k][j+1] > 0) && (MAP[k][j] == 0) ) {
									MAP[k][j] = MAP[k][j+1];
									MAP[k][j+1] = 0;
									is_move = true;
									modified = true;
								}
								break;
							case "right":
								if ( (MAP[k][j+1] == 0) && (MAP[k][j] > 0) ) {
									MAP[k][j+1] = MAP[k][j];
									MAP[k][j] = 0;
									is_move = true;
									modified = true;
								}
								break;
							case "top":
								if ( (j < 3) && (MAP[j+1][k] > 0) && (MAP[j][k] == 0) ) {
									MAP[j][k] = MAP[j+1][k];
									MAP[j+1][k] = 0;
									is_move = true;
									modified = true;
								}
								break;
							case "bottom":
								if ( (j < 3) && (MAP[j][k] > 0) && (MAP[j+1][k] == 0) ) {
									MAP[j+1][k] = MAP[j][k];
									MAP[j][k] = 0;
									is_move = true;
									modified = true;
								}
								break;
						}
						j++;
					}
					i++;
				}
				k++;
			}
			matchTest(direction, is_move, modified);
		}
		
		function matchTest(direction, is_move, modified)
		{
			var is_match = false;

			for (var j=0; j < MAP_SIZE; j++)
			{
				for (var i=0; i < MAP_SIZE; i++)
				{
					switch(direction)
					{
						case "left":
						case "right":
							if ( (MAP[j][i] == MAP[j][i+1]) && (MAP[j][i] > 0) )
							{	
								MAP[j][i] += MAP[j][i+1];
								MAP[j][i+1] = 0;
								is_match = true;
								modified = true;
								addScore(MAP[j][i]);
							}
							break;
						case "top":
						case "bottom":
							if ( ((j < (MAP_SIZE-1)) && MAP[j][i] == MAP[j+1][i]) && (MAP[j][i] > 0) )
							{	
								MAP[j][i] += MAP[j+1][i];
								MAP[j+1][i] = 0;
								is_match = true;
								modified = true;
								addScore(MAP[j][i]);
							}
							break;
					}
				}
			}
			if (is_match)
			{
				move(direction);
			}
			else if (modified)
			{
				addNewTile();
				console.log("on rentre")
				var mapJson = JSON.stringify(MAP); 
				setCookie("cookie2048", mapJson, 8); 
				display();
			}
			var mapJson = JSON.stringify(MAP);
			setCookie("cookie2048", mapJson, 8); 
			display();
		}

		function addNewTile()
		{
			var empty_tile = new Array();
			var rand_nb = 0;
			var chance = 0;

			for (var j=0; j < MAP_SIZE; j++)
			{
				for (var i=0; i < MAP_SIZE; i++)
				{
					if (MAP[j][i] == 0)
					{
						empty_tile.push([j,i]);
					}
				}
			}
			console.log("empty_tile.length",empty_tile.length);
			if (empty_tile.length > 1)
			{
				rand_nb = Math.floor(Math.random() * empty_tile.length);
				chance = Math.random();
				if (chance <= 0.1)
				{
					MAP[empty_tile[rand_nb][0]][empty_tile[rand_nb][1]] = 4;
				}
				else
				{
					MAP[empty_tile[rand_nb][0]][empty_tile[rand_nb][1]] = 2; 
				}
			} else {
				alert("You loose... Try again ?");
				init();
			}
		}

		function addScore(add)
		{
			SCORE += add;
			if (add ==  WIN_SCORE && WIN == false)
			{
				alert("You win ! Let's try "+(WIN_SCORE*2)+" :)");
				WIN = true;
			}
		}


		function display()
		{
			var x = 0;
			var y = 0;

			$('.score').remove();
			$('body').append('<div class="score"><div class="score--label">score<div><div class="score--num">'+SCORE+'</div></div>');

			$('.container').remove();
			$('body').append('<div class="container" style="width:'+100*MAP_SIZE+'; height:'+100*MAP_SIZE+';"></div>');
			for (var j=0; j < MAP_SIZE; j++)
			{
				for (var i=0; i < MAP_SIZE; i++)
				{
					x = (i * 100) + 1;
					y = (j * 100) + 1;
					$('.container').append('<div id="'+j+i+'" class="tile c'+MAP[j][i]+'" style="left:'+x+'; top:'+y+';">'+MAP[j][i]+'</div>');
				}
			}

			$('.btn_start').remove();
			$('body').append('<div class="btn_start">Restart Game</div>');
			$('.btn_start').click( function() {
				init("restart");
			});

		}
		
		function setCookie(cname, cvalue, exdays) {
    		var d = new Date();
    		d.setTime(d.getTime() + (exdays*24*60*60*1000));
    		var expires = "expires="+ d.toUTCString();
    		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		}
		function getCookie(cname) 
		{
    		var name = cname + "=";
    		var decodedCookie = decodeURIComponent(document.cookie);
    		var ca = decodedCookie.split(';');
    		for(var i = 0; i <ca.length; i++)
    		{
        		var c = ca[i];
        		while (c.charAt(0) == ' ')
        		{
            		c = c.substring(1);
        		}
        		if (c.indexOf(name) == 0) {
            		return c.substring(name.length, c.length);
        		}
   			}
    		return "";
		}

	};

// })

})(jQuery);

$(document).startGame();