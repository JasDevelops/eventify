Feature: Specify Number of Events

    Scenario: Default number of events displayed
        Given I have not specified a number of events to display
        When I open the event page
        Then I should see 32 events displayed by default

    Scenario: Change the number of events
        Given I am viewing the event list
        When I select the number of events to display (e.g., 5, 10, 20)
        Then I should see the chosen number of events displayed
