(function () {
    // from: http://stackoverflow.com/a/7180095/11577
    // TODO: find a way to do this without altering Array.prototype
    Array.prototype.move = function(from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
    };

    function ReorderableList(selector, data) {
        this.selector = selector;
        this.data = data;
        // create an array to hold the item ids (populated by render)
        this.ids = [];
        // the height as a number of one list item (in px)
        this.itemHeight = null;
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
        $('.active .list').html(html);

        function postInsertion() {
            // grab all of the list items from the dom, cast as an array
            this.items = Array.prototype.slice.call(document.querySelectorAll(this.selector));
            // get height of any 1 item
            this.itemHeight = parseInt(window.getComputedStyle(this.items[0], null).getPropertyValue('height'), 10);
            // reorder the items
            this.reorder();
            // activate the checkboxes
            this.initCheckboxes();
        }

        // get the items after they’ve been inserted into the dom
        window.requestAnimationFrame(postInsertion.bind(this))
    };

    proto.initCheckboxes = function () {
        var self = this;
        $('.active .checkbox').checkbox({
            onChecked: function() {
                var id = self.getIdFromInput(this);
                // move the item to the end of the array
                var idx = self.ids.indexOf(id);
                self.ids.move(idx, self.ids.length - 1);
                // reorder items in the ui
                self.reorder();
                // save new state to server
            },
            onUnchecked: function() {
                var id = self.getIdFromInput(this);
                // move the item to the beginning of the array
                // TODO: move the item to the previous position?
                var idx = self.ids.indexOf(id);
                self.ids.move(idx, 0);
                // reorder items in the ui
                self.reorder();
                // save new state to server
            }
        });
    };

    /**
     * Reorder a previously rendered list
     */
    proto.reorder = function () {
        // set height of container
        this.items[0].parentNode.style.height = `${(this.itemHeight * this.items.length)}px`;
        function setTransform(id, idx) {
            var item = document.querySelector(`[data-id="${id}"]`);
            var rule = `translate3d(0, ${(idx * this.itemHeight)}px, 0)`;
            if (idx > 0) {
                item.style.borderTop = '1px solid rgba(34, 36, 38, 0.15)';
            }
            else {
                item.style.borderTop = 'none';
            }
            item.style.transform = rule;
        }
        this.ids.forEach(setTransform.bind(this));
    };

    proto.getIdFromInput = function (input) {
        return $(input).parents('.item').attr('data-id');
    };

    function initReorderableList() {
        var selector = '.active .list .item';
        var data = [
            {
                id: '12345',
                name: 'Trader Joe’s Crunchy Peanut Butter',
                status: 'immediately',
                last_purchased: '4 weeks',
                src: 'http://nourishedbynutrition.com/wp-content/uploads/2014/09/Trader-Joes-Crunchy-Peanut-Butter-1-of-12.jpg'
            },
            {
                id: '23456',
                name: 'Clorox Bleach',
                status: 'soon',
                last_purchased: '12 days',
                src: 'http://gaia.adage.com/images/bin/image/x-large/Clorox_bleach.jpg'

            },
            {
                id: '34567',
                name: 'Lipton’s Tea',
                status: 'later',
                last_purchased: '5 days',
                src: 'http://www.caffeineinformer.com/wp-content/caffeine/lipton-tea.jpg'

            },
            {
                id: '45678',
                name: 'Cap’n Crunch Cereal',
                status: 'inactive',
                last_purchased: '10 minutes',
                src: 'https://a.dilcdn.com/bl/wp-content/uploads/sites/8/2011/03/capncrunch.jpg'

            }
        ];
        var list = new ReorderableList(selector, data);
        list.render();
    }

    function initUI() {
        $('.menu .item').tab();

        document.querySelector('.active .list').addEventListener('click', function (evt) {
            if (evt.target.matches('.header') || evt.target.matches('.description')) {
                // get image source
                var src = $(evt.target).parents('.item').attr('data-src');
                // set image source
                if (src) {
                    $('#product-info .image').attr('src', src);
                }
                // show modal
                $('#product-info').modal('show');
            }
        });
    }

    function init() {
        initReorderableList();
        initUI();
    }

    document.addEventListener('DOMContentLoaded', init);
}());
