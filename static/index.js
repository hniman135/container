window.onload = () => {
    $('#sendbutton').click(() => {

        const input = $('#imageinput')[0];

        if (input.files && input.files.length > 0) {
            const formData = new FormData();
            // Append all selected images to the FormData object
            for (let i = 0; i < input.files.length; i++) {
                formData.append('image', input.files[i]);
            }
            for (const value of formData.values()) {
                console.log(value);
            }
            
            $.ajax({
                url: "http://localhost:5000/detectObject", // Update this to your backend endpoint
                type: "POST",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                error: function (data) {
                    console.log("upload error", data);
                    console.log(data.getAllResponseHeaders());
                },
                success: function(data){
                    console.log(data);
                    displayIDAndTime(data);
                    for (let i = 1; i <= 6; i++) {
                        $('#image-box-' + i).empty();
                    }
                    data['images'].forEach((imageData, index) => {
                        if (index < 6) {  // Limit to the first 6 images
                            let bytestring = imageData['status'];
                            let image = bytestring.split('\'')[1]; // Extract the base64 string
                            let imageElement = $('<img>', {
                                src: 'data:image/jpeg;base64,' + image,
                                class: 'processed-image'
                            });
                        
                            // Append to the corresponding image box
                            $('#image-box-' + (index + 1)).append(imageElement);
                            
                        }
                        
                    });
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
    console.log(ID);
    console.log(time);
	// Display ID and time in your HTML or update any specific elements
	$('#ID').text(ID);
	$('#time').text(time);
  }
function readUrl(input) {
    // Clear existing images in all image boxes
    $('.image-box').empty();

    if (input.files && input.files.length > 0) {
        for (let i = 0; i < input.files.length; i++) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Create an image element for each selected file
                const imgElement = $('<img>');
                imgElement.attr('src', e.target.result);
                imgElement.height(150);
                imgElement.width(200);

                // Append the image element to the corresponding image box
                const imageBoxId = '#image-box-' + (i + 1);
                $(imageBoxId).append(imgElement);
            };

            reader.readAsDataURL(input.files[i]);
        }
    }
}
