#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.VAR_NAME, "VAR_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function checkRepoEnvironments() {

    try {
        const { data:repo } = await octokit.rest.repos.get({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
        });
        const { data:list } = await octokit.rest.actions.listEnvironmentVariables({
            repository_id: repo.id,
            environment_name: 'github-pages',
            per_page: 50,
        });
        console.log( 'listEnvVariables: ' + JSON.stringify(list) );
        if (list.total_count == 0) return false;
        const listFiltered = list.variables.filter( i => i.name === process.env.VAR_NAME );
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
    const result = await checkRepoEnvironments();
    setOutput("result", result);
};