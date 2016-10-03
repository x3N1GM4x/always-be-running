{{--New/edit tournament form--}}
<div class="row">
    <div class="col-xs-12 col-md-8">
        {{--General--}}
        <div class="bracket">
            {{--Title--}}
            <div class="form-group">
                {!! Html::decode(Form::label('title', 'Tournament title<sup class="text-danger">*</sup>')) !!}
                {!! Form::text('title', old('title', $tournament->title),
                     ['class' => 'form-control', 'required' => '', 'placeholder' => 'Title']) !!}
            </div>
            <div class="row">
                {{--Tournament type--}}
                <div class="col-md-6 col-xs-12">
                    <div class="form-group">
                        {!! Form::label('tournament_type_id', 'Type') !!}
                        {!! Form::select('tournament_type_id', $tournament_types,
                            old('tournament_type_id', $tournament->tournament_type_id),
                            ['class' => 'form-control', 'onchange' => 'showLocation()']) !!}
                    </div>
                </div>
                {{--Cardpool--}}
                <div class="col-md-6 col-xs-12">
                    <div class="form-group">
                        {!! Form::label('cardpool_id', 'Legal cardpool up to') !!}
                        {!! Form::select('cardpool_id', $cardpools,
                                    old('cardpool_id', $tournament->cardpool_id), ['class' => 'form-control']) !!}
                    </div>
                </div>
            </div>
            {{--Mandatory decklist--}}
            <div class="form-group">
                {!! Form::checkbox('decklist', null, in_array(old('decklist', $tournament->decklist), [1, 'on'], true), ['id' => 'decklist']) !!}
                {!! Form::label('decklist', 'decklist is mandatory') !!}
            </div>
            {{--Contact--}}
            <div class="form-group">
                {!! Form::label('contact', 'Contact') !!}
                {!! Form::text('contact', old('contact', $tournament->contact),
                     ['class' => 'form-control', 'placeholder' => 'T.O. phone number or email']) !!}
            </div>
            {{--Description--}}
            <div class="form-group">
                {!! Form::label('description', 'Description') !!}
                {!! Form::textarea('description', old('description', $tournament->description),
                    ['rows' => 6, 'cols' => '', 'class' => 'form-control', 'placeholder' => 'additional information and rules, prizepool, etc.']) !!}
            </div>
        </div>
        {{--Conclusion--}}
        <div class="bracket">
            <h5>
                Conclusion
                <small class="form-group text-xs-center">
                    -
                    {!! Form::checkbox('concluded', null, in_array(old('concluded', $tournament->concluded), [1, 'on'], true),
                        ['onclick' => 'conclusionCheck()', 'id' => 'concluded']) !!}
                    {!! Form::label('concluded', 'tournament has ended') !!}
                </small>
            </h5>
            <div class="row">
                <div class="col-md-6 col-xs-12">
                    {{--Player number--}}
                    <div class="form-group">
                        {!! Html::decode(Form::label('players_number', 'Number of players<sup class="text-danger hidden-xs-up" id="pn-req">*</sup>')) !!}
                        {!! Form::text('players_number', old('players_number', $tournament->players_number),
                             ['class' => 'form-control', 'placeholder' => 'number of players', 'disabled' => '']) !!}
                    </div>
                    {{--Top cut number--}}
                    <div class="form-group">
                        {!! Form::label('top_number', 'Number of players in top cut') !!}
                        {!! Form::text('top_number', old('top_number', $tournament->top_number),
                             ['class' => 'form-control', 'placeholder' => 'number fo players in top cut', 'disabled' => '']) !!}
                    </div>
                </div>
                <div class="col-md-6 col-xs-12">
                    <div class="card text-xs-center p-t-1 p-b-1 m-t-2">
                        <div class="form-group">
                            <label class="card-title">Upload NRTM (json) results</label>
                            {!! Form::file('jsonresults', ['id' => 'jsonresults']) !!}
                        </div>
                        <small id="nrtm-helper" class="hidden-xs-up">Click 'Save Tournament' to import.</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xs-12 col-md-4">
        <div class="bracket">
            {{--Date--}}
            <div class="form-group">
                {!! Html::decode(Form::label('date', 'Date<sup class="text-danger">*</sup>')) !!}
                <div class="input-group">
                    {!! Form::text('date', old('date', $tournament->date),
                                 ['class' => 'form-control', 'required' => '', 'placeholder' => 'YYYY.MM.DD.']) !!}
                    <div class="input-group-addon">
                        <i class="fa fa-calendar" aria-hidden="true"></i>
                    </div>
                </div>
            </div>

            {{--Starting time--}}
            <div class="form-group">
                {!! Form::label('start_time', 'Starting time') !!}
                {!! Form::text('start_time', old('start_time', $tournament->start_time), ['class' => 'form-control', 'placeholder' => 'HH:MM']) !!}
            </div>
            <div id="select_location">
                {{--Location--}}
                <div class="form-group">
                    {!! Form::label('location_search', 'Location') !!}
                    {!! Form::text('location_search', null,
                        ['class' => 'form-control', 'placeholder' => 'search city, address or store name']) !!}
                    {{--Google map--}}
                    <div class="map-wrapper-small">
                        <div id="map"></div>
                    </div>
                </div>
                {{--Location info--}}
                <div class="form-group">
                    <strong>Country:<sup class="text-danger">*</sup></strong> <span id="country"></span><br/>
                    <strong>State (US):</strong> <span id="state"></span><br/>
                    <strong>City:<sup class="text-danger">*</sup></strong> <span id="city"></span><br/>
                    <strong>Store/Venue:</strong> <span id="store"></span><br/>
                    <strong>Address:</strong> <span id="address"></span><br/>
                    {!! Form::hidden('location_country', old('location_country', $tournament->location_country), ['id' => 'location_country']) !!}
                    {!! Form::hidden('location_state', old('location_state', $tournament->location_state), ['id' => 'location_state']) !!}
                    {!! Form::hidden('location_city', old('location_city', $tournament->location_city), ['id' => 'location_city']) !!}
                    {!! Form::hidden('location_store', old('location_store', $tournament->location_store), ['id' => 'location_store']) !!}
                    {!! Form::hidden('location_address', old('location_address', $tournament->location_address), ['id' => 'location_address']) !!}
                    {!! Form::hidden('location_place_id', old('location_place_id', $tournament->location_place_id), ['id' => 'location_place_id']) !!}
                </div>
            </div>
        </div>
    </div>

