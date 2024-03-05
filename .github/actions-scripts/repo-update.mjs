#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function updateRepo() {

    try {
        const { status:privateVulnerabilityReporting } = await octokit.rest.repos.enablePrivateVulnerabilityReporting({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
        });
        console.log( 'privateVulnerabilityReporting status: ' + privateVulnerabilityReporting );
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };

    try {
        const { status:repoUpdates } = await octokit.rest.repos.update({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
            security_and_analysis: { 
                "security_and_analysis": {
                    "advanced_security": { "status": "enabled" } ,
                    "secret_scanning": { "status": "enabled" } ,
                    "secret_scanning_push_protection": { "status": "enabled" } 
                }},
            has_issues: true,
            has_project: false,
            has_wiki: false,
            is_template: false,
            allow_squash_merge: true,
            allow_merge_commit: false,
            allow_rebase_merge: false,
            allow_auto_merge: true,
            delete_branch_on_merge: true,
            allow_update_branch: false,
            squash_merge_commit_title: "PR_TITLE",
            squash_merge_commit_message: "PR_BODY",
        });
        console.log( 'repoUpdates status: ' + repoUpdates );
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };

    return true;
};

async function main() {
    const result = await updateRepo();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=temp-slidev node .github/actions-scripts/repo-update.mjs
*/
