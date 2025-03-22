use candid::{CandidType, Deserialize, Principal};
use ic_cdk::{
    api::{self, trap},
    export::{
        candid::{candid_method, export_service},
    },
    storage::{stable_save, stable_restore},
};
use ic_cdk_macros::*;
use std::collections::HashMap;
use std::string::String;

// Define the NFT structure
#[derive(CandidType, Deserialize, Clone)]
struct NFT {
    id: u64,
    name: String,
    description: String,
    image_url: String,
    owner: Principal,
    metadata: HashMap<String, String>,
}

// State management
thread_local! {
    static NFT_COUNTER: std::cell::RefCell<u64> = std::cell::RefCell::new(0);
    static NFTS: std::cell::RefCell<HashMap<u64, NFT>> = std::cell::RefCell::new(HashMap::new());
    static OWNER_TO_NFTS: std::cell::RefCell<HashMap<Principal, Vec<u64>>> = std::cell::RefCell::new(HashMap::new());
}

// Initialize the canister
#[init]
fn init() {
    NFT_COUNTER.with(|counter| {
        *counter.borrow_mut() = 0;
    });
}

// Save state before upgrade
#[pre_upgrade]
fn pre_upgrade() {
    let counter = NFT_COUNTER.with(|counter| *counter.borrow());
    let nfts = NFTS.with(|nfts| nfts.borrow().clone());
    let owner_to_nfts = OWNER_TO_NFTS.with(|map| map.borrow().clone());
    
    match stable_save((counter, nfts, owner_to_nfts)) {
        Ok(_) => (),
        Err(e) => trap(&format!("Failed to save state before upgrade: {}", e)),
    }
}

// Restore state after upgrade
#[post_upgrade]
fn post_upgrade() {
    let (counter, nfts, owner_to_nfts): (u64, HashMap<u64, NFT>, HashMap<Principal, Vec<u64>>) = 
        match stable_restore() {
            Ok(state) => state,
            Err(e) => trap(&format!("Failed to restore state after upgrade: {}", e)),
        };
    
    NFT_COUNTER.with(|c| *c.borrow_mut() = counter);
    NFTS.with(|n| *n.borrow_mut() = nfts);
    OWNER_TO_NFTS.with(|o| *o.borrow_mut() = owner_to_nfts);
}

// Mint a new NFT
#[update]
#[candid_method(update)]
fn mint_nft(name: String, description: String, image_url: String, metadata: HashMap<String, String>) -> u64 {
    let caller = api::caller();
    
    NFT_COUNTER.with(|counter| {
        let id = *counter.borrow();
        let new_id = id + 1;
        *counter.borrow_mut() = new_id;
        
        let nft = NFT {
            id,
            name,
            description,
            image_url,
            owner: caller,
            metadata,
        };
        
        // Store the NFT
        NFTS.with(|nfts| {
            nfts.borrow_mut().insert(id, nft);
        });
        
        // Update owner's NFT collection
        OWNER_TO_NFTS.with(|owner_to_nfts| {
            let mut map = owner_to_nfts.borrow_mut();
            if let Some(nft_ids) = map.get_mut(&caller) {
                nft_ids.push(id);
            } else {
                map.insert(caller, vec![id]);
            }
        });
        
        id
    })
}

// Get NFT details by ID
#[query]
#[candid_method(query)]
fn get_nft(id: u64) -> Option<NFT> {
    NFTS.with(|nfts| {
        nfts.borrow().get(&id).cloned()
    })
}

// Get all NFTs owned by the caller
#[query]
#[candid_method(query)]
fn get_my_nfts() -> Vec<NFT> {
    let caller = api::caller();
    let mut result = Vec::new();
    
    OWNER_TO_NFTS.with(|owner_to_nfts| {
        if let Some(nft_ids) = owner_to_nfts.borrow().get(&caller) {
            NFTS.with(|nfts| {
                let nfts_map = nfts.borrow();
                for id in nft_ids {
                    if let Some(nft) = nfts_map.get(id) {
                        result.push(nft.clone());
                    }
                }
            });
        }
    });
    
    result
}

// Transfer an NFT to another principal
#[update]
#[candid_method(update)]
fn transfer_nft(id: u64, to: Principal) -> Result<(), String> {
    let caller = api::caller();
    
    NFTS.with(|nfts| {
        let mut nfts_map = nfts.borrow_mut();
        if let Some(nft) = nfts_map.get_mut(&id) {
            if nft.owner != caller {
                return Err("You don't own this NFT".to_string());
            }
            
            // Update NFT owner
            nft.owner = to;
            
            // Update owner mappings
            OWNER_TO_NFTS.with(|owner_to_nfts| {
                let mut map = owner_to_nfts.borrow_mut();
                
                // Remove from current owner
                if let Some(caller_nfts) = map.get_mut(&caller) {
                    caller_nfts.retain(|&nft_id| nft_id != id);
                }
                
                // Add to new owner
                if let Some(recipient_nfts) = map.get_mut(&to) {
                    recipient_nfts.push(id);
                } else {
                    map.insert(to, vec![id]);
                }
            });
            
            Ok(())
        } else {
            Err("NFT not found".to_string())
        }
    })
}

// Get all NFTs in the canister
#[query]
#[candid_method(query)]
fn get_all_nfts() -> Vec<NFT> {
    NFTS.with(|nfts| {
        nfts.borrow().values().cloned().collect()
    })
}

// Check if an NFT exists
#[query]
#[candid_method(query)]
fn nft_exists(id: u64) -> bool {
    NFTS.with(|nfts| {
        nfts.borrow().contains_key(&id)
    })
}

// Generate Candid interface
export_service!();

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    __export_service()
}