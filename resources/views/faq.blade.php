@extends('layout.general')

@section('content')
    <h4 class="page-header">Frequently asked questions</h4>
    <div class="row">
        <div class="col-md-10 col-xs-12 offset-md-1">
            <div class="bracket">
                <p>
                    <a href="#why-ndb">Why do I have to login with my NetrunnerDB user?</a><br>
                    <a href="#ndb-sharing">I cannot see my decks when I am claiming my spot at a tournament.</a><br>
                    <a href="#other-deckbuilders">Do you plan to integrate with other deckbuilders?</a><br>
                    <a href="#nrtm">How do I import the tournament results from NRTM?</a><br>
                    <a href="#more-questions">I have more questions or ideas.</a><br>
                </p>
                <hr/>
                <p>
                    <a name="why-ndb"></a><strong>Why do I have to login with my NetrunnerDB user?</strong>
                </p>
                <p>
                    Because you will be able to link the decks created at NetrunnerDB with the tournaments you participated at.
                    Also I can identify you as a user with your NetrunnerDB account. You won't need a separate registration for
                    this site.
                </p>
                <p>
                    This is done via the <a href="https://en.wikipedia.org/wiki/OAuth">OAuth</a> protocol. You have
                    seen sites with the <em>"login with Facebook / Gmail"</em> option, this is the same thing. You are
                    being logged in on NetrunnerDB and then redirected back.
                </p>
                <p class="p-t-2">
                    <a name="ndb-sharing"></a><strong>I cannot see my decks when I am claiming my spot at a tournament.</strong>
                </p>
                <p>
                    By default I can only access your <em>published</em> decks.
                </p>
                <p>
                    If you want to use your <em>private</em> decks here, please enable the <strong>Share your decks</strong>
                    option in your NetrunnerDB <a href="https://netrunnerdb.com/en/user/profile">account settings</a>.
                </p>
                <p class="p-t-2">
                    <a name="other-deckbuilders"></a><strong>Do you plan to integrate with other deckbuilders?</strong>
                </p>
                <p>
                    This is not planned. Though the possibility is there if the deckbuilder site has the needed API
                    endpoints and has a wide userbase.
                </p>
                <p class="p-t-2">
                    <a name="nrtm"></a><strong>How do I import the tournament results from NRTM?</strong>
                </p>
                <p>
                    <em>Tutorial coming soon.</em>
                </p>
                <p class="p-t-2">
                    <a name="more-questions"></a><strong>I have more questions or ideas.</strong>
                </p>
                <p>
                    You can contact me via: info (at) alwaysberunning.net
                </p>
            </div>
        </div>
    </div>
@stop

