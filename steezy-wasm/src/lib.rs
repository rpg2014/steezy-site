mod utils;
use  std::collections::HashMap;
use serde::{Serialize, Deserialize};
use serde_wasm_bindgen;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// https://rustwasm.github.io/docs/wasm-bindgen/reference/arbitrary-data-with-serde.html

struct InternalState {
    pub seasons: Vec<Season>,
    pub ruleMap: HashMap<String, Rule>,
    pub rule_scalingsM: HashMap< String, RuleScaling>

}

#[wasm_bindgen]
pub struct CalcuationEngine {
    internalState: InternalState,
}


#[derive(Serialize, Deserialize)]
pub struct Season {
    pub id: String,
    pub start_date: String,
    pub end_date: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Rule{
    pub id: String,
    pub base_points: f64,
    pub rule_scaling_id: String
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum ScaleType {
    MULTIPLY,
    ADDITION,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RuleScaling {
    pub id: String,
    pub scale_type: ScaleType,
    pub green: f64,
    pub blue: f64,
    pub black: f64,
    pub double_black: f64,
}

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
impl CalcuationEngine {
    pub fn new(
        rules: Vec<JsValue>,
        rule_scalings: Vec<JsValue>,
        seasons: Vec<JsValue>
    ) -> CalcuationEngine {


        CalcuationEngine {
            internalState: InternalState::new(rules, rule_scalings, seasons)
        }
    }


    pub fn get_rule_ids(&self) -> Result<Vec<JsValue>,JsError> {
        let mut rule_ids = Vec::new();
        for (id, _rule) in self.internalState.ruleMap.iter() {
            rule_ids.push(serde_wasm_bindgen::to_value(&id).unwrap());
        };
        Ok(rule_ids)
    }
}



impl InternalState {
    pub fn new(
        rules: Vec<JsValue>,
        rule_scalings: Vec<JsValue>,
        seasons: Vec<JsValue>
    )-> InternalState {
        
        let mut ruleMap: HashMap<String, Rule> = HashMap::new();
        for rule in rules.iter() {
            let ruleParsed: Rule = serde_wasm_bindgen::from_value(rule.to_owned()).unwrap();
            ruleMap.insert(ruleParsed.id.clone(), ruleParsed);
        };
        
        let mut scalingMap: HashMap<String, RuleScaling> = HashMap::new();
        for rs in rule_scalings.iter(){
            let rule_scaling: RuleScaling = serde_wasm_bindgen::from_value(rs.to_owned()).unwrap();
            scalingMap.insert(rule_scaling.id.clone(), rule_scaling);
        };
        
        let mut seasonList: Vec<Season> = Vec::new();
        for s in seasons.iter() {
            let season: Season = serde_wasm_bindgen::from_value(s.to_owned()).unwrap();
            seasonList.push(season);
        };

        InternalState {
            ruleMap,
            rule_scalingsM: scalingMap,
            seasons: seasonList
        }
    }


    
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, steezy-wasm!");
}



