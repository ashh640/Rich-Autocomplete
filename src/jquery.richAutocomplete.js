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
            if(event.keyCode !== 38 && event.keyCode !== 40)
                context.filterResults.apply(context, [event]);
        });

        this.element.keydown(function(event) {

            //up arrow pressed
            if(event.keyCode === 38) context.highlightUp.apply(context, [event]);

            //down arrow pressed
            if(event.keyCode === 40) context.highlightDown.apply(context, [event]);
        });
    };

    RichAutocomplete.prototype.showList = function() {
        this.list.show();
    };

    RichAutocomplete.prototype.hideList = function(event) {
        this.list.hide();

        //remove any highlighting
        this.list.find('.highlighted').removeClass('highlighted');

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
            var emptyItem = $('<li class="rich-autocomplete-list-item-empty"></li>');

            //insert rendered item
            emptyItem.append($(this.options.emptyRender()));

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
            var listItem = $('<li class="rich-autocomplete-list-item" index="' + idx + '"></li>');

            //insert the rendered template
            listItem.append($(this.options.render(this.filteredItems[idx])));

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

    RichAutocomplete.prototype.highlightUp = function () {
        //find if any items are currently highlighted
        var highlighted = this.list.find('.highlighted');

        if(highlighted.length === 0) {
            // no item is currently highlighted so hide the list
            this.hideList();
        }
        else if(this.listVisible() && this.filteredItems.length > 0) {

            var listItems = this.list.find('.rich-autocomplete-list-item');

            //get highlighted element index
            var currentIndex = +highlighted.first().attr('index');
            var minIndex = +listItems.first().attr('index');

            if(currentIndex > minIndex) {
                var previousSibling = highlighted.first().prev('.rich-autocomplete-list-item');

                //ensure we have a sibling to move to
                if(previousSibling.length === 0) return;

                //dehighlight previously highlighted
                highlighted.removeClass('highlighted');

                //highlight the next item in the list
                previousSibling.addClass('highlighted');
            }
            else if(currentIndex === minIndex) {
                this.hideList();
            }
        }
    };


    RichAutocomplete.prototype.highlightDown = function () {
        //find if any items are currently highlighted
        var highlighted = this.list.find('.highlighted');

        if(highlighted.length === 0) {

            //if list is hidden show it
            if(!this.listVisible()) this.showList();

            // no item is currently highlighted so highlight first element
            this.list.find('.rich-autocomplete-list-item').first().addClass('highlighted');
        }
        else if(this.listVisible()) {

            var listItems = this.list.find('.rich-autocomplete-list-item');

            //get highlighted element index
            var currentIndex = +highlighted.first().attr('index');
            var maxIndex = +listItems.last().attr('index');

            //check to make sure we arent at the bottom
            if(currentIndex < maxIndex) {
                var nextSibling = highlighted.first().next('.rich-autocomplete-list-item');

                //ensure we have a sibling to move to
                if(nextSibling.length === 0) return;

                //dehighlight previously highlighted
                highlighted.removeClass('highlighted');

                //highlight the next item in the list
                nextSibling.addClass('highlighted');

                //we may need to scroll the newly highlighted option into view
                // var listHeight = this.list.height();
                // var listOffset = this.list.offset();
                // var scrollPosition = this.list.scrollTop();
                // var nextSiblingOffset = nextSibling[0].getBoundingClientRect();
                //
                // if(nextSiblingOffset.top > ((listHeight + listOffset.top) - scrollPosition)) {
                //     this.list.scrollTop(nextSiblingOffset.bottom - (listHeight));
                // }
            }
        }
    };

    RichAutocomplete.prototype.listVisible = function () {
        return this.list[0].style.display !== 'none';
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
