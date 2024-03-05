#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.LABEL_NAME, "LABEL_NAME not present");
console.assert(process.env.LABEL_COLOR, "LABEL_COLOR not present");
console.assert(process.env.LABEL_DESC, "LABEL_DESC not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function updateRepoLabels() {

    try {
        const { status:createLabel } = await octokit.rest.issues.createLabel({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
            name: process.env.LABEL_NAME,
            color: process.env.LABEL_COLOR,
            description: process.env.LABEL_DESC,
        });
        console.log( 'createLabel status: ' + createLabel );
        return true;
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };
};

async function main() {
    const result = await updateRepoLabels();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=temp-slidev node .github/actions-scripts/repo-update-branch-protection.mjs
*/
