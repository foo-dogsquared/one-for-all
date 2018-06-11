# one-for-all
A single web page for most of the popular search engines.

<<<<<<< HEAD
Well, not the one of the most elegant solution but it works and there are still some things I want to implement someday. So expect this to be improved... someday (still not close to elegance, though). 😂
=======
Well, there are still some things I want to implement someday. So there's that. 😶
>>>>>>> 2230c948064d704f7b718d99a13d4477a5cd16c6

## List of available search engines so far:
- cdnjs
- DevDocs
- DuckDuckGo
- GitHub
- GitLab
- Google
- MDN Web Docs
<<<<<<< HEAD
- npm Package Search
- Stack Overflow
- YouTube

## Documentation
### How does this work?
It is just a simple string substitution of the text you've inputted to whatever URL assigned into that engine.

I made the little app to be as much quickly configurable as possible and all I could do for now is through a simple automation through reading of an array that contains objects with properties related to the engines.

Inside of the `main.js`, you'll find the array of the search engines' data so if you want to add or remove some, you'll have to modify it there. For a reference what are the fields refer to, read the below paragraph.

Or if you're reading this from the future, you might notice that the array is gone and now it is stored on a `se-list.json` file. Yes, the `.json` need to be named `se-list` to avoid conflicts and whatnot (and it make things easier, I think).

### The needed data
=======

## A little note
>>>>>>> 2230c948064d704f7b718d99a13d4477a5cd16c6
You can fork this one and adjust the array of objects to whatever you desire. Just take note that the objects inside of the array contains the following:
- `id` - this will be used as a reference to that search engine; this must be in all lowercase for easier sorting, I guess
- `name` - **optional**; this is the one that will appear as the name of the search engine in the page; furthermore, when there is no `name` key, it will use the `id` instead as the name
- `url` - probably the most important as it requires a bit of precision; you must research about the url carefully as one lack of a character then it will probably not take you to the search result page; some examples:
    - https://google.com/search
    - https://duckduckgo.com/ (Yes the slash at the end is necessary)
    - https://youtube.com/results
<<<<<<< HEAD
    - https://gitlab.com/search
- `param` - **optional depending on the case**; this refers to the parameter that is used as part of the search query string; if there's no value of the said property, then "q" will be the default
    - https://google.com/search?q=SEARCH_TERM
    - https://duckduckgo.com/?q=SEARCH_TREM
    - https://youtube.com/results?q=foo-dogsquared
    - https://gitlab.com/search?search=SEARCH_MRET (it has `"search"` as the value)
=======
- `param` - **optional depending on the case**; this refers to the parameter that is used as the search query; if there's no value of the said property, then "q" will be the default
    - https://google.com/search?q=SEARCH_TERM
    - https://duckduckgo.com/?q=SEARCH_TREM
    - https://youtube.com/results?q=foo-dogsquared
>>>>>>> 2230c948064d704f7b718d99a13d4477a5cd16c6
