# at PRIVÉ deployment rules

Production URL: https://atinc.co.kr

When the user says:
- "우리 스크립터로 배포하자"
- "배포하자"
- "카페24 배포"
- "실서버 반영"
- "프로덕션 배포"

Do the following:
1. Finish the requested code changes.
2. Commit the intended changes to main.
3. Run ./deploy.sh
4. Wait for completion.
5. Report the deployed commit SHA and HTTPS result.

Do not ask the user for the Cafe24 password during normal deployment.
deploy.sh retrieves it from the macOS Keychain.

Do not use the GitHub-hosted Cafe24 deployment workflow.
Production deployment is performed from the local Mac.
