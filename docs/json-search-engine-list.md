# How does this work?
It is just a simple string substitution of the text you've inputted to whatever URL assigned into that engine.

I made the little app to be as much quickly configurable as possible and all I could do for now is through a simple automation through reading of an array that contains objects with properties related to the engines.

Anyway, the program requires for a URL with that points to a JSON file named `se-list.json` and looks for the required data which is an array of objects with the specified fields (in which you can look for below). You can use the default JSON by having no input but if you want to have your own list, refer to the next section of this documentation.

## The needed data
You can fork this one and adjust the array of objects to whatever you desire. Just take note that the objects inside of the array contains the following:
- `id` - this will be used as a reference to that search engine; this must be in all lowercase for easier sorting, I guess
- `url` - probably the most important as it requires a bit of precision; you must research about the url carefully as one lack of a character then it will probably not take you to the search result page; some examples:
    - https://google.com/search
    - https://duckduckgo.com/ (Yes the slash at the end is necessary)
    - https://youtube.com/results
    - https://gitlab.com/search
    - https://caniuse.com/
- `name` - **[optional]**; this is the one that will appear as the name of the search engine in the page; furthermore, when there is no `name` key, it will use the `id` instead as the name
- `param` - **[optional depending on the case]**; this refers to the parameter that is used as part of the search query string; if there's no value of the said property, then `q` will be the default
    - https://google.com/search?q=SEARCH_TERM
    - https://duckduckgo.com/?q=SEARCH_TREM
    - https://youtube.com/results?q=foo-dogsquared
    - https://gitlab.com/search?search=SEARCH_MRET (it has `"search"` as the value)
    - https://caniuse.com/#search=SEARCH_TMER (also has `"search"` as the value)
- `hash` - **[optional depending on the case]**; the hash identifier in the query string; if there's no value for the said property, then `?` will be the default value
    - https://google.com/search?q=SEARCH_TERM
    - https://duckduckgo.com/?q=SEARCH_TREM
    - https://youtube.com/results?q=foo-dogsquared
    - https://gitlab.com/search?search=SEARCH_MRET 
    - https://caniuse.com/#search=SEARCH_TMER (has `"#"` as the value)
