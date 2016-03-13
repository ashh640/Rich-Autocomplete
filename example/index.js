(function() {

    /*
        Simple List of Countries
    */

    var country_list = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

    $('#input-field').richAutocomplete({
        items: country_list
    });


    /*
        Simple List of people - custom rendering
    */

    var people_list = [];

    //generate some people
    for (var i = 0; i < 100; i++) {
        people_list.push({
            name: chance.name(),
            age: chance.age()
        });
    }

    $('#name-field').richAutocomplete({
        items: people_list,
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

    /*
        Dynamic list of countries
    */

    var loadPage = function(searchTerm, pageNumber, pageSize) {
        if (searchTerm === '')
            return country_list.slice((pageNumber * pageSize), (pageNumber * pageSize) + pageSize);

        var searchedCountries = country_list.filter(function(item) {
            return item.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });

        return searchedCountries.slice((pageNumber * pageSize), (pageNumber * pageSize) + pageSize);
    };

    $('#country-field').richAutocomplete({
        loadPage: loadPage,
        paging: true,
        pageSize: 20
    });

    /*
        Dynamic list of countries - server loading (simulated)
    */

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

    $('#country-server-field').richAutocomplete({
        loadPage: loadServerPage,
        paging: true,
        pageSize: 20
    });

    /*
        Emoji dynamic list
    */

    var emoji_list = [{
        name: 'Angel',
        image: 'angel.svg'
    }, {
        name: 'Angry',
        image: 'angry.svg'
    }, {
        name: 'Anxious',
        image: 'anxious.svg'
    }, {
        name: 'Appauled',
        image: 'appauled.svg'
    }, {
        name: 'Astounded',
        image: 'astounded.svg'
    }, {
        name: 'Chuckle',
        image: 'chuckle.svg'
    }, {
        name: 'Dead',
        image: 'dead.svg'
    }, {
        name: 'Devil',
        image: 'devil.svg'
    }, {
        name: 'Doctor',
        image: 'doctor.svg'
    }, {
        name: 'Duh',
        image: 'duh.svg'
    }, {
        name: 'Embarrassed',
        image: 'embarrassed.svg'
    }, {
        name: 'Emotionless',
        image: 'emotionless.svg'
    }, {
        name: 'Fuming',
        image: 'fuming.svg'
    }, {
        name: 'Giggle',
        image: 'giggle.svg'
    }, {
        name: 'Grin',
        image: 'grin.svg'
    }, {
        name: 'Happy',
        image: 'happy.svg'
    }, {
        name: 'Huffing',
        image: 'huffing.svg'
    }, {
        name: 'Kiss Heart',
        image: 'kiss-heart.svg'
    }, {
        name: 'Kiss',
        image: 'kiss.svg'
    }, {
        name: 'Laughing',
        image: 'laughing.svg'
    }, {
        name: 'Meh',
        image: 'meh.svg'
    }, {
        name: 'Miffed',
        image: 'miffed.svg'
    }, {
        name: 'Moody',
        image: 'moody.svg'
    }, {
        name: 'Nervous Laugh',
        image: 'nervous-laugh.svg'
    }, {
        name: 'Ooh',
        image: 'ooh.svg'
    }, {
        name: 'Panic',
        image: 'panic.svg'
    }, {
        name: 'Pleased',
        image: 'pleased.svg'
    }, {
        name: 'Really Happy',
        image: 'really-happy.svg'
    }, {
        name: 'Regret',
        image: 'regret.svg'
    }, {
        name: 'Sad',
        image: 'sad.svg'
    }, {
        name: 'Sleeping',
        image: 'sleeping.svg'
    }, {
        name: 'Smile',
        image: 'smile.svg'
    }, {
        name: 'So So',
        image: 'so-so.svg'
    }, {
        name: 'Surprised',
        image: 'surprised.svg'
    }, {
        name: 'Sweating',
        image: 'sweating.svg'
    }, {
        name: 'Upside Down Face',
        image: 'upside-down.svg'
    }, {
        name: 'Welling Up',
        image: 'welling-up.svg'
    }, {
        name: 'Whistle',
        image: 'whistle.svg'
    }, {
        name: 'Wink',
        image: 'wink.svg'
    }, {
        name: 'Worried',
        image: 'worried.svg'
    }];

    var loadEmojiPage = function(searchTerm, pageNumber, pageSize) {
        if (searchTerm === '')
            return emoji_list.slice((pageNumber * pageSize), (pageNumber * pageSize) + pageSize);

        var searchedEmojis = emoji_list.filter(function(item) {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });

        return searchedEmojis.slice((pageNumber * pageSize), (pageNumber * pageSize) + pageSize);
    };

    $('#emoji-field').richAutocomplete({
        loadPage: loadEmojiPage,
        extractText: function(item) {
            return item.name;
        },
        render: function(item) {
            return '<img class="icon" src="emojis/' + item.image + '" /><p class="icon-name">' + item.name + '</p>';
        },
        select: function(item) {
            $('#selected-item').text(item.name);
        },
        paging: true,
        pageSize: 10
    });

})();
