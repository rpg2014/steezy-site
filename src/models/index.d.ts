import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Frequency {
  SEASON = "SEASON",
  MONTH = "MONTH",
  WEEK = "WEEK",
  DAY = "DAY",
  ANYTIME = "ANYTIME"
}

export enum RiderLevels {
  DOUBLEBLACK = "DOUBLEBLACK",
  BLACK = "BLACK",
  BLUE = "BLUE",
  GREEN = "GREEN"
}



type SeasonMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EarnedPointMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RiderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RuleMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Season {
  readonly id: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly EarnedRules?: (EarnedPoint | null)[] | null;
  readonly name: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Season, SeasonMetaData>);
  static copyOf(source: Season, mutator: (draft: MutableModel<Season, SeasonMetaData>) => MutableModel<Season, SeasonMetaData> | void): Season;
}

export declare class EarnedPoint {
  readonly id: string;
  readonly riderID: string;
  readonly ruleID: string;
  readonly date: string;
  readonly seasonID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<EarnedPoint, EarnedPointMetaData>);
  static copyOf(source: EarnedPoint, mutator: (draft: MutableModel<EarnedPoint, EarnedPointMetaData>) => MutableModel<EarnedPoint, EarnedPointMetaData> | void): EarnedPoint;
}

export declare class Rider {
  readonly id: string;
  readonly name: string;
  readonly riderLevel: RiderLevels | keyof typeof RiderLevels;
  readonly earnedPoints?: (EarnedPoint | null)[] | null;
  readonly cognitoId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Rider, RiderMetaData>);
  static copyOf(source: Rider, mutator: (draft: MutableModel<Rider, RiderMetaData>) => MutableModel<Rider, RiderMetaData> | void): Rider;
}

export declare class Rule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly frequency: Frequency | keyof typeof Frequency;
  readonly earnedPoints?: (EarnedPoint | null)[] | null;
  readonly levelPointsMap: string;
  readonly lastEditedBy?: Rider | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly ruleLastEditedById?: string | null;
  constructor(init: ModelInit<Rule, RuleMetaData>);
  static copyOf(source: Rule, mutator: (draft: MutableModel<Rule, RuleMetaData>) => MutableModel<Rule, RuleMetaData> | void): Rule;
}