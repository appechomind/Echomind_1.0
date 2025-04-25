# Contributing to EchoMind

Thank you for your interest in contributing to EchoMind! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally
   ```bash
   git clone https://github.com/yourusername/echomind.git
   cd echomind
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make Your Changes**
   - Follow the coding standards
   - Keep commits atomic and well-described
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Submit a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

## Development Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Follow ES6+ JavaScript conventions
- Keep functions small and focused
- Use meaningful variable and function names
- Comment complex logic
- Use JSDoc for function documentation

### File Structure

- Place new effects in appropriate directories under `tricks/`
- Keep media files in `assets/` directory
- Maintain separation of concerns
- Follow existing naming conventions

### Testing

- Test on multiple browsers
- Verify mobile responsiveness
- Check all interactive elements
- Ensure sound effects work
- Test device connectivity if applicable

### Documentation

- Update README.md if adding new features
- Document any new APIs or interfaces
- Include usage examples
- Update file structure if needed

### Performance

- Optimize images and media
- Minimize DOM manipulations
- Use efficient CSS selectors
- Implement lazy loading where appropriate
- Keep animations smooth

### Security

- Use secure random number generation
- Implement proper error handling
- Validate all user inputs
- Follow security best practices
- Don't commit sensitive information

## Pull Request Process

1. **Before Submitting**
   - Update documentation
   - Test all changes
   - Ensure code passes linting
   - Resolve merge conflicts

2. **PR Description**
   - Describe the changes
   - Link related issues
   - List testing performed
   - Note any breaking changes

3. **Review Process**
   - Address reviewer comments
   - Make requested changes
   - Keep the PR updated

4. **After Merging**
   - Delete your branch
   - Update your fork
   - Verify changes in main branch

## Questions?

Feel free to open an issue for:
- Feature suggestions
- Bug reports
- Documentation improvements
- General questions

Thank you for contributing to EchoMind! 