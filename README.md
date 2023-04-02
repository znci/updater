Updater

znci Updater and Version Checker

Reads all znci repositories and checks every .znci file and finds the version and logs them to the console.

Useless for now.
The Format
Example

NAME="project name"
DESCRIPTION="project description
VERSION="v.1.0.0"

PROJECT_LEAD="project lead username"
CONTRIBUTORS=["contributor 1", "contributor 2"]
INTERNAL_VERSION=1

Keys

NAME - Name of the project/repository

DESCRIPTION - Short description of what the project does

VERSION - Semantic version of the project

PROJECT_LEAD - GitHub username of the project lead responsible

CONTRIBUTORS - Array list of GitHub usernames of cintributors to the project

INTERNAL_VERSION - Internal version of the project
Other Details

    Version can be omitted if it's not a project meant to be used by anything directly (for example, updater).
    The contributors key can be omitted if the project lead is the only one contributing to the project
    The project's internal version increments by 1 every time a new version is released.