</div>
<div class="row">
    <div class="col-xs-12">
        <p class="text-danger">
            <sup>*</sup> required fields
        </p>
        <p class="text-xs-center">
        {!! Form::submit($submitButton, ['class' => 'btn btn-primary']) !!}
            <br/>
        </p>
    </div>
</div>
<script async defer
        src="https://maps.googleapis.com/maps/api/js?key={{ENV('GOOGLE_MAPS_API')}}&libraries=places&callback=initializeMap">
</script>
<script type="text/javascript">

    var map, marker,
        old_place_id = '{{old('location_place_id', $tournament->location_place_id)}}';

    conclusionCheck();
    showLocation();
    document.getElementById('jsonresults').addEventListener('change', usingNRTMImport, false);

    $('#date').datepicker({
        autoclose: true,
        format: 'yyyy.mm.dd.',
        orientation: 'bottom',
        todayHighlight: true,
        weekStart: 1 //TODO: custom
    });

    function initializeMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 1,
            center: {lat: 40.157053, lng: 19.329297},
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            mapTypeControl: false
        });

        var input = document.getElementById('location_search');
        var autocomplete = new google.maps.places.Autocomplete(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        autocomplete.bindTo('bounds', map);

        marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                console.log("Autocomplete's returned place contains no geometry");
                return;
            }
            renderPlace(place, marker, map);

        });

        if (old_place_id.length > 0) {
            var service = new google.maps.places.PlacesService(map);
            service.getDetails({placeId: old_place_id}, function(place, status){
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    renderPlace(place, marker, map)
                }
            });
        }
    }

</script>