# Dynamic Project Loading - Implementation Summary

## Overview

Updated the project filtering implementation to dynamically load projects from `data/experiences.json` instead of hardcoding them in HTML. This provides a centralized, maintainable data source for all projects.

## What Changed

### Before
- Projects were hardcoded in `index.html`
- Had to manually update HTML to add/remove projects
- Data duplication between experiences and projects

### After
- Projects are dynamically loaded from `data/experiences.json`
- Single source of truth for all project data
- Automatic extraction from work experiences
- Easy to maintain and update

## New Component: projects-showcase.js

### Purpose
Dynamically loads and renders all projects from the experiences JSON file.

### Features
- Fetches data from `data/experiences.json`
- Extracts all projects from all work experiences
- Renders projects with company and period information
- Dispatches `projects-loaded` event when ready
- Error handling with retry functionality
- Responsive grid layout

### Data Structure
The component reads from your existing `experiences.json` structure:
```json
{
  "experiences": [
    {
      "company": "Company Name",
      "period": "Date Range",
      "color": "indigo",
      "projects": [
        {
          "title": "Project Title",
          "description": "Project description",
          "tags": [
            { "text": "React", "color": "indigo" }
          ]
        }
      ]
    }
  ]
}
```

### Rendered Output
Each project is rendered with:
- Project title and description
- Technology tags (from the tags array)
- Company name and period (from parent experience)
- Color-coded styling based on experience color
- Hover effects and animations

## Updated Component: project-filter.js

### Changes
- Now listens for `projects-loaded` event from projects-showcase
- Waits for projects to be rendered before extracting technologies
- Improved timing and initialization logic
- Better error handling and debugging

### How It Works
1. projects-showcase loads data from JSON
2. projects-showcase renders projects to DOM
3. projects-showcase dispatches `projects-loaded` event
4. project-filter receives event and extracts technologies
5. project-filter renders filter buttons
6. User can now filter projects by technology

## Benefits

### 1. Centralized Data Management
- All project data in one JSON file
- No duplication between experiences and projects
- Easy to update and maintain

### 2. Automatic Updates
- Add a project to experiences.json → automatically appears in Projects section
- Update project details → changes reflect immediately
- Remove a project → automatically removed from display

### 3. Consistency
- Same data structure across the portfolio
- Consistent styling and formatting
- Company and period information automatically included

### 4. Maintainability
- No need to edit HTML for content changes
- Easier to add/remove projects
- Less prone to errors

### 5. Scalability
- Can easily add more projects without cluttering HTML
- Filter automatically adapts to new technologies
- Grid layout adjusts automatically

## Current Projects (from experiences.json)

Based on your data file, the following projects will be displayed:

1. **Enterprise System Integration** (Bangkok Expressway)
   - System Design, UML, REST API, Microservices

2. **Real-Time Analytics Dashboard** (Club 21)
   - Vue.js, Python, MongoDB, Redis

3. **E-Commerce Platform** (Club 21)
   - React, Node.js, PostgreSQL, Docker

4. **ERP System Development** (Club 21)
   - Angular, Django, PostgreSQL, REST API

5. **Corporate Website Portfolio** (Jowit Global)
   - HTML5, CSS3, JavaScript, PHP, MySQL

6. **Internal Website Improvement** (Jowit Global)
   - HTML, CSS, JavaScript, PHP, MySQL

## Filter Technologies Extracted

The filter will automatically generate buttons for these technologies:
- System Design, UML, REST API, Microservices
- Vue.js, Python, MongoDB, Redis
- React, Node.js, PostgreSQL, Docker
- Angular, Django
- HTML5, CSS3, JavaScript, PHP, MySQL
- HTML, CSS

## Usage

### Adding a New Project
Simply add it to `data/experiences.json` under the appropriate experience:

```json
{
  "title": "New Project",
  "description": "Project description",
  "tags": [
    { "text": "Technology1", "color": "indigo" },
    { "text": "Technology2", "color": "indigo" }
  ]
}
```

The project will automatically:
- Appear in the Projects section
- Be included in the filter
- Show company and period information
- Have proper styling and animations

### Updating a Project
Edit the project in `data/experiences.json` and refresh the page. Changes will be reflected immediately.

### Removing a Project
Delete the project from `data/experiences.json` and it will no longer appear in the Projects section.

## Technical Details

### Component Loading Order
1. `badge-tag.js` - Badge component
2. `project-item.js` - Project display component
3. `project-filter.js` - Filter component
4. `projects-showcase.js` - Dynamic project loader

### Event Flow
```
Page Load
  ↓
projects-showcase.connectedCallback()
  ↓
Fetch data/experiences.json
  ↓
Extract projects from experiences
  ↓
Render projects to DOM
  ↓
Dispatch 'projects-loaded' event
  ↓
project-filter receives event
  ↓
Extract technologies from rendered projects
  ↓
Render filter buttons
  ↓
User can filter projects
```

### Error Handling
- Network errors: Shows error message with retry button
- Missing data: Shows "No projects available" message
- Invalid JSON: Logs error and shows error message

## Testing

### Manual Testing
1. Open `index.html` in browser
2. Navigate to Projects section
3. Verify all 6 projects are displayed
4. Check that filter buttons show all technologies
5. Click different technology filters
6. Verify projects filter correctly
7. Check that cards completely disappear when filtered out

### Console Logs
Open browser console to see:
- `[ProjectsShowcase] Loading projects from: data/experiences.json`
- `[ProjectsShowcase] Loaded projects: 6`
- `[ProjectFilter] Projects loaded event received`
- `[ProjectFilter] Found project items: 6`
- `[ProjectFilter] Total unique technologies: X`

## Future Enhancements

Possible improvements:
1. Add search functionality (search by project title/description)
2. Add sorting options (by date, company, technology)
3. Add project detail modal/page
4. Add project links (GitHub, live demo)
5. Add project images/screenshots
6. Add filtering by company or date range
7. Add "Load More" pagination for many projects

## Notes

- The component uses the existing `project-item` and `badge-tag` components
- Styling matches the existing portfolio theme
- Responsive design works on all screen sizes
- Animations and transitions are smooth (300ms)
- Accessibility features are maintained
- Theme support (dark/light mode) works correctly
