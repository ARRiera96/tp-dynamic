var $hotelSelect = $("#hotel-choices");
var $restaurantSelect = $("#restaurant-choices");
var $activitySelect = $("#activity-choices");
var $itineraryLists = $('h4+.list-group');


var $hotelList = $($itineraryLists[0]);
var $restaurantList = $($itineraryLists[1]);
var $activityList = $($itineraryLists[2]);

//Mini/local Database
var curDayIndex= 0;

var Day= function(){
  this.hotel= [];
  this.restaurant= [];
  this.activity= []; 
}

var Item = function($item, marker){
  this.item = $item;
  this.marker = marker;
}

var itineraryArr= [new Day()];
//End


//Starts filling in all the option panels 

hotels.forEach(function (hotel) {
    $hotelSelect.append("<option>" + hotel.name + "</option>");
});

restaurants.forEach(function (restaurant) {
    $restaurantSelect.append("<option>" + restaurant.name + "</option>");
});

activities.forEach(function (activity) {
    $activitySelect.append("<option>" + activity.name + "</option>");
});

//End


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

    var $itineraryItem = $('<div class="itinerary-item"></div>');
    var $title = $(`<span class="title">${$select.val()}</span>`);
    var $removeButton = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');

    $itineraryItem
        .append($title)
        .append($removeButton);

    if (!isItemInList($select.val(), $list)) {
        $list.append($itineraryItem);
        //Gets the selected option's index 
        var selectionIndex = $select.prop('selectedIndex');
        var coords = modelArray[selectionIndex].place.location;
        var marker = drawMarker(modelType, coords);
        addRemoveBtnHandler($removeButton, marker, modelType);

        //Add items to itinerary array
        var item = new Item($itineraryItem, marker)
        itineraryArr[curDayIndex][modelType].push(item); 
    }
}


//Event Handlers
addDayBtnHandler($('.current-day'));

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

$('#day-add').on('click', function(){
    var $button= $('<button class="btn btn-circle day-btn">'+ $('.day-buttons').children().length +'</button>');
    $(this).prev().after($button);
    addDayBtnHandler($button);
    itineraryArr.push(new Day());
    console.log(itineraryArr);
});
//End  



//Button Event Handlers
function addRemoveBtnHandler($button, marker, modelType) {
    $button.on('click', function () {
        var $parentDiv = $(this).parent()

        // Remove the item from the local DB
        var itemIndex = $parentDiv.parent().children().index($parentDiv)
        itineraryArr[curDayIndex][modelType].splice(itemIndex, 1);

        $parentDiv.remove();
        marker.setMap(null);
    })
}

//Add dayButton Handler
function addDayBtnHandler($button){
    $button.on('click', function(){
      $('.current-day').removeClass('current-day');
      $(this).addClass('current-day');
      $('#day-title span').text("Day "+$(this).text())

      $itineraryLists.children().remove();
      Object.keys(itineraryArr[curDayIndex]).forEach(function(list){
        itineraryArr[curDayIndex][list].forEach(function(item){
          item.marker.setMap(null);
        })
      })
      console.log("Over here" + $(this).text() );
      curDayIndex = $(this).text() - 1;

      itineraryArr[curDayIndex].hotel.forEach(function(item){
        addRemoveBtnHandler(item.item.find('.remove'), item.marker, 'hotel')
        $hotelList.append(item.item);
        item.marker.setMap(currentMap);
      });
      itineraryArr[curDayIndex].restaurant.forEach(function(item){
        addRemoveBtnHandler(item.item.find('.remove'), item.marker, 'restaurant')
        $restaurantList.append(item.item);
        item.marker.setMap(currentMap);
      });
      itineraryArr[curDayIndex].activity.forEach(function(item){
        addRemoveBtnHandler(item.item.find('.remove'), item.marker, 'activity')
        $activityList.append(item.item);
        item.marker.setMap(currentMap);
      });

    })

}




$('#day-title').on('click','.remove',function(){
  //erase the current day from the itineraryArr
  itineraryArr.splice(curDayIndex, 1);
  var numDays= itineraryArr.length; 
  //remove and then redraw all the day buttons to reset them
 $(".day-buttons").children().not('#day-add').remove();
  for(var i=0; i< numDays; i++){
    $("#day-add").before('<button class="btn btn-circle day-btn">'+ (i+1) +'</button>'); 

  }
    //trigger an event on the last day button.   

})

