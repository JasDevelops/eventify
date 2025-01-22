Feature: Show/Hide Event Details

    Scenario: Show event details
        Given I am viewing an event
        When I click on the event’s "More Info" button
        Then I should see the event details

    Scenario: Hide event details
        Given I am viewing the event details
        When I click on the event’s "Less Info" button
        Then I should hide the event details
