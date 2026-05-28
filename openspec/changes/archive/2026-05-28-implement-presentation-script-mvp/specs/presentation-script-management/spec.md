## ADDED Requirements

### Requirement: Script list display
The system SHALL display generated scripts in a list with summary information.

#### Scenario: Scripts exist
- **WHEN** at least one script exists
- **THEN** the list shows each script title, source summary, tone, duration, and status

#### Scenario: No scripts exist
- **WHEN** no scripts exist
- **THEN** the system displays an empty state explaining how to create the first script

### Requirement: Script status update
The system SHALL allow the user to update a script status among draft, review, and done.

#### Scenario: User changes script status
- **WHEN** the user activates a status change control for a script
- **THEN** the script status updates immediately in the preview and list

### Requirement: Script filtering
The system SHALL allow the user to filter scripts by status and support additional filtering by tone, duration, or search query when available.

#### Scenario: User filters scripts
- **WHEN** the user selects a filter condition
- **THEN** only scripts matching the condition are displayed

#### Scenario: Filter returns no results
- **WHEN** no scripts match the selected filter or search query
- **THEN** the system displays a no-results empty state

### Requirement: Script copy action
The system SHALL allow the user to copy generated script content.

#### Scenario: User copies script content
- **WHEN** the user activates the copy action for a generated script
- **THEN** the script content is copied to the clipboard and the system displays copy confirmation

### Requirement: Local persistence
The system SHALL persist generated scripts in localStorage when the browser environment supports it.

#### Scenario: User reloads the app
- **WHEN** the user reloads the app after generating scripts
- **THEN** previously saved scripts are loaded from localStorage and displayed

#### Scenario: localStorage is unavailable
- **WHEN** localStorage cannot be read
- **THEN** the system falls back to an empty script list without crashing
