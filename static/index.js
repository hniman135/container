window.onload = () => {
	$('#sendbutton').click(() => {
		imagebox = $('#imagebox')
		input = $('#imageinput')[0]
		if(input.files && input.files[0])
		{
			let formData = new FormData();
			formData.append('image' , input.files[0]);
			$.ajax({
				url: "http://localhost:5000/detectObject", // fix this to your liking
				type:"POST",
				data: formData,
				cache: false,
				processData:false,
				contentType:false,
				error: function(data){
					console.log("upload error" , data);
					console.log(data.getAllResponseHeaders());
				},
				success: function(data){
					console.log(data);
					bytestring = data['status']
					image = bytestring.split('\'')[1]
					imagebox.attr('src' , 'data:image/jpeg;base64,'+image)
					displayIDAndTime(data);
				}
			});
		}
	});
	$('#logbutton').click(() => {
        // Redirect to the /history route
        window.open("http://127.0.0.1:5000/history", "_blank");
    });
};

function displayIDAndTime(data) {
	// Assuming the data from the server includes 'ID' and 'time' fields
	let ID = data['ID'];
	let time = data['time'];
  
	// Display ID and time in your HTML or update any specific elements
	$('#ID').text(ID);
	$('#time').text(time);
  }

function readUrl(input){
	imagebox = $('#imagebox')
	console.log("evoked readUrl")
	if(input.files && input.files[0]){
		let reader = new FileReader();
		reader.onload = function(e){
			// console.log(e)
			
			imagebox.attr('src',e.target.result); 
			imagebox.height(500);
			imagebox.width(800);
		}
		reader.readAsDataURL(input.files[0]);
	}

	
}