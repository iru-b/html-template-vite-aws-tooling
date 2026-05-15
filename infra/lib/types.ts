import type * as cdk from "aws-cdk-lib";

export interface Props extends cdk.StackProps {
	githubUser: string;
	githubRepo: string;
	customDomainName: string;
	certificateArn: string;
}
