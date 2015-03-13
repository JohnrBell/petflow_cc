var cart_id = generaterandom() //generates a unique id. 

$(function(){
	
	$('#cart #unique').text(cart_id) //sets title of cart to the unique id. 
	fixbuttons() //sets proper button visiblity
	removeClickEvent()



	$('.clearcart').on('click',function(event){ //clear cart button function
		$('#whatshappening').text("") //clears text showing whats happening
		if (checkforenable()){
			items = $(this).parents('#cart').children('.item') //gets all the items in the cart.

			$.each(items,function(index,value){ //for each item in cart, do... 
				item_id = $(value).attr('id') //get id from item div (where it's stored

				oldtext = $('#whatshappening').text() //prints whats happening.
				newtext = ('DELETE item number: '+item_id) //prints whats happening.
				$('#whatshappening').text(oldtext+' '+newtext) //prints whats happening.

				$.ajax({	
				url: "/carts/"+cart_id+"/items/"+item_id, //route to api 
				type: 'DELETE',
				})
			})
			items.remove() //removes items from the DOM 
		}else{
			event.preventDefault() //does nothing if disabled. 
		}
	})

	$('.updateqty').on('click',function(event){ //update cart quantity button function
		if (checkforenable()){
			// items = []
			// item = {}
			contents = $('#cart').children('.item') //gets all the items in the cart.
			items = makeItemsArray(contents) //makes array/hash 
			items = JSON.stringify(items); //encode items as json 
			$('#whatshappening').text(('POST: items:'+items)) //prints whats happening.
			$.ajax({	
				url: "/carts/"+cart_id+"/items", //route to api 
				type: 'POST',
				data: items,
			})
		}else{
			event.preventDefault() //does nothing if disabled. 
		}
	})


	$('.addtocart').on('click',function(event){ //add to cart button function
		if (checkforenable()){
			item = $(this).parent()
			last = $('#cart')
			exists = false
			
			id = $(this).parent('.item').attr('id') //gets id of item adding
			qty = parseInt($(this).parent('.item').children('.qty').children('.qty_val').val()) //gets quantity to add
			contents = $('#cart').children('.item') //gets all the items in the cart.
			
			$.each(contents,function(index,value){
				if (value.id == id){ //if the item to add is already in the cart
					orig = parseInt($(this).children('.qty').children('.qty_val').val()) //get cart quantity 
					orig+=qty //add desired qty to cart qty
					$(this).children('.qty').children('.qty_val').val(orig) //update qty in cart. 
					exists = true //says the item already existed in the cart. 
				}
			})

			if (exists==false){ //if the item did not exists...
				$(item).clone().appendTo(last) //add it, not update
				fixbuttons() //adjust buttons since it's in the cart now
			}
			removeClickEvent()		
			contents = $('#cart').children('.item') //gets all the items in the cart.
			items = makeItemsArray(contents) //makes array/hash 
			items = JSON.stringify(items); //encode items as json 
			$('#whatshappening').text('PUT: '+items) //prints whats happening.
			$.ajax({	
				url: "/carts/"+cart_id+"/items", //route to api 
				type: 'PUT',
				data: items
			})


		}else{
			event.preventDefault() //does nothing if disabled. 
		}
	})


}) //close onload


function makeItemsArray(contents){ //function to make data structure for cart items
	items = [] //blank array
	item = {} //blank hash
	$.each(contents,function(index,value){ //loops though the items in cart.				
		id = $(value).attr('id') //get id 
	  qty = $(value).children('.qty').children('.qty_val').val() //get quantity
		item = {'item_id':id,'quantity':qty} //make hash
		items.push(item) //push to array
	})
	return items; //return data as an array of hashes
}

function checkforenable(){ //checks if the cart is enabled. 
	if($("#cartstatus").is(':checked')){
		return true	//if it is, return true
	}else{
		alert('cart is disabled!') //alert and 
		return false	//return false if disabled.
	}
}

function generaterandom(){ //generates a random string of 7 characters
    var random = ""; 
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; //possible chars
    for(i=0; i<7; i++){ //length of string
      random += chars.charAt(Math.floor(Math.random() * chars.length)); //makes it
		}
    return random; //returns it
}

function fixbuttons(){ //sets proper button visiblity depending on ".item" location (cart or itemlist)
	$('#itemcontainer .item .removefromcart').hide() //hides the remove from cart buttons if item is in item list
	$('#itemcontainer .item .updateqty').hide() //hides the remove from cart buttons if item is in item list
	$('#cart .item .addtocart').hide() //hides the remove from cart buttons if item is in item list
	$('#cart .item .removefromcart').show() //hides the remove from cart buttons if item is in item list
}

function removeClickEvent(){
		$('.removefromcart').on('click',function(event){ //remove button function
		if (checkforenable()){
			item_id = $(this).parent().attr('id') //get id from item div (where it's stored)
			$(this).parent().remove() //remove from DOM
			$('#whatshappening').text('DELETE item number: '+item_id+' from cart.') //prints whats happening.
			$.ajax({	
				url: "/carts/"+cart_id+"/items/"+item_id, //route to api 
				type: 'DELETE',
			})
		}else{
			event.preventDefault() //does nothing if disabled. 
		}
	})
}