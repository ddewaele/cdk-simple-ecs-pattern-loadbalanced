import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

interface CdkSimpleEcsPatternLoadbalancedStackProps extends cdk.StackProps {
  setupDomain?: boolean;
}

export class CdkSimpleEcsPatternLoadbalancedStack extends cdk.Stack {
  public readonly vpc: cdk.aws_ec2.Vpc;
  
  constructor(scope: Construct, id: string, props: CdkSimpleEcsPatternLoadbalancedStackProps) {
    super(scope, id, props);


    // Create a VPC
    this.vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2, natGateways: 1 });

    // Create the Cluster with a capacity (creates an ASG)
    const cluster = new ecs.Cluster(this, 'MyCluster', {
      capacity: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.NANO),
        maxCapacity: 2,
        minCapacity: 0
      },
      vpc: this.vpc,
    });

    // Create the capacity Provider based on the ASG
    const capacityProvider = new ecs.AsgCapacityProvider(this, 'MyCapacityProvider', {
      autoScalingGroup: cluster.autoscalingGroup!,
    });
    
    // Add the Capacity Provider to the Cluster
    cluster.addAsgCapacityProvider(capacityProvider);

    // Define variables for conditional resources
    let certificate = undefined;
    let domainName = undefined;
    let domainZone = undefined;

    if (props.setupDomain) {

      // The ARN of your ACM certificate
      const certificateArn = 'arn:aws:acm:eu-central-1:949508759827:certificate/5a7bb543-e93e-4bfc-9f21-c57ab3dac8a8';
      certificate = acm.Certificate.fromCertificateArn(this, 'MyCertificate', certificateArn);

      // Define domain name and domain zone
      domainName = 'nginx-demo.my-tst-playground.com';
      domainZone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: 'my-tst-playground.com' });
    }


    // Create the ECS service
    const ecsService = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'MyService', {
      cluster,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('nginxdemos/hello'),
      },
      memoryLimitMiB: 128,
      capacityProviderStrategies: [{
        capacityProvider: capacityProvider.capacityProviderName,
        weight: 1,
      }],
      circuitBreaker: { rollback: true },
      certificate: certificate,
      domainName: domainName,
      domainZone: domainZone
    });



  }
}
