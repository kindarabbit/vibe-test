# presentation-script-generation Specification

## Purpose
TBD - created by archiving change implement-presentation-script-mvp. Update Purpose after archive.
## Requirements
### Requirement: Script source input
The system SHALL allow the user to enter a presentation title and source text containing PPT content or presentation keywords.

#### Scenario: User enters required script inputs
- **WHEN** the user provides a non-empty title and non-empty source text
- **THEN** the system accepts the inputs for script generation

#### Scenario: User omits required script inputs
- **WHEN** the user attempts to generate a script without a title or source text
- **THEN** the system displays a validation message and does not create a script

### Requirement: Tone selection
The system SHALL allow the user to choose one presentation tone from natural, formal, and friendly.

#### Scenario: User selects a tone
- **WHEN** the user selects a tone option
- **THEN** the selected tone is used for the generated script and shown in the UI

### Requirement: Duration selection
The system SHALL allow the user to choose one presentation duration from 5, 10, and 15 minutes.

#### Scenario: User selects a duration
- **WHEN** the user selects a duration option
- **THEN** the selected duration is used for the generated script and shown in the UI

### Requirement: Mock script generation
The system SHALL generate a presentation script from the title, source text, selected tone, and selected duration without requiring an external AI API.

#### Scenario: User generates a script
- **WHEN** the user submits valid title, source text, tone, and duration values
- **THEN** the system creates a new script with title, source text, tone, duration, draft status, generated content, creation time, and update time

### Requirement: Script preview
The system SHALL display the most recently generated or selected script in a preview area.

#### Scenario: Generated script appears in preview
- **WHEN** a script is generated or selected
- **THEN** the preview area shows the script title, tone, duration, status, and content

