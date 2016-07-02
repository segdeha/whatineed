(function (window, document, $, undefined) {

    'use strict';

    function onDeviceReady() {
        $('.ui.form').form({
            fields: {
                email: {
                    identifier  : 'email',
                    rules: [
                        { type : 'empty', prompt : 'Enter your e-mail address' },
                        { type : 'email', prompt : 'Enter a valid e-mail' }
                    ]
                },
                password: {
                    identifier  : 'password',
                    rules: [
                        { type : 'empty', prompt : 'Please enter your password' },
                        { type : 'length[6]', prompt : 'Your password must be at least 6 characters' }
                    ]
                }
            }
        });

        $('.ui.form').submit(function (evt) {
            $('#login').fadeOut(250, function () {
                $('#lists').addClass('show');
                window.requestAnimationFrame(initList);
            });
        });
    }

    function initList() {
        var barcodeReader = new BarcodeReader();
        $('#new-product-button').on('click', barcodeReader.capturePhoto);

        var selector = '.active .list .item';
        // TODO fetch data from server
        $.getJSON('js/_data.json', function (data) {
            var list = new ReorderableList(selector, data);
            list.render();
        });

        $('.menu .item').tab();

        $('.active .list').on('click', function (evt) {
            var src;
            if (evt.target.matches('.header') || evt.target.matches('.description')) {
                // get image source from div.item[data-src]
                src = $(evt.target).parents('.item').attr('data-src') || 'img/default-image.png';
                // set image source
                $('#product-info .image').attr('src', src);
                // show modal
                $('#product-info').modal('show');
            }
        });

        var rangeInput = document.querySelector('[name="number-of-days"]');
        var rangeValue = document.getElementById('number-of-days');

        rangeInput.addEventListener('input', function (evt) {
            rangeValue.innerHTML = this.value;
        });

        rangeValue.innerHTML = rangeInput.value;
    }

    function onDOMContentLoaded() {
        document.addEventListener('deviceready', onDeviceReady);
    }

    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

}(this, this.document, jQuery));
