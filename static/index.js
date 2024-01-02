window.onload = () => {
    $('#sendbutton').click(() => {
        const formData = new FormData();
        for (let i = 1; i <= 6; i++) {
            const input = $(`input[name=image${i}]`)[0];
            if (input.files && input.files[0]) {
                formData.append('image', input.files[0]);
            }
        }

        // Hiển thị thông tin trong console cho mục đích debug
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
            success: function(data) {
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
  function readUrl(input, imageBoxNumber) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Tạo và cập nhật hình ảnh
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.height = '150px';  // Thiết lập kích thước hình ảnh
            img.style.width = '200px';

            // Lấy phần tử để hiển thị hình ảnh và thêm hình ảnh vào đó
            const imageBox = document.getElementById(`preview-image-box-${imageBoxNumber}`);
            imageBox.innerHTML = ''; // Xóa nội dung hiện tại (nếu có)
            imageBox.appendChild(img);
        };

        reader.readAsDataURL(input.files[0]);
    }
}