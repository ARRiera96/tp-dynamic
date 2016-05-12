var $hotelSelect = $("#hotel-choices");
var $restaurantSelect = $("#restaurant-choices");
var $activitySelect = $("#activity-choices");
var $itineraryLists = $('h4+.list-group');

//Without wrapping in $(), this is a DOM element
var $hotelList = $($itineraryLists[0]);
var $restaurantList = $($itineraryLists[1]);
var $activityList = $($itineraryLists[2]);

hotels.forEach(function (hotel) {
    $hotelSelect.append("<option>" + hotel.name + "</option>");
});

restaurants.forEach(function (restaurant) {
    $restaurantSelect.append("<option>" + restaurant.name + "</option>");
});

activities.forEach(function (activity) {
    $activitySelect.append("<option>" + activity.name + "</option>");
});

function isItemInList(item, list) {
    return !!list.children().filter(function (_) {
        return $(this).text().includes(item);
    }).length;
}

function addItineraryItem(modelType) {
    var $select, $list, modelArray;
    switch (modelType) {
    case 'restaurant':
        $select = $restaurantSelect;
        $list = $restaurantList;
        modelArray = restaurants;
        break;
    case 'activity':
        $select = $activitySelect;
        $list = $activityList;
        modelArray = activities;
        break;
    case 'hotel':
        $select = $hotelSelect;
        $list = $hotelList;
        modelArray = hotels;
        break;
    }

    $itineraryItem = $(`<div class="itinerary-item">
                <span class="title">${$select.val()}</span>
                <button class="btn btn-xs btn-danger remove btn-circle">x</button>
              </div>`);
    if (!isItemInList($select.val(), $list)) {
        $list.append($itineraryItem);
        var selectionIndex = $select.prop('selectedIndex');
        var coords = modelArray[selectionIndex].place.location;
        var marker = drawMarker(modelType, coords);
        addRemoveBtnHandler($itineraryItem.children('.remove'), marker);
    }
}

$('#hotel-choices+button').on('click', function () {
    $hotelList.find('.remove').trigger('click')
    addItineraryItem('hotel');
});

$('#restaurant-choices+button').on('click', function () {
    addItineraryItem('restaurant');
});

$('#activity-choices+button').on('click', function () {
    addItineraryItem('activity');
});


//Button Event Handlers
function addRemoveBtnHandler($button, marker) {
    $button.on('click', function () {
        $(this).parent().remove();
        marker.setMap(null);
    })
}
