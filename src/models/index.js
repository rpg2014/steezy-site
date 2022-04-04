// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Frequency = {
  "SEASON": "SEASON",
  "MONTH": "MONTH",
  "WEEK": "WEEK",
  "DAY": "DAY",
  "ANYTIME": "ANYTIME"
};

const RiderLevels = {
  "DOUBLEBLACK": "DOUBLEBLACK",
  "BLACK": "BLACK",
  "BLUE": "BLUE",
  "GREEN": "GREEN"
};

const { Season, EarnedPoint, Rider, Rule } = initSchema(schema);

export {
  Season,
  EarnedPoint,
  Rider,
  Rule,
  Frequency,
  RiderLevels
};