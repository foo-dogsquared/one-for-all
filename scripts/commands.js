"use strict";

const ONE_FOR_ALL_KEYWORD_TEMPLATE = `fds_one-for-all_keyword=`;
const ONE_FOR_ALL_DEFAULT_DB = `fds_one-for-all_default_db`;
const ONE_FOR_ALL_TOGGLE_DB_AT_START = `fds_one-for-all_toggle_db_at_start`;
const urlRegex = /(?:https?|file|ftp)\:\/\/[\w|\W|\d]+[.][\w]+/;

function setKeyword(command, wholestring = DB_URL_INPUT.value) {
    const splitArguments = wholestring.split(/\s+/);
    const commandIndex = splitArguments.indexOf(command);
    const potentialArguments = splitArguments.slice(commandIndex + 1);
    let textMessage = "";
    const validArgumentList = [];
    for (const argument of potentialArguments) {
        const validArgument = argument.match(/(\w+)=\"(.+)\"/);
        const potentialCommandParameter = argument.match(/--\$\w+/);
        if (!validArgument && !potentialCommandParameter)
            textMessage += `<code style="font-size:1.1em;">${command}</code>: Invalid argument format given at index ${wholestring.indexOf(argument)}.<br>`;
        else if (potentialCommandParameter) {
            if (validArgumentList.length <= 0) textMessage = `<code style="font-size:1.1em;">${command}</code>: No value detected.<br>`;
            break;
        }
        else {
            if (!validArgument[2].match(urlRegex)) {
                textMessage += `<code style="font-size:1.1em;">${command}</code>: Given argument value of ${validArgument[1]} is not a valid URL.<br>`;
                continue;
            }
            else {
                textMessage += `<code style="font-size:1.1em;">${command}</code>: Keyword <u>${validArgument[1]}</u> has been ${(localStorage.getItem(ONE_FOR_ALL_KEYWORD_TEMPLATE + encodeURIComponent(validArgument[1]))) ? "replaced" : "added"} with the value <u>${validArgument[2]}</u>.<br>`;
                localStorage.setItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${encodeURIComponent(validArgument[1])}`, encodeURIComponent(validArgument[2]));
                validArgumentList.push(validArgument);
            }
        }
    }

    return textMessage;
}

function removeKeyword(command, wholestring = DB_URL_INPUT.value) {

}

function setDefault(command, wholestring = DB_URL_INPUT.value) {
    
}

function toggleShowList(command, wholestring = DB_URL_INPUT.value) {
    const splitArguments = wholestring.split(/\s+/);
    const commandIndex = splitArguments.indexOf(command);
    const potentialArgument = splitArguments[commandIndex + 1];
    let textMessage = "";
    if (potentialArgument === "true" || potentialArgument === "false") {
        localStorage.setItem(ONE_FOR_ALL_TOGGLE_DB_AT_START, potentialArgument);
        textMessage += `<code style="font-size:1.1em;">${command}</code>: Toggling retrieving databases at start is set at ${potentialArgument}.<br>`;
    }
    else if (potentialArgument.match(/--\$\w+/) || !potentialArgument) textMessage += `<code style="font-size:1.1em;">${command}</code>: No value detected.<br>`;
    else textMessage += `<code style="font-size:1.1em;">${command}</code>: Toggling database at start only have <code>true</code> and <code>false</code> as possible values.<br>`;

    return textMessage;
}