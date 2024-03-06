#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.VAR_NAME, "VAR_NAME not present");
console.assert(process.env.VAR_VAL, "VAR_VAL not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function createRepoVariable() {

    try {
        const { status:varCreated } = await octokit.rest.actions.createRepoVariable({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
            name: process.env.VAR_NAME,
            value: process.env.VAR_VAL,
        });
        console.log( 'createRepoVariable status: ' + varCreated );
        return true;
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };
};

async function main() {
    const result = await createRepoVariable();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=template-slidev VAR_NAME=TEST VAR_VAL=WORKING node .github/actions-scripts/repo-vars-create.mjs
*/