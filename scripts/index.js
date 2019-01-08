"use strict";
const books_json_url = 'https://cdn.staticaly.com/gist/foo-dogsquared/274fbe4508cdbf48a5a8bdbe28a731d0/raw/33286bba88cf7aab7109bc0d16b7f32e62368e1c/books.json';
const moocs_json_url = 'https://cdn.staticaly.com/gist/foo-dogsquared/eb567b501ae328ec76e84c8f75cc9fdb/raw/6f706fe1d20b42b72fdacb5781383ce4a2b6ae76/moocs.json';
const LIST_CONTAINER = document.querySelector("#list-container");
const SE_LIST = document.querySelector("ul#search-list");

const DB_URL_INPUT = document.querySelector("#dbUrlInput");
const DB_URL_SEARCH = document.querySelector("#dbUrlSearch");
const DB_URL_STATUS = document.querySelector("#dbURLStatus");
    
SE_LIST.addEventListener("onkeydown", (event) => {
    const target = event.target;

    if (target.tagName === "INPUT" && event.key === "Enter") {
        console.log(target);
    }
})

applySVG(DB_URL_SEARCH);

DB_URL_SEARCH.addEventListener("click", (event) => {
    retrieveJSON(DB_URL_INPUT);
});
DB_URL_INPUT.addEventListener("keypress", (event) => {
    if (event.key === "Enter") retrieveJSON(DB_URL_INPUT);
});