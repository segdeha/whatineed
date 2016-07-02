/**
 * BarcodeReader
 * @requires Quagga
 */
var BarcodeReader = (function (window, document, $, undefined) {

    'use strict';

    function BarcodeReader() {}

    var proto = BarcodeReader.prototype;

    // Called when a photo is successfully retrieved
    // @param String imageData base64-encoded image data
    proto.onPhotoDataSuccess = function (imageData) {
        var dimmer = document.querySelector('.dimmer');
        var src = 'data:image/jpeg;base64,' + imageData;

        // show loading indicator
        dimmer.querySelector('.text').innerHTML = 'Deciphering barcode…';
        dimmer.classList.add('active');

        function callback(result) {
            if(result.codeResult) {
                // display barcode value
                document.getElementById('barcode-result')
                    .innerHTML = `Barcode value: ${result.codeResult.code}`;

                // update status for the user
                dimmer.querySelector('.text').innerHTML = 'Fetching product info…';

                $.getJSON(`http://17e5c9e7.ngrok.io/api/thing/${result.codeResult.code}/`, function (json) {
                    window.requestAnimationFrame(function () {
                        // preload the image before showing the modal
                        var img = new Image();
                        img.onload = function () {
                            // set product info in modal
                            $('#new-product .header').html(json.data.name);
                            $('#new-product .content .image').attr('src', json.data.product_image);

                            // hide loading indicator
                            dimmer.classList.remove('active');

                            // show product modal
                            $('#new-product').modal('show');
                        };
                        img.src = json.data.product_image;
                    });
                });
            }
            else {
                // hide loading indicator
                dimmer.classList.remove('active');
                window.requestAnimationFrame(function () {
                    alert('No barcode detected. Try again.');
                });
            }
        }

        Quagga.decodeSingle({
            decoder: {
                readers: [
                    // order matters, upc is most common in the usa
                    'upc_reader', 'upc_e_reader', 'ean_reader', 'ean_8_reader',
                    'code_128_reader', 'code_39_reader', 'code_39_vin_reader',
                    'codabar_reader', 'i2of5_reader',
                ] // List of active readers
            },
            locate: true, // try to locate the barcode in the image
            src: src // or 'data:image/jpg;base64,' + data
        }, callback);
    };

    // take picture using device camera and retrieve image as base64-encoded string
    proto.capturePhoto = function () {
        navigator.camera.getPicture(this.onPhotoDataSuccess, this.onCaptureFail, {
            quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL
        });
    };

    // image capture failed
    proto.onCaptureFail = function (message) {
        alert('Image capture failed because: ' + message);
    };

    return BarcodeReader;

}(this, this.document, jQuery));
