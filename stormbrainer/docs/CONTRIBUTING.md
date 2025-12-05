# 🤝 Contributing to StormBrainer

We welcome contributions! Whether you're fixing a bug, adding a new feature, or improving documentation, your help is appreciated.

## 🐛 Reporting Issues

If you find a bug or have a feature request, please use the GitHub Issues tracker.

When reporting a bug, please include:
1.  **A clear and descriptive title.**
2.  **Steps to reproduce** the issue (including user roles, e.g., "Logged in as User A").
3.  **Expected behavior** vs. **Actual behavior**.
4.  The **environment** you're using (Browser, OS, Node version).

## ✨ Code Contribution Workflow

1.  **Fork the Repository** and clone your fork locally.
2.  **Set up the environment** following the instructions in `docs/README.md`.
3.  **Create a Branch**: Create a new, descriptive branch for your changes:
    ```bash
    git checkout -b feature/new-rating-algorithm 
    # OR 
    git checkout -b fix/auth-bug-on-logout
    ```
4.  **Make Changes**: Implement your changes.
    * Ensure all new features/routes include proper **validation middleware**.
    * If changing the database structure, update the `docs/database-schema.md` file.
    * Follow the existing **code style** (e.g., ESLint/Prettier rules).
5.  **Commit Changes**: Write clear, descriptive commit messages.
    ```bash
    git commit -m "feat: implement fuzzy search for galaxies"
    ```
6.  **Push to your Fork**: `git push origin your-branch-name`
7.  **Open a Pull Request (PR)**: Target the `main` branch of the original repository.

## 📝 Coding Standards

* **Middleware/Controller Separation**: Keep business logic in controllers and reusable logic (validation, authentication) in middleware.
* **Async/Await**: Use modern async/await syntax for all asynchronous operations.
* **Error Handling**: All API routes must use `try...catch` blocks and pass errors to the global `errorHandler` middleware.
* **Database**: All database interactions should ideally be encapsulated within the `models/` layer.

Thank you for helping to build StormBrainer!