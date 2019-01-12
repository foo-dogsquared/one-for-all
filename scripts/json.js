function getListFromJSON(URL) {
    toggleStatusText(`Retrieving JSON database from <u>${URL}</u>.`, DB_URL_STATUS);
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
    const commandParameterFormat = /#[A-Za-z0-9_-]+(?:="[\s\w\d-]+")?/g;
    const urlRegex = /^\s*(https?|file|ftp)\:\/\/[\w|\W|\d]+[.][\w]+$/gi;
    const commandParameters = new Set(urlInputElement.value.match(commandParameterFormat));
    if (urlInputElement.value.trim().match(/^[A-Za-z0-9_-]+$/) && localStorage.getItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${urlInputElement.value.trim()}`)) {
        const keyword = `${ONE_FOR_ALL_KEYWORD_TEMPLATE}${urlInputElement.value.trim()}`;
        const keyword_url = localStorage.getItem(keyword);
        getListFromJSON(decodeURIComponent(keyword_url));
    }
    else if (urlInputElement.value.match(urlRegex)) {
        const urlString = new URL(urlInputElement.value);
        if (urlString.href.split("/").pop().indexOf(".json") >= 0) {
            getListFromJSON(urlInputElement.value);
        } 
        else toggleStatusText(`URL should be in the following format:<br><pre>[http | https | file | ftp]://[URL | file path]/se-list.json</pre>`, DB_URL_STATUS);
    }
    else if (commandParameters && commandParameters.size > 0) {
        let statusTextMessage = "";
        const invalidCommands = [];
        for (const command of commandParameters) {
            if (command === "#set-keyword" || command === "#set-keywords" || command === "#set-kw" || command === "#set-kws" || command === "#set-alias") statusTextMessage += setKeyword(command);
            else if (command === "#remove-keyword" || command === "#remove-keywords" || command === "#rm-keywords" || command === "#rm-keyword" || command === "#rm-kw" || command === "#rm-kws" || command === "#rm-alias") statusTextMessage += removeKeyword(command);
            else if (command === "#show-keywords" || command === "#show-keyword" || command === "#show-kw" || command === "#show-kws" || command === "#show-alias" || command === "#ls") statusTextMessage += showKeywords(command); 
            else if (command === "#default") statusTextMessage += setDefault(command);
            else if (command === "#show-list-at-start" || command === "#slas") statusTextMessage += toggleShowList(command);
            else invalidCommands.push(command);
        }

        if (invalidCommands.length > 0)
            for (const command of invalidCommands) statusTextMessage += formatCommandTextMessage(command, `at index ${urlInputElement.value.indexOf(command)} is an invalid command.`, "error");
        toggleStatusText(statusTextMessage, DB_URL_STATUS);
    }
    else {
        if (!urlInputElement.value) {
            const default_db = localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB);
            if (default_db) getListFromJSON(decodeURIComponent(default_db));
            else getListFromJSON("./se-list.json");
        }
    }

    if (urlInputElement.value) {
        if (COMMAND_HISTORY.length > 50) COMMAND_HISTORY.shift();
        COMMAND_HISTORY.unshift(urlInputElement.value);
        HISTORY_CURSOR = -1;
    }
    urlInputElement.value = "";
}

function renderList(querylist, seListContainer, containerBox) {
    if (!seListContainer) throw new Error("There's no container element that is being specified for the list.");
    while (seListContainer.firstElementChild) {seListContainer.removeChild(seListContainer.firstElementChild)}
    
    for (const listItem of querylist) {
        if (listItem.hasOwnProperty("id") && listItem.hasOwnProperty("url")) {
            const SE_LIST_ITEM = document.createElement("li");
            SE_LIST_ITEM.setAttribute("class", "search-engine");
            
            const SE_NAME_HEADER = document.createElement("label");
            SE_NAME_HEADER.setAttribute("for", listItem.id);
            SE_NAME_HEADER.setAttribute("class", "search-engine-name");
            SE_NAME_HEADER.textContent = listItem.name ? listItem.name : listItem.id;

            const SE_INPUT_ITEM = document.createElement("div");
            SE_INPUT_ITEM.setAttribute("class", "search-engine-input-item");
            SE_INPUT_ITEM.setAttribute("se-url", listItem.url);
            SE_INPUT_ITEM.setAttribute("se-url-hash", (listItem.hash) ? listItem.hash : "?");
            SE_INPUT_ITEM.setAttribute("se-url-param", (listItem.param) ? listItem.param : "q");

            const SE_INPUT = document.createElement("input");
            SE_INPUT.setAttribute("class", "search-engine-input");
            SE_INPUT.setAttribute("id", listItem.id);
            SE_INPUT.setAttribute("tabindex", 3);
            SE_INPUT.addEventListener("focus", () => DB_URL_STATUS.textContent = '');

            const SE_INPUT_BTN = document.createElement("button");
            SE_INPUT_BTN.setAttribute("type", "button");
            SE_INPUT_BTN.setAttribute("class", "search-engine-input-button");
            applySVG(SE_INPUT_BTN)

            const SE_HREF = document.createElement("div");
            SE_HREF.setAttribute("class", "search-engine-href");
            SE_HREF.textContent = `${listItem.url}${(listItem.hash) ? listItem.hash : "?"}${(listItem.param) ? listItem.param : "q"}=SEARCH_VALUE`;

            // placed here for easier view of hierarchy of things
            SE_INPUT_ITEM.appendChild(SE_INPUT);
            SE_INPUT_ITEM.appendChild(SE_INPUT_BTN);

            SE_LIST_ITEM.appendChild(SE_NAME_HEADER);
            SE_LIST_ITEM.appendChild(SE_INPUT_ITEM);
            SE_LIST_ITEM.appendChild(SE_HREF);

            seListContainer.appendChild(SE_LIST_ITEM);
        } else if (listItem.hasOwnProperty("id") && !listItem.hasOwnProperty("url")) {console.log(`Object #${listItem + 1} with ID ${listItem.id} does not have a URL field.`)}
        else if (!listItem.hasOwnProperty("id") && listItem.hasOwnProperty("url")) {console.log(`Object #${listItem + 1} with URL ${listItem.url} does not have an ID field.`)}
        else {console.log(`Object #${listItem + 1} has none of the required data.`)}
    }

    containerBox.appendChild(seListContainer);
}
