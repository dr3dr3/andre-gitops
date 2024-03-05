#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function checkTemplateRepos() {

    try {
        const { data:list } = await octokit.rest.repos.listForUser({
            username: process.env.REPO_OWNER,
            type: 'owner'
        });
        console.log( 'listForUser: ' + JSON.stringify(list) );
        const listFiltered = list.filter( i => i.name === process.env.REPO_NAME );
        console.log( listFiltered );
        const exists = (listFiltered.length == 1 ) ? true : false;
        if (exists) {
            const { data:getRepo } = await octokit.rest.repos.get({
                owner: process.env.REPO_OWNER,
                repo: listFiltered[0].name,
            });
            if (getRepo.is_template == true) {
                return true;
            } else {
                return false;
            };
        } else {
            return false;
        };
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };
};

async function main() {
    const result = await checkTemplateRepos();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=template-slidev node .github/actions-scripts/repo-template-exists.mjs
*/