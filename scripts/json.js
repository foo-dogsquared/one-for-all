function getListFromJSON(URL) {
    fetch(URL)
        .then(response => {
            console.log(`${response.url} is ${response.status} (${response.statusText})`)
            if (response.status === 200) toggleStatusText(`Status ${response.status}: ${response.statusText} from <a href="${response.url}" style="color:black;text-decoration:underline;">${response.url}</a><br>`, DB_URL_STATUS);
            else toggleStatusText(`Status ${response.status}: ${response.statusText}<br>`, DB_URL_STATUS);

            return response.json();
        })
        .then(json => {
            const SE_DATA_LIST = json;
            SE_DATA_LIST.sort(sortID);
            console.log(SE_DATA_LIST);
            renderList(SE_DATA_LIST, SE_LIST, LIST_CONTAINER);
        })
        .catch(error => {return null;})
} 

function retrieveJSON(urlInputElement) {
    const commandParameterFormat = /--\$[\w-]+(?:="[\s\w\d-]+")?/g;
    const commandParameters = new Set(urlInputElement.value.match(commandParameterFormat));
    if (urlInputElement.value.trim().match(/^[A-Za-z0-9_-]+$/) && localStorage.getItem(`fds_one_for_all_keyword=${urlInputElement.value.trim()}`)) {
        const keyword = `${ONE_FOR_ALL_KEYWORD_TEMPLATE}${urlInputElement.value.trim()}`;
        const keyword_url = localStorage.getItem(keyword);
        getListFromJSON(decodeURIComponent(keyword_url));
        console.log("It is working.");
    }
    else if (commandParameters && commandParameters.size > 0) {
        let statusTextMessage = "";
        const invalidCommands = [];
        for (const command of commandParameters) {
            if (command === "--$set-keyword" || command === "--$set-keywords") statusTextMessage += setKeyword(command);
            else if (command === "--$remove-keyword" || command === "--$remove-keywords" || command === "--$rm-keywords" || command === "--$rm-keyword") statusTextMessage += removeKeyword(command);
            else if (command === "--$default") statusTextMessage += setDefault(command);
            else if (command === "--$show-list-at-start" || command === "--$slas") statusTextMessage += toggleShowList(command); 
            else invalidCommands.push(command);
        }

        if (invalidCommands.length > 0)
            for (const command of invalidCommands) statusTextMessage += formatCommandTextMessage(command, `at index ${urlInputElement.value.indexOf(command)} is an invalid command.`, "error");
        toggleStatusText(statusTextMessage, DB_URL_STATUS);
    }
    else {
        const urlRegex = /^(https?|file|ftp)\:\/\/[\w|\W|\d]+[.][\w]+$/gi;
        const urlString = urlInputElement.value.match(urlRegex) ? new URL(urlInputElement.value) : new URL(document.URL);
        if (urlString.href === document.URL && !urlInputElement.value.match(/\S/)) {
            const default_db = localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB);
            if (default_db) getListFromJSON(decodeURIComponent(default_db));
            else getListFromJSON("./se-list.json");
        }
        else if (urlString.href.split("/").pop().indexOf("se-list.json") === 0) {
            getListFromJSON(urlInputElement.value);
            urlInputElement.value = '';
        } else toggleStatusText(`URL should be in the following format:<br><pre>[http | https | file | ftp]://[URL | file path]/se-list.json</pre>`, DB_URL_STATUS);
    }
}

function renderList(querylist, seListContainer, containerBox) {
    if (!seListContainer) throw new Error("There's no container element that is being specified for the list.");
    while (seListContainer.firstElementChild) {seListContainer.removeChild(listNode.firstElementChild)}
    
    for (const listItem of querylist) {
        function openSearchPage(event) {
            const TARGET_INPUT = document.querySelector(`input#${listItem.id}`);

            if (TARGET_INPUT.value.match(/\S/gi)) {
                const FULLSEARCH_URL = encodeURI(`${listItem.url}${listItem.hash ? listItem.hash : "?"}${listItem.param ? listItem.param : "q"}=${TARGET_INPUT.value}`);
                console.log(FULLSEARCH_URL);
                window.open(FULLSEARCH_URL, "_blank");
                TARGET_INPUT.value = '';
            } else event.preventDefault();
        }

        if (listItem.hasOwnProperty("id") && listItem.hasOwnProperty("url")) {
            const SE_LIST_ITEM = document.createElement("li");
            SE_LIST_ITEM.setAttribute("class", "search-engine");
            
            const SE_NAME_HEADER = document.createElement("label");
            SE_NAME_HEADER.setAttribute("for", listItem.id);
            SE_NAME_HEADER.setAttribute("class", "search-engine-name");
            SE_NAME_HEADER.textContent = listItem.name ? listItem.name : listItem.id;

            const SE_INPUT_ITEM = document.createElement("div");
            SE_INPUT_ITEM.setAttribute("class", "search-engine-input-item");

            const SE_INPUT = document.createElement("input");
            SE_INPUT.setAttribute("class", "search-engine-input");
            SE_INPUT.setAttribute("id", listItem.id);
            SE_INPUT.setAttribute("tabindex", 3);
            SE_INPUT.addEventListener("keypress", (event) => {
                if (event.key === "Enter") openSearchPage(event)
            })
            SE_INPUT.addEventListener("focus", () => DB_URL_STATUS.textContent = '');

            const SE_INPUT_BTN = document.createElement("button");
            SE_INPUT_BTN.setAttribute("type", "button");
            SE_INPUT_BTN.setAttribute("class", "search-engine-input-button");
            applySVG(SE_INPUT_BTN)
            SE_INPUT_BTN.addEventListener("click", openSearchPage);

            // placed here for easier view of hierarchy of things
            SE_INPUT_ITEM.appendChild(SE_INPUT);
            SE_INPUT_ITEM.appendChild(SE_INPUT_BTN);

            SE_LIST_ITEM.appendChild(SE_NAME_HEADER);
            SE_LIST_ITEM.appendChild(SE_INPUT_ITEM);

            seListContainer.appendChild(SE_LIST_ITEM);
        } else if (listItem.hasOwnProperty("id") && !listItem.hasOwnProperty("url")) {console.log(`Object #${listItem + 1} with ID ${listItem.id} does not have a URL field.`)}
        else if (!listItem.hasOwnProperty("id") && listItem.hasOwnProperty("url")) {console.log(`Object #${listItem + 1} with URL ${listItem.url} does not have an ID field.`)}
        else {console.log(`Object #${listItem + 1} has none of the required data.`)}
    }

    containerBox.appendChild(seListContainer);
}
