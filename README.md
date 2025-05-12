# EE 547 – Applied & Cloud Computing Final Report
## Project: Intelligent Email Classification & Notification System


Member: 

- Yicheng Yang: [Github](https://github.com/mark-yyc)
- Yiheng Zhou: [Github](https://github.com/unswimmingduck)
- Yibing Liu: [Github](https://github.com/Young884)]

### Problem:
+ Too many emails & manually classifying is time consuming
+ Important messages may get lost in inbox
### Our Solution:
Cloud-based system that classifies emails intelligently using LLM + rules
Users define categories & prompt rules
Frontend dashboard to view, filter, and manage email categories

### File Structure
/backend: Backend for user interaction.
/classifier: SQS consumer, automatic email classification.
/frontend: GUI (React 18).
/doc: SQL schema and API design.
/lambda: lambda function.

### Build and run
CI/CD: Github Actions
Trigger: on push branches: main
Jobs: 
+ Docker build and docker push
+ login to ec2 using ssh
+ docker compose


