"use strict";const ONE_FOR_ALL_KEYWORD_TEMPLATE=`fds_one-for-all_keyword=`;const ONE_FOR_ALL_DEFAULT_DB=`fds_one-for-all_default_db`;const ONE_FOR_ALL_TOGGLE_DB_AT_START=`fds_one-for-all_toggle_db_at_start`;const urlRegex=/(?:https?|file|ftp)\:\/\/[\w|\W|\d]+[.][\w]+/;function formatCommandTextMessage(commandName,message,status="text"){return`<div style="text-align:left;margin-bottom:.4em"><code class="status-command-name" style="${status==="error"?"color:red":"color:black"};font-size:1.1em;">${commandName}</code>: ${message}</div>`}function setKeyword(command,wholestring=DB_URL_INPUT.value){const splitArguments=wholestring.split(/\s+/);const commandIndex=splitArguments.indexOf(command);const potentialArguments=splitArguments.slice(commandIndex+1);let textMessage="";const validArgumentList=[];const urlRegex=/^(https?|file|ftp)\:\/\/[\w|\W|\d]+(\..+?)$/i;for(const argument of potentialArguments){const validArgument=argument.match(/([A-Za-z0-9_-]+)=\"(.+)\"/);const potentialCommandParameter=argument.match(/#[A-Za-z0-9_-]+/);if(!validArgument&&!potentialCommandParameter)textMessage+=formatCommandTextMessage(command,`Invalid argument format given at index ${wholestring.indexOf(argument)}.`);else if(potentialCommandParameter){break}else{const validUrl=validArgument[2].match(urlRegex);if(!validUrl)textMessage+=formatCommandTextMessage(command,`Given argument value of <u>${validArgument[1]}</u> is not a valid URL.`);else{if(validUrl[2]===".json")textMessage+=formatCommandTextMessage(command,`Keyword <u>${validArgument[1]}</u> has been ${localStorage.getItem(ONE_FOR_ALL_KEYWORD_TEMPLATE+encodeURIComponent(validArgument[1]))?"replaced":"added"} with the value <u>${validArgument[2]}</u>.`);else textMessage+=formatCommandTextMessage(command,`URL given with keyword <u>${validArgument[1]}</u> does not direct to a JSON file.`);localStorage.setItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${encodeURIComponent(validArgument[1])}`,encodeURIComponent(validArgument[2]))}validArgumentList.push(validArgument)}}if(validArgumentList.length<=0)textMessage+=formatCommandTextMessage(command,`No value detected.`);return textMessage}function removeKeyword(command,wholestring=DB_URL_INPUT.value){const splitArguments=wholestring.split(/\s+/);const commandIndex=splitArguments.indexOf(command);const potentialArguments=splitArguments.slice(commandIndex+1);let textMessage="";const validArgumentList=[];for(const argument of potentialArguments){const potentialCommandParameter=argument.match(/#[A-Za-z0-9_-]+/);const keywordArray=argument.match(/\[.+?\]/);if(!argument||potentialCommandParameter)break;else if(keywordArray){const keywordsStr=keywordArray.join();const keywords=keywordsStr.substr(1,keywordsStr.length-2).split(",");for(const keyword of keywords){if(keyword.match(/[A-Za-z0-9_-]/)){if(!localStorage.getItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${keyword}`))textMessage+=formatCommandTextMessage(command,`Keyword ${keyword} is not yet set.`);else{localStorage.removeItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${keyword}`);textMessage+=formatCommandTextMessage(command,`Usable keyword ${keyword} has been removed.`)}}else textMessage+=formatCommandTextMessage(command,`Only accepts phrases with at least one alphanumeric character, hypens, and underscores.`)}validArgumentList.push(keywordArray)}else if(argument.match(/[A-Za-z0-9_-]/)){if(!localStorage.getItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${argument}`))textMessage+=formatCommandTextMessage(command,`Keyword ${argument} is not yet set.`);else{localStorage.removeItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${argument}`);textMessage+=formatCommandTextMessage(command,`Usable keyword ${argument} has been removed.`)}validArgumentList.push(argument)}else textMessage+=formatCommandTextMessage(command,`Only accepts phrases with at least one alphanumeric character, hypens, and underscores.`)}if(validArgumentList.length<=0)textMessage+=formatCommandTextMessage(command,"No value detected.");return textMessage}function setDefault(command,wholestring=DB_URL_INPUT.value){const splitArguments=wholestring.split(/\s+/);const commandIndex=splitArguments.indexOf(command);const potentialArgument=splitArguments[commandIndex+1];const urlRegex=/^(https?|file|ftp)\:\/\/[\w|\W|\d]+(\..+?)$/i;let textMessage="";if(!potentialArgument||potentialArgument.match(/--\$\w+/))textMessage+=formatCommandTextMessage(command,`No value detected.`);else if(potentialArgument.match(urlRegex)){if(potentialArgument.match(urlRegex)[2]===".json"){localStorage.setItem(ONE_FOR_ALL_DEFAULT_DB,potentialArgument);textMessage+=formatCommandTextMessage(command,`Default database is set at ${potentialArgument}.`)}else textMessage+=formatCommandTextMessage(command,`URL given does not direct to a JSON file.`)}else if(potentialArgument==="-clear"){if(localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB)){localStorage.removeItem(ONE_FOR_ALL_DEFAULT_DB);textMessage+=formatCommandTextMessage(command,`Default database setting is cleared. Default database URL is at "./se-list.json".`)}else textMessage+=formatCommandTextMessage(command,`There is no default database stored.`)}else textMessage+=formatCommandTextMessage(command,`Given value is invalid URL.`);return textMessage}function toggleShowList(command,wholestring=DB_URL_INPUT.value){const splitArguments=wholestring.split(/\s+/);const commandIndex=splitArguments.indexOf(command);const potentialArgument=splitArguments[commandIndex+1];let textMessage="";if(!potentialArgument)textMessage+=formatCommandTextMessage(command,`No value detected.`);else if(potentialArgument==="true"||potentialArgument==="false"){localStorage.setItem(ONE_FOR_ALL_TOGGLE_DB_AT_START,potentialArgument);textMessage+=formatCommandTextMessage(command,`Toggling retrieving databases at start is ${potentialArgument==="true"?"enabled. The effects of enabling this setting will take effect in the next visit (or reload)":"disabled"}.`)}else if(potentialArgument.match(/#[A-Za-z0-9_-]+/)||!potentialArgument)textMessage+=formatCommandTextMessage(command,`No value detected.`);else textMessage+=formatCommandTextMessage(command,`Toggling database at start only have <code>true</code> and <code>false</code> as possible values.`);return textMessage}function showKeywords(command,wholestring=DB_URL_INPUT.value){const splitArguments=wholestring.split(/\s+/);const commandIndex=splitArguments.indexOf(command);const potentialArgument=splitArguments[commandIndex+1];let textMessage="";if(potentialArgument!=="-default"){for(const item in localStorage){if(item.indexOf(ONE_FOR_ALL_KEYWORD_TEMPLATE)!==-1)textMessage+=formatCommandTextMessage(command,`<b style="font-size:1.2em;">${item.substr(ONE_FOR_ALL_KEYWORD_TEMPLATE.length)}</b> ${potentialArgument==="-keyword"?"":"- <i style=\"font-size:1.1em;\">"+decodeURIComponent(localStorage.getItem(item))+"</i>"}`)}}else textMessage+=formatCommandTextMessage(command,`<span style="font-size:1.1em">${localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB)?"Default database: <i>"+localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB)+"</i>":"You did not set a user-defined default database yet so you get './se-list.json'."}</span>`);if(!textMessage)textMessage=formatCommandTextMessage(command,`No keywords have been set yet.`);return textMessage}
"use strict";const books_json_url="https://cdn.staticaly.com/gist/foo-dogsquared/274fbe4508cdbf48a5a8bdbe28a731d0/raw/33286bba88cf7aab7109bc0d16b7f32e62368e1c/books.json";const moocs_json_url="https://cdn.staticaly.com/gist/foo-dogsquared/eb567b501ae328ec76e84c8f75cc9fdb/raw/6f706fe1d20b42b72fdacb5781383ce4a2b6ae76/moocs.json";const LIST_CONTAINER=document.querySelector("#list-container");const SE_LIST=document.querySelector("ul#search-list");const DB_URL_INPUT=document.querySelector("#dbUrlInput");const DB_URL_SEARCH=document.querySelector("#dbUrlSearch");const DB_URL_STATUS=document.querySelector("#dbURLStatus");const COMMAND_HISTORY=[];let HISTORY_CURSOR=-1;SE_LIST.addEventListener("keypress",event=>{const target=event.target;if(target.tagName==="INPUT"&&event.key==="Enter"&&target.parentNode.tagName==="DIV"&&target.parentNode.classList.contains("search-engine-input-item")&&target.value.match(/\S/gi))openSearchPage(target)});SE_LIST.addEventListener("click",event=>{const target=event.target;if(target.tagName==="BUTTON"&&target.previousSibling.tagName==="INPUT"&&target.previousSibling.classList.contains("search-engine-input")&&target.previousSibling.value.match(/\S/gi))openSearchPage(target.previousSibling)});DB_URL_INPUT.addEventListener("keypress",function(event){if(event.key==="ArrowDown"&&COMMAND_HISTORY.length>0){DB_URL_INPUT.value=COMMAND_HISTORY[HISTORY_CURSOR=HISTORY_CURSOR>0?--HISTORY_CURSOR%COMMAND_HISTORY.length:COMMAND_HISTORY.length-1]}else if(event.key==="ArrowUp"&&COMMAND_HISTORY.length>0){DB_URL_INPUT.value=COMMAND_HISTORY[HISTORY_CURSOR=++HISTORY_CURSOR%COMMAND_HISTORY.length]}});applySVG(DB_URL_SEARCH);if(localStorage.getItem(ONE_FOR_ALL_TOGGLE_DB_AT_START)==="true")localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB)?getListFromJSON(localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB)):getListFromJSON("./se-list.json");DB_URL_SEARCH.addEventListener("click",event=>{retrieveJSON(DB_URL_INPUT)});DB_URL_INPUT.addEventListener("keypress",event=>{if(event.key==="Enter")retrieveJSON(DB_URL_INPUT)});
function getListFromJSON(URL){toggleStatusText(`Retrieving JSON database from <u>${URL}</u>.`,DB_URL_STATUS);fetch(URL).then(response=>{console.log(`${response.url} is ${response.status} (${response.statusText})`);if(response.status===200)toggleStatusText(`Status ${response.status}: ${response.statusText} from <a href="${response.url}" style="color:black;text-decoration:underline;">${response.url}</a><br>`,DB_URL_STATUS);else toggleStatusText(`Status ${response.status}: ${response.statusText}<br>`,DB_URL_STATUS);return response.json()}).then(json=>{const SE_DATA_LIST=json;SE_DATA_LIST.sort(sortID);console.log(SE_DATA_LIST);renderList(SE_DATA_LIST,SE_LIST,LIST_CONTAINER)}).catch(error=>{return null})}function retrieveJSON(urlInputElement){const commandParameterFormat=/#[A-Za-z0-9_-]+(?:="[\s\w\d-]+")?/g;const urlRegex=/^\s*(https?|file|ftp)\:\/\/[\w|\W|\d]+[.][\w]+$/gi;const commandParameters=new Set(urlInputElement.value.match(commandParameterFormat));if(urlInputElement.value.trim().match(/^[A-Za-z0-9_-]+$/)&&localStorage.getItem(`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${urlInputElement.value.trim()}`)){const keyword=`${ONE_FOR_ALL_KEYWORD_TEMPLATE}${urlInputElement.value.trim()}`;const keyword_url=localStorage.getItem(keyword);getListFromJSON(decodeURIComponent(keyword_url))}else if(urlInputElement.value.match(urlRegex)){const urlString=new URL(urlInputElement.value);if(urlString.href.split("/").pop().indexOf(".json")>=0){getListFromJSON(urlInputElement.value)}else toggleStatusText(`URL should be in the following format:<br><pre>[http | https | file | ftp]://[URL | file path]/se-list.json</pre>`,DB_URL_STATUS)}else if(commandParameters&&commandParameters.size>0){let statusTextMessage="";const invalidCommands=[];for(const command of commandParameters){if(command==="#set-keyword"||command==="#set-keywords"||command==="#set-kw"||command==="#set-kws"||command==="#set-alias")statusTextMessage+=setKeyword(command);else if(command==="#remove-keyword"||command==="#remove-keywords"||command==="#rm-keywords"||command==="#rm-keyword"||command==="#rm-kw"||command==="#rm-kws"||command==="#rm-alias")statusTextMessage+=removeKeyword(command);else if(command==="#show-keywords"||command==="#show-keyword"||command==="#show-kw"||command==="#show-kws"||command==="#show-alias"||command==="#ls")statusTextMessage+=showKeywords(command);else if(command==="#default")statusTextMessage+=setDefault(command);else if(command==="#show-list-at-start"||command==="#slas")statusTextMessage+=toggleShowList(command);else invalidCommands.push(command)}if(invalidCommands.length>0)for(const command of invalidCommands)statusTextMessage+=formatCommandTextMessage(command,`at index ${urlInputElement.value.indexOf(command)} is an invalid command.`,"error");toggleStatusText(statusTextMessage,DB_URL_STATUS)}else{if(!urlInputElement.value){const default_db=localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB);if(default_db)getListFromJSON(decodeURIComponent(default_db));else getListFromJSON("./se-list.json")}}if(urlInputElement.value){if(COMMAND_HISTORY.length>50)COMMAND_HISTORY.shift();COMMAND_HISTORY.unshift(urlInputElement.value);HISTORY_CURSOR=-1}urlInputElement.value=""}function renderList(querylist,seListContainer,containerBox){if(!seListContainer)throw new Error("There's no container element that is being specified for the list.");while(seListContainer.firstElementChild){seListContainer.removeChild(seListContainer.firstElementChild)}for(const listItem of querylist){if(listItem.hasOwnProperty("id")&&listItem.hasOwnProperty("url")){const SE_LIST_ITEM=document.createElement("li");SE_LIST_ITEM.setAttribute("class","search-engine");const SE_NAME_HEADER=document.createElement("label");SE_NAME_HEADER.setAttribute("for",listItem.id);SE_NAME_HEADER.setAttribute("class","search-engine-name");SE_NAME_HEADER.textContent=listItem.name?listItem.name:listItem.id;const SE_INPUT_ITEM=document.createElement("div");SE_INPUT_ITEM.setAttribute("class","search-engine-input-item");SE_INPUT_ITEM.setAttribute("se-url",listItem.url);SE_INPUT_ITEM.setAttribute("se-url-hash",listItem.hash?listItem.hash:"?");SE_INPUT_ITEM.setAttribute("se-url-param",listItem.param?listItem.param:"q");const SE_INPUT=document.createElement("input");SE_INPUT.setAttribute("class","search-engine-input");SE_INPUT.setAttribute("id",listItem.id);SE_INPUT.setAttribute("tabindex",3);SE_INPUT.addEventListener("focus",()=>DB_URL_STATUS.textContent="");const SE_INPUT_BTN=document.createElement("button");SE_INPUT_BTN.setAttribute("type","button");SE_INPUT_BTN.setAttribute("class","search-engine-input-button");applySVG(SE_INPUT_BTN);SE_INPUT_ITEM.appendChild(SE_INPUT);SE_INPUT_ITEM.appendChild(SE_INPUT_BTN);SE_LIST_ITEM.appendChild(SE_NAME_HEADER);SE_LIST_ITEM.appendChild(SE_INPUT_ITEM);seListContainer.appendChild(SE_LIST_ITEM)}else if(listItem.hasOwnProperty("id")&&!listItem.hasOwnProperty("url")){console.log(`Object #${listItem+1} with ID ${listItem.id} does not have a URL field.`)}else if(!listItem.hasOwnProperty("id")&&listItem.hasOwnProperty("url")){console.log(`Object #${listItem+1} with URL ${listItem.url} does not have an ID field.`)}else{console.log(`Object #${listItem+1} has none of the required data.`)}}containerBox.appendChild(seListContainer)}
function applySVG(node,svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="16"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/></svg>`){node.innerHTML=svg}function toggleStatusText(message,statusTextbox){statusTextbox.innerHTML=message;statusTextbox.style.visibility="visible"}function sortID(current,next){if(current.id>next.id)return 1;else if(current.id<next.id)return-1;else return 0}function openSearchPage(nodeTarget){const searchEngineDiv=nodeTarget.parentNode;const listItemURL=searchEngineDiv.getAttribute("se-url");const listItemHash=searchEngineDiv.getAttribute("se-url-hash");const listItemParam=searchEngineDiv.getAttribute("se-url-param");const FULLSEARCH_URL=encodeURI(`${listItemURL}${listItemHash}${listItemParam}=${nodeTarget.value}`);window.open(FULLSEARCH_URL,"_blank");nodeTarget.value=""}
