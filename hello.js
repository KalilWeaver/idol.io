// JS uses weak typing
var influence_points = 0

// This is how to "send" a JS variable to the html web page
window.onload = function() {
document.getElementById("influence_points_display").innerHTML = influence_points
}

// Don't overuse these
window.alert("Your team has " + influence_points + " points!")

// Create functions that can be called back in the html file
function increase_points() {
    influence_points++

    // Just for testing, doesn't actually display anything on the web page
    console.log(influence_points)

    // You have to update the new value of the variable manually
    document.getElementById("influence_points_display").innerHTML = influence_points
}