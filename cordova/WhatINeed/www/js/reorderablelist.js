/* jshint esversion: 6 */
/**
 * Create a reorderable list of items
 * @requires jQuery
 */
var ReorderableList = (function (window, document, $, undefined) {

    // 'use strict'; // FIXME something here doesn’t agree with strict mode

    // from: http://stackoverflow.com/a/7180095/11577
    // TODO: find a way to do this without altering Array.prototype
    if ('function' !== typeof Array.prototype.move) {
        Array.prototype.move = function (from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        };
    }

    /**
     * @constructor
     */
    function ReorderableList(selectors, data) {
        this.selectors = selectors;
        this.data = data;
        // create an array to hold the item ids (populated by render)
        this.ids = [];
        // the height as a number of one list item (in px)
        this.itemHeight = null;
        // start preloading images
        var delay = 100; // ms
        this.data.forEach(function (item, idx) {
            setTimeout(function () {
                var img = new Image();
                img.src = item.src;
            }, delay * idx);
        });
    }

    var proto = ReorderableList.prototype;

    /**
     * Fetch results to display in the list
     * @static
     * @requires window.BASEURL and window.USERID to be set
     */
    proto.fetch = function () {
        var selectors = {
            list: '.active .list',
            items: '.active .list .item'
        };
        // fetch data from server
        // var getting = $.getJSON(`${BASEURL}/api/things/${USERID}/`);
        var getting = $.getJSON(`${BASEURL}/static/_data.json`);
        getting.done(function (data) {
            var list = new ReorderableList(selectors, data);
            list.render();
            // delay a quarter second so it’s not so jarring
            setTimeout(function () {
                $('#refresh').removeClass('loading');
            }, 250);
        });
    };

    /**
     * Render a list
     */
    proto.render = function () {
        function buildItem(item) {
            html += `
                <div class="item" data-thing-id="${item.id}" data-purchase-id="${item.id}" data-src="${item.src}">
                    <div class="content">
                        <div class="ui checkbox left-floated-checkbox">
                            <input type="checkbox" name="example">
                            <label></label>
                        </div>
                        <span class="status ${item.status}"></span>
                        <span class="header">${item.name}</span>
                        <div class="description">Last purchased ${item.last_purchased} ago</div>
                    </div>
                </div>`
            ;
            this.ids.push(item.id);
        }

        function postInsertion() {
            // grab all of the list items from the dom, cast as an array
            this.items = Array.prototype.slice.call(document.querySelectorAll(this.selectors.items));
            // get height of any 1 item
            this.itemHeight = parseInt(window.getComputedStyle(this.items[0], null).getPropertyValue('height'), 10);
            // reorder the items
            this.reorder();
            // activate the checkboxes
            this.initCheckboxes();
        }

        // render items
        var html = '';
        this.data.forEach(buildItem.bind(this));
        $(this.selectors.list).html(html);

        // get the items after they’ve been inserted into the dom
        window.requestAnimationFrame(postInsertion.bind(this));
    };

    /**
     * Reorder a previously rendered list
     */
    proto.reorder = function () {
        function setTransform(id, idx) {
            var item = document.querySelector(`[data-thing-id="${id}"]`);
            var rule = `translate3d(0, ${idx * this.itemHeight}px, 0)`;
            if (idx > 0) {
                item.style.borderTop = '1px solid rgba(34, 36, 38, 0.15)';
            }
            else {
                item.style.borderTop = 'none';
            }
            item.style.transform = rule;
        }
        // set height of container
        if (this.items.length > 0) {
            this.items[0].parentNode.style.height = `${(this.itemHeight * this.items.length)}px`;
            this.ids.forEach(setTransform.bind(this));
        }
    };

    /**
     * Activate checkboxes
     */
    proto.initCheckboxes = function () {
        var self = this; // store instance because we need to use `this` later
        $('.active .checkbox').checkbox({
            onChecked: function() {
                var thing_id    = self.getThingIdFromInput(this);
                var purchase_id = self.getPurchaseIdFromInput(this);

                // move the item to the end of the array
                var idx = self.ids.indexOf(thing_id);
                self.ids.move(idx, self.ids.length - 1);

                // change status to 'later'
                $(this)
                    .parents('.checkbox')
                    .siblings('.status')
                    .removeClass()
                    .addClass('status later')
                    .parents('.item')
                    .addClass('checked')
                ;

                // reorder items in the ui
                self.reorder();

                // TODO save new state to server
                // var posting = $.post({
                //     url: `${BASEURL}/api/purchase/`,
                //     data: {
                //         user_id: USERID,
                //         thing_id: thing_id,
                //         purchase_id: purchase_id,
                //         action: 'purchase'
                //     }
                // });
                // thinking we don’t get a new list on every save, disruptive
                // posting.done(function (json) {
                //     // thing saved successfully, get refreshed list
                //     ReorderableList.prototype.fetch();
                // });
                // posting.fail(function (json) {
                //     alert('Saving purchase failed. Try again.');
                // });
            },
            onUnchecked: function() {
                var thing_id    = self.getThingIdFromInput(this);
                var purchase_id = self.getPurchaseIdFromInput(this);

                // move the item to the beginning of the array
                // TODO: move the item to the previous position?
                var idx = self.ids.indexOf(thing_id);
                self.ids.move(idx, 0);

                // change status to 'immediately'
                $(this)
                    .parents('.checkbox')
                    .siblings('.status')
                    .removeClass()
                    .addClass('status immediately')
                    .parents('.item')
                    .removeClass('checked')
                ;

                // reorder items in the ui
                self.reorder();

                // TODO save new state to server
                // var posting = $.post({
                //     url: `${BASEURL}/api/purchase/`,
                //     data: {
                //         user_id: USERID,
                //         thing_id: thing_id,
                //         purchase_id: purchase_id,
                //         action: 'unpurchase' // ???
                //     }
                // });
                // thinking we don’t get a new list on every save, disruptive
                // posting.done(function (json) {
                //     // thing saved successfully, get refreshed list
                //     ReorderableList.prototype.fetch();
                // });
                // posting.fail(function (json) {
                //     alert('Saving purchase failed. Try again.');
                // });
            }
        });
    };

    /**
     * Get the DB ID for a thing from the <input>
     */
    proto.getThingIdFromInput = function (input) {
        return $(input).parents('.item').attr('data-thing-id');
    };

    /**
     * Get the DB ID for a purchase from the <input>
     */
    proto.getPurchaseIdFromInput = function (input) {
        return $(input).parents('.item').attr('data-purchase-id');
    };

    return ReorderableList;

}(this, this.document, jQuery));
