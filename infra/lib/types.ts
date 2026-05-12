import * as cdk from 'aws-cdk-lib';

export interface Props extends cdk.StackProps {
    githubUser: string;
    githubRepo: string;
}