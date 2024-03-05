#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.VAR_NAME, "VAR_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function checkRepoVariables() {

    try {
        const { data:list } = await octokit.rest.actions.listRepoVariables({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
        });
        console.log( 'listRepoVariables: ' + list.toString() );
        const listFiltered = list.filter( i => i.name === process.env.VAR_NAME );
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
    const result = await checkRepoVariables();
    setOutput("result", result);
};