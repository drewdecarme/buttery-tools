module.exports = {
  branches: ["main"],
  repositoryUrl: "git@github.com:drewdecarme/buttery-tools.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/exec",
  ],
};
