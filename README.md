# Eventify - A Progressive Web App (PWA)

## Project Overview

**Eventify** is a serverless, progressive web application (PWA) built with React. 

Built using a **Test-Driven Development (TDD)** approach, Eventify ensures high-quality, well-tested code, with both online and offline capabilities for a seamless user experience.

## Features

- **Event Search by City**: Users can search for events based on the city, making it easy to find events in their location.
- **Event Data Visualization**:  
  - **Pie Chart**: Displays the popularity of different event genres.
- **Progressive Web App (PWA)**:  
  - Offline functionality for viewing event data without an internet connection.  
  - **Add to Home Screen** prompt for easy access.  
- **Serverless Backend**: No backend maintenance required, fully scalable, and cost-effective.
- **Responsive Design**: Works seamlessly across different devices (desktop, mobile, tablet).

## Architectural Diagram
![Architectural Diagram] (public/assets/diagram-1.jpg)

## User stories: Features & Scenarios (Gherkin)

### Feature 1: Filter Events By City
- As a user,  
  I should be able to filter events by city,  
  So that I can find events in specific locations.

#### Scenario 1: No city search yet
**Given** I have not searched for any city,  
**When** I open the event page,  
**Then** I should see upcoming events from all cities.

#### Scenario 2: Suggestions for cities
**Given** I am on the search bar,  
**When** I type a city name,  
**Then** I should see a list of city suggestions.

#### Scenario 3: Select a city
**Given** I have a list of city suggestions,  
**When** I select a city from the suggestions,  
**Then** I should see the events filtered by the selected city.

### Feature 2: Show/Hide Event Details
- As a user,  
  I should be able to expand and collapse event details,  
  So that I can choose to see more or less information about the events.

#### Scenario 1: Show event details
**Given** I am viewing an event,  
**When** I click on the event's "More Info" button,  
**Then** I should see the event details.

#### Scenario 2: Hide event details
**Given** I am viewing the event details,  
**When** I click on the event's "Less Info" button,  
**Then** I should hide the event details.

### Feature 3: Specify Number of Events to Display
- As a user,  
  I should be able to specify the number of events displayed,  
  So that I can control how many events are shown on my screen at once.

#### Scenario 1: Default number of events displayed
**Given** I have not specified a number of events to display,  
**When** I open the event page,  
**Then** I should see 32 events displayed by default.

#### Scenario 2: Change the number of events
**Given** I am viewing the event list,  
**When** I select the number of events to display (e.g., 5, 10, 20),  
**Then** I should see the chosen number of events displayed.

### Feature 4: Use the App Offline
- As a user,  
  I should be able to use the app when offline,  
  So that I can still view event information without an internet connection.

#### Scenario 1: View cached events offline
**Given** I have visited the event page previously,  
**When** I go offline,  
**Then** I should be able to view the events that were cached.

#### Scenario 2: Show error when changing settings offline
**Given** I am offline,  
**When** I attempt to change the city or the number of events to display,  
**Then** I should see an error message indicating that the search settings cannot be updated without an internet connection.

### Feature 5: Add App Shortcut to Home Screen
- As a user,  
  I should be able to add the app to my home screen,  
  So that I can easily access the app without opening my browser.

#### Scenario 1: Add to Home Screen
**Given** I am using the app on a mobile device,  
**When** I click the "Add to Home Screen" prompt,  
**Then** I should be able to add the app to my home screen.

### Feature 6: Display Charts Visualizing Event Details
- As a user,  
  I should be able to see charts visualizing event details,  
  So that I can visually see a clear and accurate representations of the event details.  

#### Scenario 1: Show a chart of upcoming events by city
**Given** I am viewing the event page,  
**When** I navigate to the charts section,  
**Then** I should see a chart displaying the number of upcoming events in each city.

## Project Setup

### Prerequisites

Before you begin, make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Clone the repository:
   `git clone https://github.com/YourUsername/eventify.git`

2. Navigate into the project directory:
    `cd eventify`

3. Install the dependencies:
    `npm install`

### Running the App
1. To start the app locally, run the following command:
    `npm start`
    This will open the app in your browser at http://localhost:5173.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
**Google Calendar API**
**React**
**Progressive Web Apps**
**Test-Driven Development**
