#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function updateRepoBranchProtection() {

    try {
        const { status:updateBranchProtection } = await octokit.rest.repos.updateBranchProtection({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
            branch: 'main',
            required_status_checks: { 
                strict: true,
                contexts: ["status-checks"],
            },
            enforce_admins: true,
            required_pull_request_reviews: null,
            restrictions: null,
            required_linear_history: true,
            allow_force_pushes: true,
            allow_deletions: false,
            block_creations: false,
            required_conversation_resolution: false,
            lock_branch: false,
            allow_fork_syncing: false,
        });
        console.log( 'updateRepoBranchProtection status: ' + updateBranchProtection );
        return true;
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };
};

async function main() {
    const result = await updateRepoBranchProtection();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=temp-slidev node .github/actions-scripts/repo-update-branch-protection.mjs
*/
