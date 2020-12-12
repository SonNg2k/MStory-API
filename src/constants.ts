export const SORT_ORDER = ["asc", "desc"] as const

export const STORY_STATUS = ['unstarted', 'finished', 'delivered', 'accepted', 'rejected'] as const
export const STORY_TYPES = ['feature', 'bug', 'chore'] as const

export const PROJECT_ROLES = ['owner', 'guest', 'reporter', 'developer', 'maintainer'] as const

// REGEX constants
export const REGEX_DIGITS_ONLY = /^[0-9]+$/
export const REGEX_LETTERS_SPACES_ONLY = /^([a-zA-Z]+\s)*[a-zA-Z]+$/ // can start or end only with a letter + no consecutive spaces
export const REGEX_GITHUB_USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
export const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s-@#$!%^&*+=_/`?{}|'"]+(\.[^<>()\[\]\\.,;:\s-@_!#$%^&*()=+/`?{}|'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
