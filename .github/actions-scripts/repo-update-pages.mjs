#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function updateRepoPages() {

    let getPages = 404;
    try {
        const { status:githubPages } = await octokit.rest.repos.getPages({
        owner: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
        });
        getPages = 200;
        console.log( 'getPages status: ' + githubPages );
    } catch (err) {
        if (err.message.substring(0,9) === 'Not Found') {
            console.error("Pages not setup yet");
        } else {
            setFailed(err.message);
            console.error("Error!!! " + err);
        }
    };

    if (getPages === 404) {
        try {
            const { status:githubPagesCreate } = await octokit.rest.repos.createPagesSite({
                owner: process.env.REPO_OWNER,
                repo: process.env.REPO_NAME,
                build_type: "workflow",
                source: {
                    "branch": "main",
                    "path": "/",
                },
            });
            console.log( 'createPagesSite status: ' + githubPagesCreate );
        } catch (err) {
            setFailed(err.message);
            console.error("Error!!! " + err);
        };        
    };

    if (getPages === 200) {
        try {
            const { status:githubPagesCreate } = await octokit.rest.repos.updateInformationAboutPagesSite({
                owner: process.env.REPO_OWNER,
                repo: process.env.REPO_NAME,
                build_type: "workflow",
                source: {
                    "branch": "main",
                    "path": "/",
                },
            });
            console.log( 'updateInformationAboutPagesSite status: ' + githubPagesCreate );
        } catch {
            setFailed(err.message);
            console.error("Error!!! " + err);
        }
    };

    return true;
};

async function main() {
    const result = await updateRepoPages();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=temp-slidev node .github/actions-scripts/repo-update-pages.mjs
*/