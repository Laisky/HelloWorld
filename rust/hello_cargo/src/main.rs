fn main() {
    println!("Hello, world!");

    test_for();
    test_owner();
    test_struct();
}

fn test_for() {
    for number in (1..4).rev() {
        println!("{number}");  // 3 2 1
    }
}

fn test_owner() {
    let s1 = String::from("hello");

    let (s1, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len(); // len() 返回字符串的长度

    (s, length)
}

#[derive(Debug)]
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

impl User {
    fn method(&self) -> &String {
        &self.username
    }
}

fn test_struct() {
    let user1 = User{
        active: true,
        username: String::from("123"),
        email: String::from("123"),
        sign_in_count: 213,
    };

    let user2  = User {
        username: String::from("user2 name"),
        email: String::from("user2 email"),
        ..user1
    };

    println!("user1 email: {}", user1.email);
    println!("user2 email: {:#?}", user2);
    println!("user2 name: {}", user2.method());
}
