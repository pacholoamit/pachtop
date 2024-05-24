use std::collections::HashMap;

#[derive(Debug, Default)]
pub struct TrieNode {
    pub children: HashMap<String, TrieNode>,
    pub is_end_of_path: bool,
}

#[derive(Debug, Default)]
pub struct Trie {
    pub root: TrieNode,
}

impl Trie {
    pub fn insert(&mut self, path: &str) {
        let mut node = &mut self.root; // Use mutable reference here
        let parts = path.split('/').filter(|s| !s.is_empty()); // Filter out empty strings caused by leading/trailing slashes

        for part in parts {
            node = node.children.entry(part.to_string()).or_default();
        }
        node.is_end_of_path = true; // Mark the end of the path
    }

    pub fn search(&self, path: &str) -> bool {
        let mut node = &self.root; // Use immutable reference here
        let parts = path.split('/').filter(|s| !s.is_empty()); // Filter out empty strings caused by leading/trailing slashes

        for part in parts {
            if let Some(next_node) = node.children.get(part) {
                node = next_node;
            } else {
                return false;
            }
        }
        node.is_end_of_path
    }

    pub fn show(&self, prefix: String) {
        fn show_recursive(node: &TrieNode, prefix: String) {
            for (key, child) in &node.children {
                let new_prefix = format!("{}/{}", prefix, key);
                if child.is_end_of_path {
                    println!("{}", new_prefix);
                }
                show_recursive(child, new_prefix);
            }
        }

        show_recursive(&self.root, prefix);
    }
}
