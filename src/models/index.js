// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ScaleType = {
  "MULTIPLY": "MULTIPLY",
  "ADDITION": "ADDITION"
};

const Period = {
  "SEASONLY": "SEASONLY",
  "MONTHLY": "MONTHLY",
  "WEEKLY": "WEEKLY",
  "DAILY": "DAILY",
  "ANYTIME": "ANYTIME"
};

const RiderLevels = {
  "DOUBLEBLACK": "DOUBLEBLACK",
  "BLACK": "BLACK",
  "BLUE": "BLUE",
  "GREEN": "GREEN"
};

const { Season, EarnedPoint, RuleScaling, Rider, Rule } = initSchema(schema);

export {
  Season,
  EarnedPoint,
  RuleScaling,
  Rider,
  Rule,
  ScaleType,
  Period,
  RiderLevels
};