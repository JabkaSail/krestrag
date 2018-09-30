$(document).ready(function(){

  $('form').on('submit', function(){

      var item = $('form input');
      var wish = {item: item.val()};

      $.ajax({
        type: 'POST',
        url: '/wish',
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });

  $('td').on('click', function(){
      var item = $(this).text().replace(/ /g, "-");
      $.ajax({
        type: 'DELETE',
        url: '/wish/' + item,
        success: function(data){
          //do something  with the data via front-end framework
          location.reload();
        }
      });
  });

});