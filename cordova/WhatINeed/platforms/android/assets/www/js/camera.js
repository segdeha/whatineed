console.log(Quagga);

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    pictureSource   = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

    document.getElementById('capture').addEventListener('click', capturePhoto);
    // document.getElementById('captureedit').addEventListener('click', capturePhotoEdit);
    // document.getElementById('getphotolibrary').addEventListener('click', function () {
    //     getPhoto(pictureSource.PHOTOLIBRARY);
    // });
    // document.getElementById('getphotosaved').addEventListener('click', function () {
    //     getPhoto(pictureSource.SAVEDPHOTOALBUM)
    // });
}

// Called when a photo is successfully retrieved
// @param String imageData base64-encoded image data
function onPhotoDataSuccess(imageData) {
    var src = "data:image/jpeg;base64," + imageData;

    var resultSpan = document.getElementById('result');
    resultSpan.innerHTML = 'Working';

    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = src;

    var opts = {
        decoder: {
            readers: [
                // 'code_128_reader',
                // 'ean_reader',
                // 'ean_8_reader',
                // 'upc_reader',
                // 'upc_e_reader',
                'code_128_reader',
                'ean_reader',
                'ean_8_reader',
                'code_39_reader',
                'code_39_vin_reader',
                'codabar_reader',
                'upc_reader',
                'upc_e_reader',
                'i2of5_reader',
            ] // List of active readers
        },
        locate: true, // try to locate the barcode in the image
        src: src // or 'data:image/jpg;base64,' + data
    };

    function callback(result) {
        if(result.codeResult) {
            resultSpan.innerHTML = result.codeResult.code;
        }
        else {
            resultSpan.innerHTML = 'no barcode detected';
        }
    }

    Quagga.decodeSingle(opts, callback);
}

// // Called when a photo is successfully retrieved
// // @param String imageURI Image file URI
// function onPhotoURISuccess(imageURI) {
//     var largeImage = document.getElementById('largeImage');
//     largeImage.style.display = 'block';
//     largeImage.src = imageURI;
// }

// Take picture using device camera and retrieve image as base64-encoded string
function capturePhoto() {
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: destinationType.DATA_URL
    });
}

// // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
// function capturePhotoEdit() {
//     navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
//         quality: 20,
//         allowEdit: true,
//         destinationType: destinationType.DATA_URL
//     });
// }

// // Retrieve image file location from specified source
// function getPhoto(source) {
//     navigator.camera.getPicture(onPhotoURISuccess, onFail, {
//         quality: 50,
//         destinationType: destinationType.FILE_URI,
//         sourceType: source
//     });
// }

function onFail(message) {
    alert('Image capture failed because: ' + message);
}
