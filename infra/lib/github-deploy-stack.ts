import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Props } from './types';

interface GitHubDeployStackProps extends Props {
    bucketName: string;
    distributionId: string;
}

export class GitHubDeployStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: GitHubDeployStackProps) {
        super(scope, id, props);

        const deployPolicy = new iam.ManagedPolicy(this, 'DeployPolicy', {
            statements: [

                // 📦 REQUIRED: list bucket contents (needed for aws s3 sync)
                new iam.PolicyStatement({
                    actions: [
                        "s3:ListBucket"
                    ],
                    resources: [
                        `arn:aws:s3:::${props.bucketName}`
                    ]
                }),

                // 📦 REQUIRED: read + write objects (upload, overwrite, delete)
                new iam.PolicyStatement({
                    actions: [
                        "s3:GetObject",
                        "s3:PutObject",
                        "s3:DeleteObject"
                    ],
                    resources: [
                        `arn:aws:s3:::${props.bucketName}/*`
                    ]
                }),

                // 🌐 REQUIRED: CloudFront cache invalidation
                new iam.PolicyStatement({
                    actions: [
                        "cloudfront:CreateInvalidation",
                        "cloudfront:GetDistribution"
                    ],
                    resources: ["*"]
                })
            ]
        });

        new cdk.CfnOutput(this, 'DeployPolicyArn', {
            value: deployPolicy.managedPolicyArn,
        });
    }
}