## ADDED Requirements

### Requirement: README overview
The repository SHALL include a README that explains what the MVP does and who it is for.

#### Scenario: Reviewer opens the repository
- **WHEN** a reviewer opens the repository on GitHub
- **THEN** the README describes the presentation script generator MVP and its target user

### Requirement: README setup commands
The repository SHALL include README commands for installing dependencies, running the app locally, building, and running E2E tests.

#### Scenario: Developer runs the project locally
- **WHEN** a developer follows the README setup section
- **THEN** they can install dependencies, start the app, build it, and run tests

### Requirement: README scope and limitations
The repository SHALL document the implemented MVP scope and excluded features.

#### Scenario: Reviewer checks project scope
- **WHEN** a reviewer reads the README
- **THEN** they can distinguish implemented MVP features from future work

### Requirement: README deployment notes
The repository SHALL include deployment notes for hosting the Next.js app.

#### Scenario: Developer prepares deployment
- **WHEN** a developer reads the deployment section
- **THEN** they know the expected build command, output behavior, and environment variable status
