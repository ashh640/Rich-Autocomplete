(function($) {

    function RichAutocomplete(element, options) {
        this.element = element;
        this.options = options;

        //store the original set of items
        this.items = this.options.items.slice();

        //store all the items
        this.filteredItems = this.items.slice();

        //prepare element
        this.init();

        //bind the focus and blur events
        this.bindEvents();

        //render the list initially
        this.updateList();
    }

    RichAutocomplete.prototype.init = function() {
        //ensure that the type is a div
        if (this.element[0].nodeName !== 'INPUT')
            throw 'Rich Autocomplete - Expected <input> but instead got <' + this.element[0].nodeName.toLowerCase() + '>';

        //wrap element in div
        this.element.wrap('<div class="rich-autocomplete"></div>');

        //create list control and add to the container
        this.list = $('<ul class="rich-autocomplete-list"></ul>');

        this.list.css('max-height', this.options.maxHeight + 'px');
        this.list.hide();

        //get the container element
        this.container = this.element.parent();

        //add the list to the container
        this.container.append(this.list);
    };

    RichAutocomplete.prototype.bindEvents = function() {
        var context = this;

        this.element.focus(function(event) {
            context.showList.apply(context, [event]);
        });

        this.element.blur(function(event) {
            context.hideList.apply(context, [event]);
        });

        this.element.keyup(function(event) {
            context.filterResults.apply(context, [event]);
        });
    };

    RichAutocomplete.prototype.showList = function() {
        this.list.show();
    };

    RichAutocomplete.prototype.hideList = function(event) {
        this.list.hide();
    };

    RichAutocomplete.prototype.filterResults = function(event) {
        var searchTerm = this.element.val();

        //filter items based on search terms
        this.filteredItems = this.options.filter(this.items, searchTerm);

        //update the list
        this.updateList();
    };

    RichAutocomplete.prototype.updateList = function() {
        var context = this;

        //empty the list of previous items
        this.list.empty();

        //if the list is empty render the empty list item instead
        if (this.filteredItems.length === 0) {
            var emptyItem = $('<li class="rich-autocomplete-list-item-empty">' + this.options.emptyRender() + '</li>');
            this.list.append(emptyItem);
            return;
        }

        //select item function
        var selectItem = function(event) {
            var itemData = $(this).data('item-data');
            context.selectItem.apply(context, [itemData]);
        };

        //loop through each item and render
        for (var idx = 0; idx < this.filteredItems.length; idx++) {

            //create list item
            var listItem = $('<li class="rich-autocomplete-list-item">' + this.options.render(this.filteredItems[idx]) + '</li>');

            //store item data in element data
            listItem.data('item-data', this.filteredItems[idx]);

            //add click event listener
            listItem.mousedown(selectItem);

            //add list item to virtual list control
            this.list.append(listItem);
        }
    };

    RichAutocomplete.prototype.selectItem = function(item) {

        //extract the text from the selected data object
        var itemText = this.options.extractText(item);

        //set the text of the input control
        this.element.val(itemText);

        //inform the select option
        this.options.select(item);

        //update the list
        this.filterResults();
    };

    $.fn.richAutocomplete = function(options) {

        var defaultOptions = {
            maxHeight: 200,
            items: [],
            extractText: function(item) {
                return item;
            },
            filter: function(items, searchTerm) {
                return items.filter(function(item) {
                    return item.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
                });
            },
            render: function(item) {
                return '<p>' + item + '</p>';
            },
            emptyRender: function() {
                return '<p>No Matches Found...</p>';
            },
            select: function(item) {}
        };

        options = $.extend(defaultOptions, options);

        var a = new RichAutocomplete(this, options);
    };

}(jQuery));
