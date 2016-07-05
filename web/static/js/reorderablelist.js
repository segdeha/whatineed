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
     * Render a list
     */
    proto.render = function () {
        // render items
        var html = '';

        function buildItem(item) {
            html += `
                <div class="item" data-id="${item.id}" data-src="${item.src}">
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

        this.data.forEach(buildItem.bind(this));
        $(this.selectors.list).html(html);

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

        // get the items after they’ve been inserted into the dom
        window.requestAnimationFrame(postInsertion.bind(this));
    };

    /**
     * Reorder a previously rendered list
     */
    proto.reorder = function () {
        function setTransform(id, idx) {
            var item = document.querySelector(`[data-id="${id}"]`);
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
        var self = this;
        $('.active .checkbox').checkbox({
            onChecked: function() {
                var id = self.getIdFromInput(this);

                // move the item to the end of the array
                var idx = self.ids.indexOf(id);
                self.ids.move(idx, self.ids.length - 1);

                // change class name to 'later'
                $(this)
                    .parents('.checkbox')
                    .siblings('.status')
                    .removeClass()
                    .addClass('status later');

                // reorder items in the ui
                self.reorder();

                // TODO save new state to server
            },
            onUnchecked: function() {
                var id = self.getIdFromInput(this);

                // move the item to the beginning of the array
                // TODO: move the item to the previous position?
                var idx = self.ids.indexOf(id);
                self.ids.move(idx, 0);

                // change class name to 'immediately'
                $(this)
                    .parents('.checkbox')
                    .siblings('.status')
                    .removeClass()
                    .addClass('status immediately');

                // reorder items in the ui
                self.reorder();

                // TODO save new state to server
            }
        });
    };

    /**
     * Get the DB ID for an item from the <input>
     */
    proto.getIdFromInput = function (input) {
        return $(input).parents('.item').attr('data-id');
    };

    return ReorderableList;

}(this, this.document, jQuery));
