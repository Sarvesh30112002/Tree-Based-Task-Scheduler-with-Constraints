/**
 * Problem 1: Tree-Based Task Scheduler with Constraints
 *
 * Problem:
 * Given a tree (tasks with parent-child dependencies),
 * find the minimum number of rounds to complete all tasks,
 * where up to K tasks can be run in parallel.
 * 
 * Author: [Sarvesh Hadole]
 * Date: [24/06/2025]
 */

/**
 * Main function to compute minimum rounds required to complete tasks
 * @param {number} N - Number of tasks (nodes)
 * @param {number[][]} edges - List of [parent, child] pairs
 * @param {number} K - Maximum number of tasks that can run in parallel
 * @returns {number} - Minimum number of rounds required
 */
function minRounds(N, edges, K) {
    // Step 1: Build the tree and find root (node without parent)
    const children = Array.from({ length: N + 1 }, () => []);
    const hasParent = Array(N + 1).fill(false);

    for (const [parent, child] of edges) {
        children[parent].push(child);
        hasParent[child] = true;
    }

    // Find the root node (no parent)
    let root = 1;
    for (let i = 1; i <= N; i++) {
        if (!hasParent[i]) {
            root = i;
            break;
        }
    }

    // Step 2: Post-order traversal to schedule tasks
    let rounds = 0;

    // A queue to simulate task execution rounds
    const queue = [];

    // Function to perform post-order DFS and return list of levels
    function dfs(node) {
        if (!children[node] || children[node].length === 0) {
            return [0]; // leaf node, depth 0
        }

        let levels = [];
        for (const child of children[node]) {
            const childLevels = dfs(child);
            levels.push(...childLevels.map(l => l + 1));
        }
        return levels;
    }

    const allLevels = dfs(root); // get all task depths (levels)

    // Step 3: Bucket sort tasks by levels and execute them in rounds
    const levelCount = {};
    for (const level of allLevels) {
        levelCount[level] = (levelCount[level] || 0) + 1;
    }

    const levels = Object.keys(levelCount).map(Number).sort((a, b) => a - b);
    for (const level of levels) {
        const tasksAtLevel = levelCount[level];
        rounds += Math.ceil(tasksAtLevel / K); // simulate parallel execution
    }

    // Add 1 round for the root task
    return rounds + 1;
}

// Example usage:
const N = 5;
const edges = [[1, 2], [1, 3], [3, 4], [3, 5]];
const K = 2;

console.log("Minimum rounds required:", minRounds(N, edges, K)); // Output: 3
