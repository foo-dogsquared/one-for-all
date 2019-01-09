"use strict";
const books_json_url = 'https://cdn.staticaly.com/gist/foo-dogsquared/274fbe4508cdbf48a5a8bdbe28a731d0/raw/33286bba88cf7aab7109bc0d16b7f32e62368e1c/books.json';
const moocs_json_url = 'https://cdn.staticaly.com/gist/foo-dogsquared/eb567b501ae328ec76e84c8f75cc9fdb/raw/6f706fe1d20b42b72fdacb5781383ce4a2b6ae76/moocs.json';
const LIST_CONTAINER = document.querySelector("#list-container");
const SE_LIST = document.querySelector("ul#search-list");

const DB_URL_INPUT = document.querySelector("#dbUrlInput");
const DB_URL_SEARCH = document.querySelector("#dbUrlSearch");
const DB_URL_STATUS = document.querySelector("#dbURLStatus");

const COMMAND_HISTORY = [];
let HISTORY_CURSOR = -1;

SE_LIST.addEventListener("keypress", (event) => {
    const target = event.target;

    if (target.tagName === "INPUT" && event.key === "Enter" && target.parentNode.tagName === "DIV" && target.parentNode.classList.contains("search-engine-input-item") && target.value.match(/\S/gi))
        openSearchPage(target);
});

SE_LIST.addEventListener("click", (event) => {
    const target = event.target;

    if (target.tagName === "BUTTON" && target.previousSibling.tagName === "INPUT" && target.previousSibling.classList.contains("search-engine-input") && target.previousSibling.value.match(/\S/gi))
        openSearchPage(target.previousSibling);
})

DB_URL_INPUT.addEventListener("keypress", function(event) {
    if (event.key === "ArrowDown" && COMMAND_HISTORY.length > 0) {
        DB_URL_INPUT.value = COMMAND_HISTORY[HISTORY_CURSOR = (HISTORY_CURSOR > 0) ? --HISTORY_CURSOR % COMMAND_HISTORY.length : COMMAND_HISTORY.length - 1];
    }
    else if (event.key === "ArrowUp" && COMMAND_HISTORY.length > 0) {
        DB_URL_INPUT.value = COMMAND_HISTORY[HISTORY_CURSOR = ++HISTORY_CURSOR % COMMAND_HISTORY.length];
    }
})

applySVG(DB_URL_SEARCH);

if (localStorage.getItem(ONE_FOR_ALL_TOGGLE_DB_AT_START) === "true") 
    localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB) ? getListFromJSON(localStorage.getItem(ONE_FOR_ALL_DEFAULT_DB)) : getListFromJSON("./se-list.json");

DB_URL_SEARCH.addEventListener("click", (event) => {
    retrieveJSON(DB_URL_INPUT);
});
DB_URL_INPUT.addEventListener("keypress", (event) => {
    if (event.key === "Enter") retrieveJSON(DB_URL_INPUT);
});