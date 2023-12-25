# README for CDK Simple ECS Pattern Loadbalanced Stack

## Overview

This CDK (Cloud Development Kit) project provisions a simple, load-balanced ECS (Elastic Container Service) deployment in AWS. The project is structured using AWS CDK in TypeScript and sets up the necessary AWS resources for running a containerized application with high availability and scalability.

## Prerequisites

Before deploying this stack, ensure you have the following:

- AWS CLI installed and configured with appropriate credentials.
- Node.js and npm installed.
- AWS CDK installed (`npm install -g aws-cdk`).

## Key Components

- **VPC (Virtual Private Cloud)**: Creates a new VPC with a specified number of Availability Zones and NAT Gateways.
- **ECS Cluster**: A cluster with specified capacity in terms of instance type and size, and autoscaling configuration.
- **AsgCapacityProvider**: An autoscaling group capacity provider for the ECS cluster.
- **Optional Domain Setup**: If `setupDomain` is set to true, the stack will include ACM certificate and Route 53 domain configurations.
- **ECS Service**: Deploys an ECS service in the ECS Cluster, running on EC2 instances


```
+-------------------------------------------------+
|                    AWS Cloud                    |
|                                                 |
|  +-----------------+                            |
|  |                 |                            |
|  |   ECS Cluster   |                            |
|  |                 |                            |
|  +--------+--------+                            |
|           |                                     |
|           |                                     |
|  +--------v--------+   +---------------------+  |
|  |                 |   |                     |  |
|  |   ECS Service   +--->  Application Load   |  |
|  |                 |   |  Balancer           |  |
|  +--------+--------+   +----------+----------+  |
|           |                        |            |
|           |                        |            |
|  +--------v--------+               |            |
|  |                 |               |            |
|  |   EC2 Instances |               |            |
|  |                 |               |            |
|  +--------+--------+               |            |
|           |                        |            |
|  +--------v--------+               |            |
|  |                 |               |            |
|  |      ASG        |               |            |
|  | (Auto Scaling   |               |            |
|  |  Group)         |               |            |
|  |                 |               |            |
|  +--------+--------+               |            |
|           |                        |            |
|  +--------v--------+               |            |
|  |                 |               |            |
|  | Capacity        +<--------------+            |
|  | Provider        |                            |
|  |                 |                            |
|  +--------+--------+                            |
|           |                                     |
|           |                                     |
|  +--------v--------+                            |
|  |                 |                            |
|  |    VPC          |                            |
|  |                 |                            |
|  +--------+--------+                            |
|           |                                     |
|           |                                     |
|  +--------v--------+                            |
|  |                 |                            |
|  |  Route 53       |                            |
|  |                 |                            |
|  +--------+--------+                            |
|           |                                     |
|           |                                     |
|  +--------v--------+                            |
|  |                 |                            |
|  |  ACM Certificate|                            |
|  |                 |                            |
|  +-----------------+                            |
|                                                 |
+-------------------------------------------------+

```

## Usage

1. **Clone the Repository**: Clone or download the project repository to your local environment.

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies:
   ```
   npm install
   ```

3. **Synthesize the CDK Stack**: Generate the AWS CloudFormation template for the stack:
   ```
   cdk synth
   ```

4. **Deploy the Stack**: Deploy the stack to your AWS account:
   ```
   cdk deploy
   ```

## Customization

- **VPC Configuration**: Modify the VPC settings in the `ec2.Vpc` constructor as needed.
- **Cluster Capacity**: Adjust the ECS cluster capacity by changing the `instanceType`, `maxCapacity`, and `minCapacity` properties.
- **Domain Setup**: To enable domain setup, pass `setupDomain: true` in the stack properties and adjust the domain name and certificate ARN as needed.

## Cleanup

To avoid incurring future charges, remember to delete the stack:
```
cdk destroy
```

## Note

This README provides a basic guide. For more advanced configurations and AWS CDK usage, refer to the [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html).
## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
