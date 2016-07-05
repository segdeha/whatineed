/* jshint esversion: 6 */
(function (window, document, $, undefined) {

    'use strict';

    // update whenever ngrok is restarted
    window.BASEURL = 'http://17e5c9e7.ngrok.io';

    function onDeviceReady() {
        $('.ui.form').form({
            fields: {
                email: {
                    identifier  : 'username',
                    rules: [
                        { type : 'empty', prompt : 'Enter your username' }
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
            evt.preventDefault();
            if (null === document.querySelector('.field.error')) {
                // TODO make ajax call to authenticate, then do the below
                $('#login').fadeOut(250, function () {
                    $('#lists').addClass('show');
                    window.requestAnimationFrame(initList);
                });
            }
        });
    }

    function initList() {
        var barcodeReader = new BarcodeReader();
        $('#new-product-button').on('click', barcodeReader.capturePhoto.bind(barcodeReader));

        function getList() {
            var selectors = {
                list: '.active .list',
                items: '.active .list .item'
            };
            // TODO fetch data from server
            var getting = $.getJSON(`${BASEURL}/static/_data.json`);
            getting.done(function (data) {
                var list = new ReorderableList(selectors, data);
                list.render();
            });
        }

        getList();

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

        $('#new-product .primary.button').click(function (evt) {
            this.classList.add('loading');
            var barcode = document.getElementById('barcode-result').innerHTML;
            // TODO make ajax request to save product as a thing this user buys
            var posting = $.post({
                url: `${BASEURL}/api/thing`,
                data: { barcode: barcode }
            });
            posting.done(function (json) {
                // thing saved successfully, get refreshed list
                getList();
            });
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
