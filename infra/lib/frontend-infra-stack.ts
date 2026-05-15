import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";
import type { Props } from "./types";

export class FrontendInfraStack extends cdk.Stack {
	public readonly bucket: s3.Bucket;
	public readonly distribution: cloudfront.Distribution;

	constructor(scope: Construct, id: string, props: Props) {
		super(scope, id, props);

		// 🪣 Private S3 bucket (NO public access)
		this.bucket = new s3.Bucket(this, `${id}-bucket`, {
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			removalPolicy: cdk.RemovalPolicy.RETAIN,
		});

		// 🔐 ACM certificate (must be us-east-1 for CloudFront)
		const certificate = acm.Certificate.fromCertificateArn(
			this,
			"Cert",
			props.certificateArn,
		);

		// 🌍 CloudFront (modern OAC setup)
		this.distribution = new cloudfront.Distribution(this, `${id}-cdn`, {
			defaultRootObject: "index.html",
			domainNames: [props.customDomainName],

			certificate,

			defaultBehavior: {
				origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
				viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			},

			// 🧠 SPA routing support (important for Vite/React) - remove comments if needed
			//   errorResponses: [
			//     {
			//       httpStatus: 404,
			//       responseHttpStatus: 200,
			//       responsePagePath: '/index.html',
			//     },
			//   ],
		});

		new cdk.CfnOutput(this, "BucketName", {
			value: this.bucket.bucketName,
		});

		new cdk.CfnOutput(this, "DistributionId", {
			value: this.distribution.distributionId,
		});

		new cdk.CfnOutput(this, "CloudFrontURL", {
			value: this.distribution.distributionDomainName,
		});

		new cdk.CfnOutput(this, "CustomDomain", {
			value: `https://${props.customDomainName}`,
		});
	}
}
