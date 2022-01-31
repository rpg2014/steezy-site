import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum ScaleType {
  MULTIPLY = "MULTIPLY",
  ADDITION = "ADDITION"
}

export enum Period {
  SEASONLY = "SEASONLY",
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY",
  DAILY = "DAILY",
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

type RuleScalingMetaData = {
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
  readonly EarnedRules?: (EarnedPoint | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Season, SeasonMetaData>);
  static copyOf(source: Season, mutator: (draft: MutableModel<Season, SeasonMetaData>) => MutableModel<Season, SeasonMetaData> | void): Season;
}

export declare class EarnedPoint {
  readonly id: string;
  readonly riderID: string;
  readonly ruleID: string;
  readonly date: string;
  readonly seasonID: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<EarnedPoint, EarnedPointMetaData>);
  static copyOf(source: EarnedPoint, mutator: (draft: MutableModel<EarnedPoint, EarnedPointMetaData>) => MutableModel<EarnedPoint, EarnedPointMetaData> | void): EarnedPoint;
}

export declare class RuleScaling {
  readonly id: string;
  readonly scaleType: ScaleType | keyof typeof ScaleType;
  readonly green: number;
  readonly blue: number;
  readonly black: number;
  readonly doubleBlack: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<RuleScaling, RuleScalingMetaData>);
  static copyOf(source: RuleScaling, mutator: (draft: MutableModel<RuleScaling, RuleScalingMetaData>) => MutableModel<RuleScaling, RuleScalingMetaData> | void): RuleScaling;
}

export declare class Rider {
  readonly id: string;
  readonly name: string;
  readonly riderLevel: RiderLevels | keyof typeof RiderLevels;
  readonly earnedPoints?: (EarnedPoint | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Rider, RiderMetaData>);
  static copyOf(source: Rider, mutator: (draft: MutableModel<Rider, RiderMetaData>) => MutableModel<Rider, RiderMetaData> | void): Rider;
}

export declare class Rule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly period: Period | keyof typeof Period;
  readonly basePoints: number;
  readonly earnedPoints?: (EarnedPoint | null)[];
  readonly RuleScaling: RuleScaling;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly ruleRuleScalingId: string;
  constructor(init: ModelInit<Rule, RuleMetaData>);
  static copyOf(source: Rule, mutator: (draft: MutableModel<Rule, RuleMetaData>) => MutableModel<Rule, RuleMetaData> | void): Rule;
}