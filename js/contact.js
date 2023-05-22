function convertFormToJSON(form) {
    return $(form)
      .serializeArray()
      .reduce(function (json, { name, value }) {
        json[name] = value;
        return json;
      }, {});
  }

$('form').submit(function () {
    var form = $(this);
    var j = JSON.stringify(convertFormToJSON(form));
    var action = form.attr('action');
    $.ajax({
        type: "POST",
        url: action,
        crossDomain: true,
        data: j,
        contentType: "application/json; charset=utf-8", // <- this is what you should add
        success: function (msg) {
            console.log(msg)
        },
        error: function (msg) {
            console.error(msg)
        }
    });
    return false;
});