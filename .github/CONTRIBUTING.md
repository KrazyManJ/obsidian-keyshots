# Contributing to Keyshots

Thank you for your interest in contributing to Keyshots! I appreciate your time and effort in helping improve this Obsidian plugin.

## Getting Started

Before you begin:

-   Make sure you have a [GitHub account](https://github.com/signup)
-   Familiarize yourself with the [Obsidian Plugin Developer Documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
-   Check the [existing issues](https://github.com/KrazyManJ/obsidian-keyshots/issues) to see if your bug or feature has already been reported

## How to Contribute

### Reporting Issues

When reporting issues, please:

-   Use one of the provided issue form templates
-   Fill out all required fields in the template
-   Be as specific as possible with your description

**Note:** Issues that lack sufficient detail may be closed without further action.

### Submitting Pull Requests

I welcome pull requests! To submit a PR:

1. **Fork the repository** and create your branch from `dev` (not `master`)

    ```bash
    git checkout dev
    git checkout -b feature/your-feature-name
    ```

2. **Make your changes**

    - Write clean, readable code
    - Follow the existing code style and conventions
    - Keep commits atomic and write meaningful commit messages

3. **Add tests**

    - All new features must include tests with full coverage
    - Ensure all existing tests still pass
    - Run the test suite before submitting

4. **Update documentation**

    - Update the README.md if you're adding new features
    - Add inline comments for complex logic
    - Update relevant documentation files

5. **Submit your PR**
    - Target the `dev` branch (PRs to `master` will be closed)
    - Provide a clear description of the changes
    - Reference any related issues using `#issue-number`
    - Ensure CI checks pass

### Pull Request Guidelines

-   **One feature per PR**: Keep pull requests focused on a single feature or bug fix
-   **Test coverage**: All new code must have accompanying tests with full coverage
-   **Code quality**: Ensure your code follows the project's style guidelines
-   **No breaking changes**: Avoid making breaking changes without prior discussion
-   **Branch target**: Always create PRs against the `dev` branch

## Development Setup

1. Clone your fork of the repository

    ```bash
    git clone https://github.com/YOUR-USERNAME/obsidian-keyshots.git
    cd obsidian-keyshots
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Build the plugin

    ```bash
    npm run build
    ```

4. Run tests
    ```bash
    npm test
    ```

## Code Style

-   Use TypeScript for all new code
-   Follow existing naming conventions
-   Use meaningful variable and function names
-   Add comments for complex logic
-   Keep functions small and focused

## Testing

-   Write unit tests for all new features
-   Ensure full test coverage for your changes
-   All tests must pass before submitting a PR
-   Include both positive and negative test cases

## Code Review Process

After you submit a pull request:

1. I will review your code as soon as possible
2. I may request changes or ask questions
3. Once approved, I will merge your PR into `dev`
4. Changes will be included in the next release

## Questions?

If you have questions about contributing, feel free to:

-   Open a discussion in the [GitHub Discussions](https://github.com/KrazyManJ/obsidian-keyshots/discussions)
-   Comment on an existing issue
-   Reach out through the issue templates

## License

By contributing to Keyshots, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Keyshots! Your efforts help make this plugin better for everyone.
