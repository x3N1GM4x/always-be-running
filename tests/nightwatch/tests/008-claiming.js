module.exports = {

    beforeEach: function (browser) {
        browser.deleteCookies().windowMaximize('current');
    },

    after: function (browser) {
        browser.end();
    },

    /**
     * Login with NRDB (regular user)
     * Navigate to Organize page, create from results
     * Fill out form with multi-day, concluded, online tournament data
     * Save tournament
     * Click claim, validate claim modal, add claim of published decklists
     * Validate tournament details page, validate claim
     * Import nrtm results (conflicting), validate conflicts
     * Remove claim, validate tournament page, conflict is gone
     * Claim again, validate conflict
     * Remove conflicting imported entry, validate conflict is gone
     */
    'Claiming with published decks, no top-cut, conflicting import': function (browser) {

        var regularLogin = browser.globals.regularLogin,
            claim1 = browser.globals.claims.claim1,
            tournamentNrtmJsonWithoutTopCut = JSON.parse(JSON.stringify(browser.globals.tournamentNrtmJsonWithoutTopCut)); // clone

        tournamentNrtmJsonWithoutTopCut.title = browser.currentTest.module.substring(0, 3) + "|" +
            browser.currentTest.name.substring(0, 29) + "|" + tournamentNrtmJsonWithoutTopCut.title.substring(0, 16);

        // Open browser
        browser.url(browser.launchUrl);
        browser.page.upcomingPage().validate();

        // Login with NRDB (regular user)
        browser.log('* Login with NRDB (regular user) *');
        browser.login(regularLogin.username, regularLogin.password);

        // Navigate to Organize page, create from results
        browser.log('* Navigate to Organize page, create from results *');
        browser.page.mainMenu()
            .selectMenu('organize');
        browser.page.organizePage()
            .validate(true)
            .clickCommand('createTournament');

        // Fill out form with multi-day, concluded, online tournament data
        browser.log('* Fill out form with multi-day, concluded, online tournament data *');
        browser.page.tournamentForm()
            .validate()
            .fillForm({
                inputs: {
                    title: tournamentNrtmJsonWithoutTopCut.title,
                    date: tournamentNrtmJsonWithoutTopCut.date,
                },
                selects: {
                    tournament_type_id: tournamentNrtmJsonWithoutTopCut.type,
                    cardpool_id: tournamentNrtmJsonWithoutTopCut.cardpool
                }
            });
        browser.page.mainMenu().acceptCookies(); // cookies info is in the way
        browser.page.tournamentForm()
            .fillForm({
                checkboxes: {
                    concluded: tournamentNrtmJsonWithoutTopCut.conclusion
                },
                inputs: {
                    players_number: tournamentNrtmJsonWithoutTopCut.players_number
                },
                selects: {
                    top_number: tournamentNrtmJsonWithoutTopCut.top
                }
            });

        // save tournament
        browser.log('* Save tournament *');
        browser.page.tournamentForm().getLocationInView('@submit_button').click('@submit_button');

        // Click claim, validate claim modal, add claim of published decklists
        browser.log('* Click claim, validate claim modal, add claim of published decklists *');
        browser.page.tournamentView()
            .validate()
            .click('@buttonClaim');

        browser.page.claimModal()
            .validate(tournamentNrtmJsonWithoutTopCut.title,
                tournamentNrtmJsonWithoutTopCut.players_number, tournamentNrtmJsonWithoutTopCut.top_number)
            .claim(claim1);

        // Validate tournament details page, validate claim
        browser.log('* Validate tournament details page, validate claim *');
        browser.page.tournamentView()
            .validate()
            .assertView({
                title: tournamentNrtmJsonWithoutTopCut.title,
                ttype: tournamentNrtmJsonWithoutTopCut.type,
                creator: regularLogin.username,
                date: tournamentNrtmJsonWithoutTopCut.date,
                cardpool: tournamentNrtmJsonWithoutTopCut.cardpool,
                concludedBy: regularLogin.username,
                map: false,
                decklist: false,
                approvalNeed: true,
                editButton: true,
                approveButton: false,
                rejectButton: false,
                deleteButton: true,
                transferButton: true,
                featureButton: false,
                conflictWarning: false,
                playerNumbers: true,
                topPlayerNumbers: false,
                suggestLogin: false,
                buttonNRTMimport: true,
                buttonNRTMclear: false,
                buttonConclude: false,
                playerClaim: true,
                buttonClaim: false,
                removeClaim: true,
                claimError: false,
                topEntriesTable: false,
                swissEntriesTable: true,
                ownClaimInTable: true,
                conflictInTable: false,
                dueWarning: false,
                registeredPlayers: true,
                noRegisteredPlayers: false,
                unregisterButton: false,
                registerButton: false,
                revertButton: true,
                showMatches: false,
                showPoints: false,
            })
            .assertClaim(
                regularLogin.username,
                claim1.rank, claim1.rank_top,
                false, false,
                claim1.runner_deck, claim1.corp_deck
            );

        // Import nrtm results (conflicting), validate conflicts
        browser.log('* Import nrtm results (conflicting), validate conflicts *');
        browser.page.tournamentView()
            .click('@buttonNRTMimport');

        browser.page.concludeModal()
            .validate(tournamentNrtmJsonWithoutTopCut.title);
        browser.page.concludeModal()
            .concludeNrtmJson('nrtm-without-topcut.json');

        browser.page.tournamentView()
            .validate()
            .assertView({
                conflictWarning: true,
                playerNumbers: true,
                topPlayerNumbers: false,
                suggestLogin: false,
                buttonNRTMimport: false,
                buttonNRTMclear: true,
                buttonConclude: false,
                playerClaim: true,
                buttonClaim: false,
                removeClaim: true,
                claimError: false,
                topEntriesTable: false,
                swissEntriesTable: true,
                ownClaimInTable: true,
                conflictInTable: true,
                dueWarning: false,
                registeredPlayers: true,
                noRegisteredPlayers: false,
                unregisterButton: false,
                registerButton: false,
                revertButton: true,
                showMatches: true,
                showPoints: true,
            })
            .assertClaim(
                regularLogin.username,
                claim1.rank, claim1.rank_top,
                true, false,
                claim1.runner_deck, claim1.corp_deck
            );

        // Remove claim, validate tournament page, conflict is gone
        browser.log('* Remove claim, validate tournament page, conflict is gone *');
        browser.page.tournamentView()
            .click('@removeClaim')
            .assertView({
                conflictWarning: false,
                playerNumbers: true,
                topPlayerNumbers: false,
                suggestLogin: false,
                buttonNRTMimport: false,
                buttonNRTMclear: true,
                buttonConclude: false,
                playerClaim: false,
                buttonClaim: true,
                removeClaim: false,
                claimError: false,
                topEntriesTable: false,
                swissEntriesTable: true,
                ownClaimInTable: false,
                conflictInTable: false,
                dueWarning: false,
                registeredPlayers: true,
                noRegisteredPlayers: false,
                unregisterButton: true,
                registerButton: false,
                revertButton: true,
                showMatches: true,
                showPoints: true,
            });

        // Claim again, validate conflict
        browser.log('* Claim again, validate conflict *');
        browser.page.tournamentView()
            .validate()
            .click('@buttonClaim');

        browser.page.claimModal()
            .validate(tournamentNrtmJsonWithoutTopCut.title,
            tournamentNrtmJsonWithoutTopCut.players_number, tournamentNrtmJsonWithoutTopCut.top_number)
            .claim(claim1);

        browser.page.tournamentView()
            .validate()
            .assertView({
                conflictWarning: true,
                playerNumbers: true,
                topPlayerNumbers: false,
                suggestLogin: false,
                buttonNRTMimport: false,
                buttonNRTMclear: true,
                buttonConclude: false,
                playerClaim: true,
                buttonClaim: false,
                removeClaim: true,
                claimError: false,
                topEntriesTable: false,
                swissEntriesTable: true,
                ownClaimInTable: true,
                conflictInTable: true,
                dueWarning: false,
                registeredPlayers: true,
                noRegisteredPlayers: false,
                unregisterButton: false,
                registerButton: false,
                revertButton: true,
                showMatches: true,
                showPoints: true,
            });

        // Remove conflicting imported entry, validate conflict is gone
        browser.log('* Remove conflicting imported entry, validate conflict is gone *');
        browser.page.tournamentView()
            .removeAnonym(
                'entries-swiss',
                claim1.rank,
                tournamentNrtmJsonWithoutTopCut.imported_results.swiss[claim1.rank-1].player
            );
        browser.page.tournamentView()
            .validate()
            .assertView({
                conflictWarning: false,
                playerNumbers: true,
                topPlayerNumbers: false,
                suggestLogin: false,
                buttonNRTMimport: false,
                buttonNRTMclear: true,
                buttonConclude: false,
                playerClaim: true,
                buttonClaim: false,
                removeClaim: true,
                claimError: false,
                topEntriesTable: false,
                swissEntriesTable: true,
                ownClaimInTable: true,
                conflictInTable: false,
                dueWarning: false,
                registeredPlayers: true,
                noRegisteredPlayers: false,
                unregisterButton: false,
                registerButton: false,
                revertButton: true,
                showMatches: true,
                showPoints: true
            });

        // data cleanup, delete tournament
        browser.sqlDeleteTournament(tournamentNrtmJsonWithoutTopCut.title, browser.globals.database.connection);
    }
};
