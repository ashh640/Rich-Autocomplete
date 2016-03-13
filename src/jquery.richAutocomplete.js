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
        if (this.options.paging === false) {
            this.updateList();
        } else {
            //set current page initially to zero
            this.currentPage = 0;
            this.loading = false;
            this.allItemsLoaded = false;
            this.debounce = null;

            //load the first page
            this.loadPage(0);
        }
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

        //create css spinner
        var spinnerHtml = '<div class="spinner-container">';
        spinnerHtml += '<div class="spinner">';
        spinnerHtml += '<div class="spinner-node node1"></div>';
        spinnerHtml += '<div class="spinner-node node2"></div>';
        spinnerHtml += '<div class="spinner-node node3"></div>';
        spinnerHtml += '<div class="spinner-node node4"></div>';
        spinnerHtml += '<div class="spinner-node node5"></div>';
        spinnerHtml += '<div class="spinner-node node6"></div>';
        spinnerHtml += '<div class="spinner-node node7"></div>';
        spinnerHtml += '<div class="spinner-node node8"></div>';
        spinnerHtml += '</div>';
        spinnerHtml += '</div>';

        //create spinner element
        this.spinner = $(spinnerHtml);

        //initially hide the element
        this.spinner.hide();

        //add to container
        this.container.append(this.spinner);
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
            if (event.keyCode !== 38 && event.keyCode !== 40)
                context.filterResults.apply(context, [event]);
        });

        this.element.keydown(function(event) {

            //up arrow pressed
            if (event.keyCode === 38) context.highlightUp.apply(context, [event]);

            //down arrow pressed
            if (event.keyCode === 40) context.highlightDown.apply(context, [event]);

            //enter key pressed
            if (event.keyCode === 13) context.selectHighlighted.apply(context, [event]);
        });

        this.list.scroll(function(event) {
            //only applicable if paging is enabled and we arent currently loading or have loaded all pages
            if(context.options.paging === false || context.loading === true || context.allItemsLoaded === true) return;

            //collect some positioning and size values
            var scrollTop = context.list.scrollTop();
            var listHeight = context.list.height();
            var scrollPosition = scrollTop + listHeight;
            var maxScrollHeight = context.list[0].scrollHeight - 20;

            if(scrollPosition > maxScrollHeight) {
                context.loadNextPage.apply(context);
            }
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
        var context = this;

        var searchTerm = this.element.val();

        //filter items based on search terms
        if (this.options.paging === false) {
            this.filteredItems = this.options.filter(this.items, searchTerm);

            //update the list
            this.updateList();
        } else {

            if(this.debounce) {
                clearTimeout(this.debounce);
            }

            this.debounce = setTimeout(function() {
                //reset to the first page
                context.currentPage = 0;
                context.allItemsLoaded = false;

                //cancel any current loading
                context.loading = false;
                context.spinner.hide();

                //load results dynamically
                context.loadPage(0);
            }, searchTerm === '' ? 0 : this.options.debounce);
        }
    };

    RichAutocomplete.prototype.loadPage = function(pageNumber) {
        var context = this;

        //if we are currently loading or have loaded all pages then stop here
        if(this.loading === true || (pageNumber !== 0 && this.allItemsLoaded === true)) return;

        //remember we are in fact loading so dont load another page in the mean time
        this.loading = true;

        //show the loading spinner
        if(this.options.showSpinner) this.spinner.show();

        //empty list if first page
        if (pageNumber === 0) {
            this.filteredItems = [];
            this.allItemsLoaded = false;
        }

        var searchTerm = this.element.val();

        //load page
        var nextPage = this.options.loadPage(searchTerm, pageNumber, this.options.pageSize);

        //check if a jquery promise
        if (nextPage.promise) {

            nextPage.done(function(result) {
                //store the new
                context.filteredItems = context.filteredItems.concat(result);

                //load the new page
                context.updateDynamicList.apply(context);

                //hide the spinner as we have finished loading
                context.spinner.hide();

                //inform that we have finished loading
                context.loading = false;

                //if we are on the last page then remember this to prevent unnessesary further loading
                if(result.length === 0 || result.length < context.pageSize) {
                    context.allItemsLoaded = true;
                }
            });

        } else {
            //store the new
            this.filteredItems = this.filteredItems.concat(nextPage);

            //load the new page
            this.updateDynamicList();

            //hide the spinner as we have finished loading
            this.spinner.hide();
            this.loading = false;

            //if we are on the last page then remember this to prevent unnessesary further loading
            if(nextPage.length === 0 || nextPage.length < this.pageSize) {
                this.allItemsLoaded = true;
            }
        }
    };

    RichAutocomplete.prototype.loadNextPage = function() {
        //dont do anything if we are currently loading or we have loaded all pages
        if(this.loading === true || this.allItemsLoaded === true) return;

        //load the next page and remember which page we are now on
        this.loadPage(++this.currentPage);
    };

    RichAutocomplete.prototype.updateDynamicList = function() {
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

        //hover item function
        var hoverItem = function(event) {
            context.hoverItem.apply(context, [$(this)]);
        };

        //unhover item function
        var unhoverItem = function(event) {
            context.unhoverItem.apply(context, [$(this)]);
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

            //add hover event
            listItem.mouseover(hoverItem);

            //add mouseout event
            listItem.mouseout(unhoverItem);

            //add list item to virtual list control
            this.list.append(listItem);
        }
    };

    RichAutocomplete.prototype.hoverItem = function(item) {

        //remove highlight from any highlighted element
        this.list.find('.highlighted').removeClass('highlighted');

        //highlight the hovered item
        item.addClass('highlighted');
    };

    RichAutocomplete.prototype.unhoverItem = function(item) {
        //remove hover effect from element
        item.removeClass('highlighted');
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

    RichAutocomplete.prototype.selectHighlighted = function() {

        //extract data from selected item
        var highlighted = this.list.find('.highlighted');

        if (highlighted.length === 0) return;

        var itemData = highlighted.first().data('item-data');

        //select the highlighted item
        this.selectItem(itemData);

        //hide list after selection
        this.hideList();
    };

    RichAutocomplete.prototype.highlightUp = function() {
        //find if any items are currently highlighted
        var highlighted = this.list.find('.highlighted');

        if (highlighted.length === 0) {
            // no item is currently highlighted so hide the list
            this.hideList();
        } else if (this.listVisible() && this.filteredItems.length > 0) {

            var listItems = this.list.find('.rich-autocomplete-list-item');

            //get highlighted element index
            var currentIndex = +highlighted.first().attr('index');
            var minIndex = +listItems.first().attr('index');

            if (currentIndex > minIndex) {
                var previousSibling = highlighted.first().prev('.rich-autocomplete-list-item');

                //ensure we have a sibling to move to
                if (previousSibling.length === 0) return;

                //dehighlight previously highlighted
                highlighted.removeClass('highlighted');

                //highlight the next item in the list
                previousSibling.addClass('highlighted');

                var listHeight = this.list.height();
                var scrollTop = this.list.scrollTop();
                var scrollBottom = scrollTop + listHeight;

                //get the position of the highlighted option
                var highlightTop = previousSibling.position().top + scrollTop;
                var highlightBottom = highlightTop + previousSibling.outerHeight();

                if (highlightBottom >= scrollBottom) {
                    this.list.scrollTop((highlightBottom - listHeight) > 0 ? highlightBottom - listHeight : 0);
                } else if (highlightTop < scrollTop) {
                    this.list.scrollTop(highlightTop);
                }

            } else if (currentIndex === minIndex) {
                this.hideList();
            }
        }
    };


    RichAutocomplete.prototype.highlightDown = function() {

        var listHeight, scrollTop, scrollBottom, highlightTop, highlightBottom;

        //find if any items are currently highlighted
        var highlighted = this.list.find('.highlighted');

        if (highlighted.length === 0) {

            //if list is hidden show it
            if (!this.listVisible()) this.showList();

            // no item is currently highlighted so highlight first element
            var topItem = this.list.find('.rich-autocomplete-list-item').first().addClass('highlighted');

            //scroll to top of the list
            this.list.scrollTop(0);

        } else if (this.listVisible()) {

            var listItems = this.list.find('.rich-autocomplete-list-item');

            //get highlighted element index
            var currentIndex = +highlighted.first().attr('index');
            var maxIndex = +listItems.last().attr('index');

            //check to make sure we arent at the bottom
            if (currentIndex < maxIndex) {
                var nextSibling = highlighted.first().next('.rich-autocomplete-list-item');

                //ensure we have a sibling to move to
                if (nextSibling.length === 0) return;

                //dehighlight previously highlighted
                highlighted.removeClass('highlighted');

                //highlight the next item in the list
                nextSibling.addClass('highlighted');

                //we may need to scroll the newly highlighted option into view

                listHeight = this.list.height();
                scrollTop = this.list.scrollTop();
                scrollBottom = scrollTop + listHeight;

                //get the position of the highlighted option
                highlightTop = nextSibling.position().top + scrollTop;
                highlightBottom = highlightTop + nextSibling.outerHeight();


                if (highlightBottom >= scrollBottom) {
                    this.list.scrollTop((highlightBottom - listHeight) > 0 ? highlightBottom - listHeight : 0);
                } else if (highlightTop < scrollTop) {
                    this.list.scrollTop(highlightTop);
                }
            }
        }
    };

    RichAutocomplete.prototype.listVisible = function() {
        return this.list[0].style.display !== 'none';
    };

    $.fn.richAutocomplete = function(options) {

        var defaultOptions = {
            maxHeight: 200,
            items: [],
            paging: false,
            pageSize: 0,
            showSpinner: true,
            debounce: 500,
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
            select: function(item) {},
            loadPage: function(searchTerm, pageNumber) {
                return [];
            }
        };

        options = $.extend(defaultOptions, options);

        $(this).data('rich-autocomplete', new RichAutocomplete(this, options));
    };

}(jQuery));
