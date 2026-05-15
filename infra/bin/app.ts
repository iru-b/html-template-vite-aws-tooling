#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import {
	APP_ID,
	AWS_CERTIFICATE_ARN,
	CUSTOM_DOMAIN,
	GITHUB_REPO_NAME,
	GITHUB_USER_NAME,
} from "../config";
import { FrontendInfraStack } from "../lib/frontend-infra-stack";
import { GitHubDeployStack } from "../lib/github-deploy-stack";
import type { Props } from "../lib/types";

const app = new cdk.App();

// 🌍 Production only (no staging)
const env: Props = {
	githubUser: GITHUB_USER_NAME,
	githubRepo: GITHUB_REPO_NAME,
	customDomainName: CUSTOM_DOMAIN,
	certificateArn: AWS_CERTIFICATE_ARN,
};

const infra = new FrontendInfraStack(app, APP_ID, env);

new GitHubDeployStack(app, "GitHubDeployStack", {
	...env,
	bucketName: infra.bucket.bucketName,
	distributionId: infra.distribution.distributionId,
});
