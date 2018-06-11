"use strict";
function main() {
    const LIST_CONTAINER = document.querySelector("#list-container");
    const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="16"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/></svg>`;

    // sample of a query list
    const SEARCH_QUERY_URLS = [
        {
            "id": "google",
            "name": "Google",
            "url": "https://google.com/search"
        },

        {
            "id": "duckduckgo",
            "name": "DuckDuckGo",
            "url": "https://duckduckgo.com/"
        },

        {
            "id": "mdn",
            "name": "MDN Web Docs",
            "url": "https://developer.mozilla.org/en-US/search"
        },

        {
            "id": "devdocs",
            "name": "DevDocs",
            "url": "https://devdocs.io/search"
        },

        {
            "id": "gitlab",
            "name": "GitLab",
            "url": "https://gitlab.com/search",
            "param": "search"
        },

        {
            "id": "cdnjs",
            "name": "cdnjs",
            "url": "https://cdnjs.com/"
        },

        {
            "id": "github",
            "name": "GitHub",
            "url": "https://github.com/search"
        },

        {
            "id": "stackoverflow",
            "name": "Stack Overflow",
            "url": "https://stackoverflow.com/search"
        },

        {
            "id": "npm",
            "name": "npm Package Search",
            "url": "https://npmjs.com/search"
        }
    ]

    SEARCH_QUERY_URLS.sort(sortID);

    function sortID(current, next) {
        if (current.id > next.id) return 1
        else if (current.id < next.id) return -1
        else return 0;
    }

    function createList(querylist) {
        const SE_LIST = document.createElement("ul");
        SE_LIST.setAttribute("id", "search-list");

        function openSearchPage(eventListener) {
            const TARGET_INPUT = document.querySelector(`input#${obj.id}`);

            if (!TARGET_INPUT.value) eventListener.preventDefault()
            else if (TARGET_INPUT.value.trim() !== TARGET_INPUT.value) eventListener.preventDefault()
            else {
                const FULLSEARCH_URL = `${obj.url}?${obj.param ? obj.param : "q"}=${TARGET_INPUT.value}`;

                window.open(FULLSEARCH_URL, "_blank");
                TARGET_INPUT.value = '';
            }
        }
        
        querylist.forEach(obj => {
            const SE_LIST_ITEM = document.createElement("li");
            SE_LIST_ITEM.setAttribute("class", "search-engine");

            const SE_ITEM_GRID = document.createElement("div");
            SE_ITEM_GRID.setAttribute("class", "search-engine-item-grid");

            const SE_NAME = document.createElement("div");
            SE_NAME.setAttribute("class", "search-engine-name");
            
            const SE_NAME_HEADER = document.createElement("label");
            SE_NAME_HEADER.setAttribute("for", obj.id)
            SE_NAME_HEADER.textContent = obj.name ? obj.name : obj.id;

            const SE_INPUT_ITEM = document.createElement("div");
            SE_INPUT_ITEM.setAttribute("class", "search-engine-input-item");

            const SE_INPUT = document.createElement("input");
            SE_INPUT.setAttribute("id", obj.id);
            SE_INPUT.setAttribute("class", "search-engine-input");
            SE_INPUT.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    const TARGET_INPUT = document.querySelector(`input#${obj.id}`);

                if (!TARGET_INPUT.value) eventListener.preventDefault()
                else if (TARGET_INPUT.value.trim() !== TARGET_INPUT.value) eventListener.preventDefault()
                else {
                    const FULLSEARCH_URL = `${obj.url}?${obj.param ? obj.param : "q"}=${TARGET_INPUT.value}`;

                    window.open(FULLSEARCH_URL, "_blank");
                    TARGET_INPUT.value = '';
                    }
                }
            })

            const SE_INPUT_BTN = document.createElement("button");
            SE_INPUT_BTN.setAttribute("type", "button");
            SE_INPUT_BTN.setAttribute("class", "search-engine-input-button");
            SE_INPUT_BTN.innerHTML = SVG;
            SE_INPUT_BTN.addEventListener("click", (event) => {
                const TARGET_INPUT = document.querySelector(`input#${obj.id}`);

                if (!TARGET_INPUT.value) event.preventDefault()
                else if (TARGET_INPUT.value.trim() !== TARGET_INPUT.value) event.preventDefault()
                else {
                    const FULLSEARCH_URL = `${obj.url}?${obj.param ? obj.param : "q"}=${TARGET_INPUT.value}`;

                    window.open(FULLSEARCH_URL, "_blank");
                    TARGET_INPUT.value = '';
                }
            });

            // placed here for easier view of hierarchy of things
            SE_INPUT_ITEM.appendChild(SE_INPUT);
            SE_INPUT_ITEM.appendChild(SE_INPUT_BTN);

            SE_NAME.appendChild(SE_NAME_HEADER);

            SE_ITEM_GRID.appendChild(SE_NAME);
            SE_ITEM_GRID.appendChild(SE_INPUT_ITEM);

            SE_LIST_ITEM.appendChild(SE_ITEM_GRID);

            SE_LIST.appendChild(SE_LIST_ITEM);
        });

        LIST_CONTAINER.appendChild(SE_LIST);
    }

    createList(SEARCH_QUERY_URLS);
}

main();