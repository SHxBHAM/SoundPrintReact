import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor UserAuth {
    // Define our User type
    private type User = {
        username: Text;
        password: Text;
    };

    // Create a stable variable to persist data across upgrades
    private stable var userEntries : [(Text, User)] = [];

    // Initialize our HashMap
    private var users = HashMap.HashMap<Text, User>(0, Text.equal, Text.hash);

    // System init - recover data from stable storage
    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter<Text, User>(userEntries.vals(), 0, Text.equal, Text.hash);
    };

    // Create a new user
    public shared func register(username: Text, password: Text) : async Result.Result<Text, Text> {
        // Check if username already exists
        switch (users.get(username)) {
            case (?existing) {
                #err("Username already exists")
            };
            case null {
                let newUser : User = {
                    username = username;
                    password = password;
                };

                users.put(username, newUser);
                #ok("User registered successfully")
            };
        }
    };

    // Query to check if user exists (for testing purposes)
    public query func getUser(username: Text) : async ?User {
        users.get(username)
    };
}
