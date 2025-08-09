// Core constants and default dataset
export const STORAGE_KEY = 'connectionMatcherData';
export const THEME_KEY = 'connectionMatcherTheme';
export const SUGGESTION_KEY = 'connectionMatcherCustomTraits';

export const BUILTIN_TRAIT_SUGGESTIONS = [
  'Emotional Safety','Intellectual Stimulation','Humor Compatibility','Reliability / Consistency','Shared Goals / Values','Support in Challenges','Low Drama','Empathy','Mutual Respect','Shared Interests','Trustworthiness','Communication Quality','Active Listening','Growth Mindset','Conflict Resolution','Affection','Respect for Boundaries','Adaptability','Positivity','Integrity','Accountability','Kindness','Creativity','Curiosity','Financial Responsibility','Spontaneity','Physical Health Focus','Emotional Intelligence','Patience','Honesty','Playfulness','Generosity','Loyalty','Self Awareness'
];

export const defaultData = {
  ideal: {
    'Emotional Safety': 5,
    'Intellectual Stimulation': 5,
    'Humor Compatibility': 1,
    'Reliability / Consistency': 3,
    'Shared Goals / Values': 4,
    'Support in Challenges': 4.6,
    'Low Drama': 4,
    'Empathy': 5,
    'Mutual Respect': 5,
    'Shared Interests': 3
  },
  people: [
    {
      name: 'Person 1',
      traits: {
        'Emotional Safety': 5,
        'Intellectual Stimulation': 2,
        'Humor Compatibility': 1,
        'Reliability / Consistency': 2,
        'Shared Goals / Values': 3,
        'Support in Challenges': 0,
        'Low Drama': 3.5,
        'Empathy': 1,
        'Mutual Respect': 4,
        'Shared Interests': 3
      }
    },
    {
      name: 'Person 2',
      traits: {
        'Emotional Safety': 3,
        'Intellectual Stimulation': 2,
        'Humor Compatibility': 4,
        'Reliability / Consistency': 3,
        'Shared Goals / Values': 1,
        'Support in Challenges': 4,
        'Low Drama': 3,
        'Empathy': 5,
        'Mutual Respect': 4,
        'Shared Interests': 3
      }
    }
  ]
};
