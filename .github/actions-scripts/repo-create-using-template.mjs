#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.REPO_TEMPLATE, "REPO_TEMPLATE not present");
console.assert(process.env.REPO_DESC, "REPO_DESC not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function createRepoUsingTemplate() {

    try {
        const { status:repoCreated } = await octokit.rest.repos.createUsingTemplate({
            template_owner: 'dr3dr3',
            template_repo: process.env.REPO_TEMPLATE,
            owner: process.env.REPO_OWNER,
            name: process.env.REPO_NAME,
            description: process.env.REPO_DESC,
            private: false,
            include_all_branches: false,
            });
        console.log( repoCreated );
        return true;
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };
};

async function main() {
    const result = await createRepoUsingTemplate();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=template-slidev REPO_TEMPLATE=dr3dr3/template-revealmd REPO_DESC=testing node .github/actions-scripts/repo-create-using-template.mjs
*/