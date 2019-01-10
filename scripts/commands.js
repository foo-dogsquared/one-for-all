"use strict";

const ONE_FOR_ALL_KEYWORD_TEMPLATE = `fds_one-for-all_keyword=`;
const ONE_FOR_ALL_DEFAULT_DB = `fds_one-for-all_default_db`;
const ONE_FOR_ALL_TOGGLE_DB_AT_START = `fds_one-for-all_toggle_db_at_start`;
const urlRegex = /(?:https?|file|ftp)\:\/\/[\w|\W|\d]+[.][\w]+/;

function formatCommandTextMessage(commandName, message, status = "text") {return `<div style="text-align:left;margin-bottom:.4em"><code class="status-command-name" style="${(status === "error") ? "color:red" : "color:black"};font-size:1.1em;">${commandName}</code>: ${message}</div>`;}

function setKeyword(command, wholestring = DB_URL_INPUT.value) {
    const splitArguments = wholestring.split(/\s+/);
    const commandIndex = splitArguments.indexOf(command);
    const potentialArguments = splitArguments.slice(commandIndex + 1);
    let textMessage = "";
    const validArgumentList = [];
    const urlRegex = /^(https?|file|ftp)\:\/\/[\w|\W|\d]+(\..+?)$/i;
    for (const argument of potentialArguments) {
        const validArgument = argument.match(/([A-Za-z0-9_-]+)=\"(.+)\"/);
        const potentialCommandParameter = argument.match(/#[A-Za-z0-9_-]+/);
        if (!validArgument && !potentialCommandParameter)
        textMessage += formatCommandTextMessage(command,`Invalid argument format given at index ${wholestring.indexOf(argument)}.`);
        else if (potentialCommandParameter) {break;}
        else {
            const validUrl = validArgument[2].match(urlRegex);
            if (!validUrl) textMessage += formatCommandTextMessage(command,`Given argument value of <u>${validArgument[1]}</u> is not a valid URL.`);
            else {
                if (validUrl[2] === ".json") textMessage += formatCommandTextMessage(command,`Keyword <u>${validArgument[1]}</u> has been ${(localStorage.getItem(ONE_FOR_ALL_KEYWORD_TEMPLATE + encodeURIComponent(validArgument[1]))) ? "replaced" : "added"} with the value <u>${validArgument[2]}</u>.`);
                else textMessage += formatCommandTextMessage(command, `URL given with keyword <u>${validArgument[1]}</u> does not direct to a JSON file.`);
                localStorage.setItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${encodeURIComponent(validArgument[1])}`, encodeURIComponent(validArgument[2]));
            }
            validArgumentList.push(validArgument);
        }
    }

    if (validArgumentList.length <= 0) textMessage += formatCommandTextMessage(command,`No value detected.`);

    return textMessage;
}

function removeKeyword(command, wholestring = DB_URL_INPUT.value) {
    const splitArguments = wholestring.split(/\s+/);
    const commandIndex = splitArguments.indexOf(command);
    const potentialArguments = splitArguments.slice(commandIndex + 1);
    let textMessage = "";
    const validArgumentList = [];
    for (const argument of potentialArguments) {
        const potentialCommandParameter = argument.match(/#[A-Za-z0-9_-]+/);
        const keywordArray = argument.match(/\[.+?\]/);
        if (!argument || potentialCommandParameter) break;
        else if (keywordArray) {
            const keywordsStr = keywordArray.join();
            const keywords = keywordsStr.substr(1, keywordsStr.length - 2).split(",");
            for (const keyword of keywords) {
                if (keyword.match(/[A-Za-z0-9_-]/)) {
                    if (!localStorage.getItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${keyword}`)) textMessage += formatCommandTextMessage(command, `Keyword ${keyword} is not yet set.`); 
                    else {
                        localStorage.removeItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${keyword}`);
                        textMessage += formatCommandTextMessage(command, `Usable keyword ${keyword} has been removed.`);
                    }
                }
                else textMessage += formatCommandTextMessage(command, `Only accepts phrases with at least one alphanumeric character, hypens, and underscores.`);
            }
            validArgumentList.push(keywordArray);
        }
        else if (argument.match(/[A-Za-z0-9_-]/)) {
            if (!localStorage.getItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${argument}`)) textMessage += formatCommandTextMessage(command, `Keyword ${argument} is not yet set.`); 
            else {
                localStorage.removeItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${argument}`);
                textMessage += formatCommandTextMessage(command, `Usable keyword ${argument} has been removed.`);
            }
            validArgumentList.push(argument);
        }
        else textMessage += formatCommandTextMessage(command, `Only accepts phrases with at least one alphanumeric character, hypens, and underscores.`);
    }

    if (validArgumentList.length <= 0) textMessage += formatCommandTextMessage(command, "No value detected.");

    return textMessage;
}

function setDefault(command, wholestring = DB_URL_INPUT.value) {
    const splitArguments = wholestring.split(/\s+/);
    const commandIndex = splitArguments.indexOf(command);
    const potentialArgument = splitArguments[commandIndex + 1];
    const urlRegex = /^(https?|file|ftp)\:\/\/[\w|\W|\d]+(\..+?)$/i;
    let textMessage = "";
    if (!potentialArgument || potentialArgument.match(/--\$\w+/) ) textMessage += formatCommandTextMessage(command,`No value detected.`);
    else if (potentialArgument.match(urlRegex)) {
        if (potentialArgument.match(urlRegex)[2] === ".json") {
            localStorage.setItem(ONE_FOR_ALL_DEFAULT_DB, potentialArgument);
            textMessage += formatCommandTextMessage(command,`Default database is set at ${potentialArgument}.`);
        } 
        else textMessage += formatCommandTextMessage(command, `URL given does not direct to a JSON file.`);
    }
    else if (potentialArgument === "-clear") {
        if (localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB)) {
            localStorage.removeItem(ONE_FOR_ALL_DEFAULT_DB);
            textMessage += formatCommandTextMessage(command, `Default database setting is cleared. Default database URL is at "./se-list.json".`);
        } 
        else textMessage += formatCommandTextMessage(command, `There is no default database stored.`);
    }
    else textMessage += formatCommandTextMessage(command,`Given value is invalid URL.`);

    return textMessage;
}

function toggleShowList(command, wholestring = DB_URL_INPUT.value) {
    const splitArguments = wholestring.split(/\s+/);
    const commandIndex = splitArguments.indexOf(command);
    const potentialArgument = splitArguments[commandIndex + 1];
    let textMessage = "";
    if (!potentialArgument) textMessage += formatCommandTextMessage(command, `No value detected.`);
    else if (potentialArgument === "true" || potentialArgument === "false") {
        localStorage.setItem(ONE_FOR_ALL_TOGGLE_DB_AT_START, potentialArgument);
        textMessage += formatCommandTextMessage(command,`Toggling retrieving databases at start is ${(potentialArgument === "true") ? "enabled. The effects of enabling this setting will take effect in the next visit (or reload)" : "disabled"}.`);
    }
    else if (potentialArgument.match(/#[A-Za-z0-9_-]+/) || !potentialArgument) textMessage += formatCommandTextMessage(command,`No value detected.`);
    else textMessage += formatCommandTextMessage(command,`Toggling database at start only have <code>true</code> and <code>false</code> as possible values.`);

    return textMessage;
}

function showKeywords(command, wholestring = DB_URL_INPUT.value) {
    const splitArguments = wholestring.split(/\s+/);
    const commandIndex = splitArguments.indexOf(command);
    const potentialArgument = splitArguments[commandIndex + 1];
    let textMessage = "";
    if (potentialArgument !== "-default") {
        for (const item in localStorage) {
            if (item.indexOf(ONE_FOR_ALL_KEYWORD_TEMPLATE) !== -1) textMessage += formatCommandTextMessage(command, `<b style="font-size:1.2em;">${item.substr(ONE_FOR_ALL_KEYWORD_TEMPLATE.length)}</b> ${(potentialArgument === "-keyword") ? "" : "- <i style=\"font-size:1.1em;\">" + decodeURIComponent(localStorage.getItem(item)) + "</i>"}`);
        }
    }
    else textMessage += formatCommandTextMessage(command, `<span style="font-size:1.1em">${(localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB)) ? "Default database: <i>" + localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB) + "</i>" : "You did not set a user-defined default database yet so you get './se-list.json'."}</span>`);

    if (!textMessage) textMessage = formatCommandTextMessage(command, `No keywords have been set yet.`);

    return textMessage;
}
