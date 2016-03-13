# Rich-Autocomplete

A simple yet powerful autocomplete jQuery plugin. Very simply allows large lists of data, with custom rendering, paging, filtering and lazy loading with very little coding required.

Complete with keyboard navigation for accessibility.

See several demos of Rich-Autocomplete in action here: http://beginninghere.co.uk/richautocomplete/example/

## Installation

There are several ways in which you can get Rich-Autocomplete and add it to your project.

1. Install using bower.
`bower install rich-autocomplete`

2. Install using npm.
`npm install rich-autocomplete`

3. Download script from here (download the files in the dist folder)

After that simply link the stylesheet (richAutocomplete.min.css) and the javascript file (jquery.richAutocomplete.min.js) to your html page eg:

```
<!DOCTYPE html>
<html>

<head>
    <title>Rich Autocomplete - Example</title>
    <link rel="stylesheet" type="text/css" href="dist/richAutocomplete.css" />
</head>

<body>

    <script src="http://code.jquery.com/jquery-2.2.1.min.js" integrity="sha256-gvQgAFzTH6trSrAWoH1iPo9Xc96QxSZ3feW6kem+O00=" crossorigin="anonymous"></script>
    <script src="dist/jquery.richAutocomplete.js" type="text/javascript"></script>

</body>

</html>
```

Note you will need jQuery loaded on your page also.

## Usage

Basic usage is very simple. Add an `<input id="my-field"/>` to your page (ideally with an id). Then in your javascript simply add the following:

```
$('#my-field').richAutocomplete({
    items: ["Item One", "Item Two", "Item Three"];
});
```

This will create the control and add the list with basic search capabilities.

# Custom Rendering

You may also want to create a list of objects rather than strings. You can also customize how the list items are displayed. To do this use the following in your javascript:

```
$('#my-field').richAutocomplete({
    items: [{
        name: "John Smith",
        age: 12
    }, {
        name: "Jane Doe",
        age: 22
    }, {
        name: "Jim Halpert",
        age: 35
    }],
    extractText: function(item) {
        return item.name;
    },
    filter: function(items, searchTerm) {
        return items.filter(function(item) {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });
    },
    render: function(item) {
        return '<p>' + item.name + '</p><small>' + item.age + '</small>';
    }
});
```

For more in depth information on each of the options see down below.

# Paging

Paging can be used to load a limited number of items at any time. Only when more items are required will they be added to the list. Use the following javascript:

```
var country_list = ["Afghanistan", "Albania", "Algeria", ....];

var loadPage = function(searchTerm, pageNumber, pageSize) {
    if (searchTerm === '')
        return country_list.slice((pageNumber * pageSize), (pageNumber * pageSize) + pageSize);

    var searchedCountries = country_list.filter(function(item) {
        return item.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    });

    return searchedCountries.slice((pageNumber * pageSize), (pageNumber * pageSize) + pageSize);
};

$('#my-field').richAutocomplete({
    loadPage: loadPage,
    paging: true,
    pageSize: 20
});
```

# Paging - Loading data from server

The following example simulates data being loaded from a server in pages, however it is very simple to replace the timeout with an ajax request. Add the following to your javascript:

```
var country_list = ["Afghanistan", "Albania", "Algeria", ....];

var loadServerPage = function(searchTerm, pageNumber, pageSize) {
    var deferred = $.Deferred();

    setTimeout(function() {
        if (searchTerm === '')
            deferred.resolve(country_list.slice((pageNumber * pageSize), (pageNumber * pageSize) + pageSize));

        var searchedCountries = country_list.filter(function(item) {
            return item.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });

        deferred.resolve(searchedCountries.slice((pageNumber * pageSize), (pageNumber * pageSize) + pageSize));
    }, 1000);

    return deferred.promise();
};

$('#my-field').richAutocomplete({
    loadPage: loadServerPage,
    paging: true,
    pageSize: 20
});
```

To see the examples in action and with more detail on how they work see the demo page linked at the top.

## Options

The following options can be set to configure how the control will work. The following are show the default values:

```
$('#my-field').richAutocomplete({
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
    loadPage: function(searchTerm, pageNumber, pageSize) {
        return [];
    }
});
```

Details on each option are:

-`maxHeight`: This sets the maximum height of the list that appear when the input has focus.
-`items`: This should be set to an array or string or objects - this should only be used when the list does not use paging. If paging is enabled the `loadPage` function will be used instead.
-`paging`: If true this will enable paging and will allow loading of items in limited amounts.
-`pageSize`: If paging is enabled this should be set to the size of the number of items that will be returned in each page.
-`showSpinner`: If true a spinner will show when loading the next page.
-`debounce`: This should represent the number of milliseconds delay after the user finishes typing a search query before loading begins. This is only applicable when paging is enabled.
-`extractText`: This is a function that should accept one parameter which will be an item in the list. This function should return a string that represents this item. This should be used when an array of object is specified rather than an array of strings.
-`filter`: This is used when paging is disabled and the data is a list of objects rather than strings. This function should accept two parameters, the first will be a list of all the items and the second is the current search term. It should return any items in the array that matches the search term.
-`render`: This is a function that should accept one argument. It should return an string of HTML that will be used in the list item, or a HTML Element or jQuery element. This is only required if you want each list item to display more than a simple string.
-`emptyRender`: This function can be used to return an list item to display when no items match a search term. It should return a string of HTML, an HTML element or jQuery element.
-`select`: This function will be called if specified when an item in the list has been selected.
-`loadPage`: This function is required when paging is enabled. It should accept three arguments, the first is the search term, the second is the page number and the third is the page size. This function should return an array of elements that meet the search term and on the correct page. It can also return a jQuery promise that should resolve with an array matching the search term and correct page. See demo page for examples of how to use this.

## Contributing

Have an idea to improve Rich-Autocomplete? Either let us know or add it yourself and submit a pull request!

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request!

## History

v0.1.0 - Initial implementation and documentation

Planned Features:

- Multiple selection

## License

MIT License - use this as you wish, in both free or commercial projects. Attribution or a link to this github page is always welcome, but certainly not mandatory.
