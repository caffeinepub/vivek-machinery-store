import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Product Type and Comparison
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageUrl : Text;
    available : Bool;
    stock : Nat;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  type ProductInput = {
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    imageUrl : Text;
    available : Bool;
    stock : Nat;
  };

  // Cart Item Type and Comparison
  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  module CartItem {
    public func compare(cartItem1 : CartItem, cartItem2 : CartItem) : Order.Order {
      Nat.compare(cartItem1.productId, cartItem2.productId);
    };
  };

  // Cart Type
  type Cart = {
    items : [CartItem];
    totalPrice : Nat;
  };

  // Inquiry Type and Comparison
  type Inquiry = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    productId : ?Nat;
    resolved : Bool;
  };

  module Inquiry {
    public func compare(inquiry1 : Inquiry, inquiry2 : Inquiry) : Order.Order {
      Nat.compare(inquiry1.id, inquiry2.id);
    };
  };

  type InquiryInput = {
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    productId : ?Nat;
  };

  // Category Type
  type Category = Text;

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // State Variables
  var nextProductId = 1;
  var nextInquiryId = 1;

  let products = Map.empty<Nat, Product>();
  var categories = List.fromArray(["Power Tools", "Agricultural Equipment", "Construction Machinery", "Industrial Equipment", "Spare Parts"]);
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let inquiries = Map.empty<Nat, Inquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Methods
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management Methods
  public shared ({ caller }) func createProduct(productInput : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let product : Product = {
      id = nextProductId;
      name = productInput.name;
      description = productInput.description;
      price = productInput.price;
      category = productInput.category;
      imageUrl = productInput.imageUrl;
      available = productInput.available;
      stock = productInput.stock;
    };

    products.add(nextProductId, product);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(productId : Nat, productInput : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id = productId;
          name = productInput.name;
          description = productInput.description;
          price = productInput.price;
          category = productInput.category;
          imageUrl = productInput.imageUrl;
          available = productInput.available;
          stock = productInput.stock;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.remove(productId);
      };
    };
  };

  public query func getProduct(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func filterProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) { product.category == category }
    );
    filtered;
  };

  public query func searchProductsByName(searchTerm : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text(searchTerm.toLower()));
      }
    );
    filtered;
  };

  // Category Management Methods
  public shared ({ caller }) func addCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add categories");
    };

    let existing = categories.toArray().find(func(c : Text) : Bool { c == category });
    switch (existing) {
      case (?_) { Runtime.trap("Category already exists") };
      case (null) {
        let newCategories = categories.toArray().concat([category]);
        categories := List.fromArray(newCategories);
      };
    };
  };

  public shared ({ caller }) func removeCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove categories");
    };

    let existing = categories.toArray().find(func(c : Text) : Bool { c == category });
    switch (existing) {
      case (?_) {
        categories := List.fromArray<Text>(categories.toArray().filter(func(c : Text) : Bool { c != category }));
      };
      case (null) { Runtime.trap("Category not found") };
    };
  };

  public query func listCategories() : async [Category] {
    categories.toArray();
  };

  // Shopping Cart Methods
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };

    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };

    if (quantity == 0 or quantity > product.stock) {
      Runtime.trap("Invalid quantity");
    };

    let cartItems = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?items) { items };
    };

    let existingItem = cartItems.toArray().find(func(item : CartItem) : Bool { item.productId == productId });
    switch (existingItem) {
      case (?item) {
        let updatedItems = cartItems.toArray().map(
          func(i : CartItem) : CartItem {
            if (i.productId == productId) {
              { productId = i.productId; quantity = i.quantity + quantity };
            } else {
              i;
            };
          }
        );
        carts.add(caller, List.fromArray<CartItem>(updatedItems));
      };
      case (null) {
        let newItem : CartItem = { productId = productId; quantity };
        let updatedCart = cartItems.toArray().concat([newItem]);
        carts.add(caller, List.fromArray<CartItem>(updatedCart));
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };

    let cartItems = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?items) { items };
    };

    let filteredItems = cartItems.toArray().filter(
      func(item : CartItem) : Bool { item.productId != productId }
    );
    carts.add(caller, List.fromArray<CartItem>(filteredItems));
  };

  public query ({ caller }) func viewCart() : async Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };

    switch (carts.get(caller)) {
      case (null) {
        {
          items = [];
          totalPrice = 0;
        };
      };
      case (?cartItems) {
        var totalPrice = 0;
        let items = cartItems.toArray().map(
          func(item : CartItem) : CartItem {
            let product = products.get(item.productId);
            switch (product) {
              case (?p) {
                totalPrice += (p.price * item.quantity);
              };
              case (null) {};
            };
            item;
          }
        );
        {
          items;
          totalPrice;
        };
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };

    carts.remove(caller);
  };

  // Inquiry Methods
  public shared ({ caller }) func submitInquiry(inquiryInput : InquiryInput) : async () {
    let inquiry : Inquiry = {
      id = nextInquiryId;
      name = inquiryInput.name;
      email = inquiryInput.email;
      phone = inquiryInput.phone;
      message = inquiryInput.message;
      productId = inquiryInput.productId;
      resolved = false;
    };

    inquiries.add(nextInquiryId, inquiry);
    nextInquiryId += 1;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };

    inquiries.values().toArray().sort();
  };

  public shared ({ caller }) func markInquiryResolved(inquiryId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark inquiries as resolved");
    };

    switch (inquiries.get(inquiryId)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) {
        let updatedInquiry : Inquiry = {
          id = inquiryId;
          name = inquiry.name;
          email = inquiry.email;
          phone = inquiry.phone;
          message = inquiry.message;
          productId = inquiry.productId;
          resolved = true;
        };
        inquiries.add(inquiryId, updatedInquiry);
      };
    };
  };
};
