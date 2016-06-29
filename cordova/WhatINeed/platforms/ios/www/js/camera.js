// requirejs(
//     [
//         // 'cordova.js',
//         './jquery',
//         './semantic',
//         './quagga'
//     ],
//     function (/*cordova, */$, semantic, quagga) {
//         // var exec = cordova.require('cordova/exec');
//
//         // const Quagga = require('../node_modules/quagga/dist/quagga.js').default;
//         // const Quagga = quagga.default;

        console.log(Quagga);

        var pictureSource;   // picture source
        var destinationType; // sets the format of returned value

        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            pictureSource   = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;

            document.getElementById('capture').addEventListener('click', capturePhoto);
            document.getElementById('captureedit').addEventListener('click', capturePhotoEdit);
            document.getElementById('getphotolibrary').addEventListener('click', function () {
                getPhoto(pictureSource.PHOTOLIBRARY);
            });
            document.getElementById('getphotosaved').addEventListener('click', function () {
                getPhoto(pictureSource.SAVEDPHOTOALBUM)
            });
        }

        // Called when a photo is successfully retrieved
        // @param String imageData base64-encoded image data
        function onPhotoDataSuccess(imageData) {
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'block';
            smallImage.src = "data:image/jpeg;base64," + imageData;
        }

        // Called when a photo is successfully retrieved
        // @param String imageURI Image file URI
        function onPhotoURISuccess(imageURI) {
            var largeImage = document.getElementById('largeImage');
            largeImage.style.display = 'block';
            largeImage.src = imageURI;
        }

        // Take picture using device camera and retrieve image as base64-encoded string
        function capturePhoto() {
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                quality: 50,
                destinationType: destinationType.DATA_URL
            });
        }

        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
        function capturePhotoEdit() {
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                quality: 20,
                allowEdit: true,
                destinationType: destinationType.DATA_URL
            });
        }

        // Retrieve image file location from specified source
        function getPhoto(source) {
            navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                quality: 50,
                destinationType: destinationType.FILE_URI,
                sourceType: source
            });
        }

        function onFail(message) {
            alert('Image capture failed because: ' + message);
        }
    // });
