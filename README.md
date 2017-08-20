JSON SPEC VALIDATOR
=========

Validates a JSON against a given specification.

## Installation

  `npm install -D json-spec-validator`

## Usage

  let message = {};

  let oJSONValidator = new JSONValidator(loadedSpec);
  
  message = oJSONValidator.validate(parsedJSON);
