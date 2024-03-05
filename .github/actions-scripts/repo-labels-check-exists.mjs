#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.LABEL_NAME, "LABEL_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function getLabel() {

    try {
        const { data:list } = await octokit.rest.issues.listLabelsForRepo({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
        });
        console.log( 'getLabel status: ' + getLabel );
        const listFiltered = list.filter( i => i.name === process.env.LABEL_NAME );
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
    const result = await getLabel();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=temp-slidev node .github/actions-scripts/repo-update-branch-protection.mjs
*/
