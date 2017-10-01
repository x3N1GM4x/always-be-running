<hr />
<footer>
    <p>
        &copy; Necro <?php echo date("Y"); ?> - [<a href="/faq">F.A.Q.</a>] - [<a href="/about">About</a>] -
        [<a href="/apidoc">API</a>] -
        [<a href="/badges">Badges</a>] -
        [<a href="/support-me" class="supporter">Support Me</a>] -
        [<a href="/birthday">Birthday</a>] -
        <a href="https://twitter.com/alwaysberunnin"><img src="/img/social-twitter.png" class="image-30x30"/></a> -
        <a href="https://www.facebook.com/alwaysberunning"><img src="/img/social-fb.png" class="image-30x30"/></a>
    </p>
    <p class="legal-bullshit">The information presented on this site about Android:Netrunner, both literal and graphical,
            is copyrighted by Fantasy Flight Games and/or Wizards of the Coast.<br/>
            This website is not produced, endorsed, supported, or affiliated with Fantasy Flight Games and/or
            Wizards of the Coast.</p>
</footer>

{{--deck data update call--}}
@if (session()->has('getdeckdata'))
    <script type="text/javascript">
        // updating deck data for user
        $.ajax({
            url: '/api/getdeckdata',
            dataType: "json",
            async: true
        });
    </script>
@endif
