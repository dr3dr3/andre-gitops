#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.SECRET_NAME, "SECRET_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function checkRepoSecrets() {

    try {
        const { data:list } = await octokit.rest.actions.listRepoSecrets({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
        });
        console.log( 'listRepoSecrets: ' + JSON.stringify(list) );
        if (list.total_count == 0) return false;
        const listFiltered = list.secrets.filter( i => i.name === process.env.SECRET_NAME );
        console.log( listFiltered );
        const exists = (listFiltered.length == 1 ) ? true : false;
        if (exists) {
            return true;
        } else {
            return false;
        };
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };
};

async function main() {
    const result = await checkRepoSecrets();
    setOutput("result", result);
};