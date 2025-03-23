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
    hash: String,
    name: String,
    description: String,
    image_url: String,
    owner: Principal,
    metadata: HashMap<String, String>,
}

// State management
thread_local! {
    static NFTS: std::cell::RefCell<HashMap<String, NFT>> = std::cell::RefCell::new(HashMap::new());
    static OWNER_TO_NFTS: std::cell::RefCell<HashMap<Principal, Vec<String>>> = std::cell::RefCell::new(HashMap::new());
}

// Initialize the canister
#[init]
fn init() {
    // Counter no longer needed
}

// Save state before upgrade
#[pre_upgrade]
fn pre_upgrade() {
    let nfts = NFTS.with(|nfts| nfts.borrow().clone());
    let owner_to_nfts = OWNER_TO_NFTS.with(|map| map.borrow().clone());
    
    match stable_save((nfts, owner_to_nfts)) {
        Ok(_) => (),
        Err(e) => trap(&format!("Failed to save state before upgrade: {}", e)),
    }
}

// Restore state after upgrade
#[post_upgrade]
fn post_upgrade() {
    let (nfts, owner_to_nfts): (HashMap<String, NFT>, HashMap<Principal, Vec<String>>) = 
        match stable_restore() {
            Ok(state) => state,
            Err(e) => trap(&format!("Failed to restore state after upgrade: {}", e)),
        };
    
    NFTS.with(|n| *n.borrow_mut() = nfts);
    OWNER_TO_NFTS.with(|o| *o.borrow_mut() = owner_to_nfts);
}

// Mint a new NFT
#[update]
#[candid_method(update)]
fn mint_nft(hash: String, name: String, description: String, image_url: String, metadata: HashMap<String, String>) -> String {
    let caller = api::caller();
    
    // Check if an NFT with this hash already exists
    if nft_exists(hash.clone()) {
        trap(&format!("NFT with hash {} already exists", hash));
    }
    
    let nft = NFT {
        hash: hash.clone(),
        name,
        description,
        image_url,
        owner: caller,
        metadata,
    };
    
    // Store the NFT
    NFTS.with(|nfts| {
        nfts.borrow_mut().insert(hash.clone(), nft);
    });
    
    // Update owner's NFT collection
    OWNER_TO_NFTS.with(|owner_to_nfts| {
        let mut map = owner_to_nfts.borrow_mut();
        if let Some(nft_hashes) = map.get_mut(&caller) {
            nft_hashes.push(hash.clone());
        } else {
            map.insert(caller, vec![hash.clone()]);
        }
    });
    
    hash
}

// Get NFT details by hash
#[query]
#[candid_method(query)]
fn get_nft(hash: String) -> Option<NFT> {
    NFTS.with(|nfts| {
        nfts.borrow().get(&hash).cloned()
    })
}

// Get all NFTs owned by the caller
#[query]
#[candid_method(query)]
fn get_my_nfts() -> Vec<NFT> {
    let caller = api::caller();
    let mut result = Vec::new();
    
    OWNER_TO_NFTS.with(|owner_to_nfts| {
        if let Some(nft_hashes) = owner_to_nfts.borrow().get(&caller) {
            NFTS.with(|nfts| {
                let nfts_map = nfts.borrow();
                for hash in nft_hashes {
                    if let Some(nft) = nfts_map.get(hash) {
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
fn transfer_nft(hash: String, to: Principal) -> Result<(), String> {
    let caller = api::caller();
    
    NFTS.with(|nfts| {
        let mut nfts_map = nfts.borrow_mut();
        if let Some(nft) = nfts_map.get_mut(&hash) {
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
                    caller_nfts.retain(|nft_hash| nft_hash != &hash);
                }
                
                // Add to new owner
                if let Some(recipient_nfts) = map.get_mut(&to) {
                    recipient_nfts.push(hash.clone());
                } else {
                    map.insert(to, vec![hash.clone()]);
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
fn nft_exists(hash: String) -> bool {
    NFTS.with(|nfts| {
        nfts.borrow().contains_key(&hash)
    })
}

// Generate Candid interface
export_service!();

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    __export_service()
}