# RedPeakLabel Workspace Instructions

## Project Overview

**RedPeakLabel** is a music label website built with:
- **Backend**: Node.js + Express (port 3000)
- **Frontend**: HTML, CSS, JavaScript (vanilla JS with scroll animations and interactive elements)
- **Key Features**: 
  - Multi-page site (home, merch, services, artists, tour, contact)
  - Contact form with email notifications via Nodemailer
  - Dynamic animations and reveal effects
  - Static file serving from Express

**Primary Focus**: Backend API improvements and email functionality

---

## Project Structure

```
redpeaklabel/
├── .github/
│   └── copilot-instructions.md       (this file)
├── server.js                         (Express server entry point)
├── index.js                          (Frontend JS - animations, interactions)
├── index.html                        (Home page)
├── index.css                         (Global styles)
├── contact.html                      (Contact page)
├── merch.html                        (Merchandise page)
├── ourartists.html                   (Artists showcase)
├── service.html                      (Services page)
├── tour.html                         (Tour dates)
└── package.json                      (Dependencies & scripts)
```

---

## Quick Start

### Prerequisites
- Node.js 14+ (for Express and Nodemailer)
- npm or yarn

### Setup
```bash
npm install
```

### Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update `.env` with your credentials:
   ```env
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_PASSWORD=your_app_specific_password
   GMAIL_RECIPIENT=your_gmail@gmail.com
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:3000
   ```
3. **Important**: Never commit `.env` to Git (already in `.gitignore`)

**Gmail Setup:**
- Use a Gmail app-specific password (not your regular password)
- Generate one at: https://myaccount.google.com/apppasswords

### Running the Application

**Development:**
```bash
npm run dev  # or: npm start
```
Server runs at `http://localhost:3000`

---

## Coding Standards

### JavaScript (Frontend & Backend)

- **Indentation**: 2 spaces
- **Naming**: camelCase for variables/functions, UPPER_SNAKE_CASE for constants
- **Semicolons**: Required
- **Comments**: JSDoc for functions explaining purpose, parameters, and return values

**Example:**
```javascript
/**
 * Reveals elements when they scroll into viewport
 * @param {NodeList} elements - DOM elements to animate
 * @returns {void}
 */
function reveal(elements) {
  // Implementation
}
```

### HTML/CSS

- **Indentation**: 2 spaces
- **Class naming**: kebab-case (e.g., `hero-section`, `nav-links`)
- **IDs**: kebab-case, limit usage to anchor points and critical JS hooks
- **CSS Colors**: Use CSS variables (root-level definitions)

### Backend API Conventions

- **Route path pattern**: `/api/{resource}/{action}` (e.g., `/api/contact`, `/api/artists/list`)
- **HTTP methods**: 
  - POST for creating/submitting data
  - GET for retrieving data
  - PUT/PATCH for updates
  - DELETE for removal
- **Response format**:
  ```javascript
  { success: true/false, message: "...", data: {...} }
  ```

---

## Development Workflow

### Git Workflow

- **Branches**:
  - `main`: Production-ready code
  - `dev`: Integration branch for features
  - Feature branches: `feature/description` (branch from `dev`)
  
- **Commit messages**: Follow conventional commits
  - `feat: add email validation to contact form`
  - `fix: resolve CORS issue with localhost`
  - `docs: update README with deployment steps`
  - `refactor: extract email logic to utilities`

### Common Development Tasks

#### Adding a New API Endpoint
1. Create route handler in `server.js`
2. Add validation for request body
3. Return standardized response `{ success: true/false, message, data }`
4. Test with curl or Postman
5. Update this file with endpoint documentation

#### Modifying Frontend Pages
1. Edit the corresponding `.html` file
2. Add/modify CSS in `index.css`
3. Add interactions in `index.js` if needed
4. Test scroll reveal animations on different viewport sizes

#### Email Functionality Changes
- Email templates are sent directly in `server.js` as HTML strings
- Update `nodemailer` transporter config before deploying
- Test with actual email addresses during development

---

## Testing Strategy

### Current State
- No automated tests configured yet

### Recommended Setup
- **Unit Tests** (Backend): Jest with `npm install jest --save-dev`
- **E2E Tests** (Frontend): Playwright or Cypress
  - Install: `npm install --save-dev @playwright/test`
  - Test routes through browser to catch integration issues
  - Verify email sending flow end-to-end

### Test File Location
- Backend tests: `tests/server.test.js`
- Frontend tests: `tests/e2e/`

### Running Tests (Once Configured)
```bash
npm test           # Run all tests
npm run test:unit  # Unit tests only
npm run test:e2e   # End-to-end tests only
```

---

## Security Considerations

✅ **Implemented:**
- **Email credentials**: Moved to environment variables (`.env` file, excluded from Git)
- **Input validation**: All form inputs are sanitized and validated
  - HTML tags removed from inputs
  - Input length limits enforced (2-50 chars for name, 10-500 for message)
  - Strict email regex validation
- **CORS**: Restricted to `ALLOWED_ORIGINS` environment variable (development: localhost only)
- **Rate limiting**: Contact endpoint limited to 5 requests per 15 minutes per IP
- **Request size limits**: Body parser limited to 10KB to prevent large payload attacks

---

## Common Pitfalls

1. **Email not sending**: 
   - Credentials in `server.js` are incorrect
   - Gmail account doesn't allow app-specific passwords
   - Port 587 blocked by network/firewall

2. **Animations not smooth**:
   - Check viewport height calculations in `reveal()` function
   - Ensure CSS transitions are defined correctly

3. **CORS errors in browser**:
   - Verify `cors()` middleware is enabled
   - Check that frontend makes requests to correct API URL

4. **Static files not served**:
   - Ensure `express.static()` points to correct directory (`__dirname`)
   - Check file extensions match references in HTML

---

## Deployment Notes

- **Server**: Currently configured for localhost development (port 3000)
- **Environment**: Node 14+
- **Before deploying**:
  1. Move email credentials to `.env` file
  2. Update CORS origin whitelist
  3. Add rate limiting middleware
  4. Set up proper error logging
  5. Test email sending with production credentials
  6. Update any hardcoded localhost URLs

---

## AI Agent Instructions

When assisting with this project, prioritize:

1. **Backend improvements**: Focus on API robustness, error handling, security
2. **Email functionality**: Ensure reliable contact form notifications
3. **Code quality**: Follow standards above; suggest refactoring when beneficial
4. **Testing**: Recommend test coverage for new features (especially API endpoints)
5. **Documentation**: Update this file when adding new patterns or workflows

### Before Making Changes

- Check this file for relevant conventions and patterns
- Ask about deployment target if uncertain
- Flag security issues (exposed credentials, unvalidated inputs)
- Suggest tests for backend API changes
