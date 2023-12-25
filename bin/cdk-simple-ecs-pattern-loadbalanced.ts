#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkSimpleEcsPatternLoadbalancedStack } from '../lib/cdk-simple-ecs-pattern-loadbalanced-stack';
import { CdkSimpleEcsPatternBastionStack } from '../lib/cdk-simple-ecs-pattern-bastion';

const app = new cdk.App();

const cdkSimpleEcsPatternLoadbalancedStack = new CdkSimpleEcsPatternLoadbalancedStack(app, 'CdkSimpleEcsPatternLoadbalancedStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION    
}})


// Uncomment this if you also want a bastion host in the VPC

// new CdkSimpleEcsPatternBastionStack(app ,'cdkSimpleEcsPatternBastionStack', cdkSimpleEcsPatternLoadbalancedStack.vpc, {
//   env: {
//     account: process.env.CDK_DEFAULT_ACCOUNT, 
//     region: process.env.CDK_DEFAULT_REGION    
// }})
