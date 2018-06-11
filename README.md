# one-for-all
A single web page for most of the popular search engines.

Well, there are still some things I want to implement someday. So there's that. 😶

## List of available search engines so far:
- cdnjs
- DevDocs
- DuckDuckGo
- GitHub
- GitLab
- Google
- MDN Web Docs

## A little note
You can fork this one and adjust the array of objects to whatever you desire. Just take note that the objects inside of the array contains the following:
- `id` - this will be used as a reference to that search engine; this must be in all lowercase for easier sorting, I guess
- `name` - **optional**; this is the one that will appear as the name of the search engine in the page; furthermore, when there is no `name` key, it will use the `id` instead as the name
- `url` - probably the most important as it requires a bit of precision; you must research about the url carefully as one lack of a character then it will probably not take you to the search result page; some examples:
    - https://google.com/search
    - https://duckduckgo.com/ (Yes the slash at the end is necessary)
    - https://youtube.com/results
- `param` - **optional depending on the case**; this refers to the parameter that is used as the search query; if there's no value of the said property, then "q" will be the default
    - https://google.com/search?q=SEARCH_TERM
    - https://duckduckgo.com/?q=SEARCH_TREM
    - https://youtube.com/results?q=foo-dogsquared
