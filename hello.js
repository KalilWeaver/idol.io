// team_list contains all information about a team, display_team_list is only a list of names
const team_list = new Array()
const display_team_list = new Array()

// Values to update when page is first loaded
window.onload = function() { 
    document.getElementById("points_display").innerHTML = 0
    document.getElementById("team_name_display").innerHTML = "None"
    document.getElementById("team_list").innerHTML = "Empty"
}


// Function to create a prayer emoji effect after pressing prayer button
function prayer_effects() {
    // Creates a span element for the emoji
    let emoji = document.createElement("span")
    emoji.textContent = "🙏"; 
    emoji.style.position = "absolute";
    emoji.style.fontSize = "24px";
    emoji.style.opacity = "1";
    emoji.style.transition = "transform 1s ease-out, opacity 1s ease-out";

   // Hardcoded position for where the prayer button currently is
    let x = 55; // Exact X position of prayer button
    let y = 250; // Slighly above the prayer button

    // Sets the position of the emoji
    emoji.style.left = `${x}px`;
    emoji.style.top = `${y}px`;

    // Adds the emoji to the body
    document.body.appendChild(emoji);

    // Animate emoji upwards
    setTimeout(() => {
        emoji.style.transform = "translateY(-50px)";
        emoji.style.opacity = "0";
    }, 10);

    // Remove emoji after animation
    setTimeout(() => {
        emoji.remove();
    }, 1000);

}

// Class for creating a new religion, upgrade_level can refer to which milestone the team has achieved and which buttons they have access to
class Team {
    constructor(name, point_total, image_file, upgrade_level) {
        this.name = name;
        this.point_total = point_total;
        this.image_file = image_file;
        this.upgrade_level = upgrade_level;
    }
    display_name() {
        return this.name;
    }
    display_points() {
        return this.point_total;
    }
    display_image() {
        return this.image_file;
    }
    display_level() {
        return this.upgrade_level;
    }
    increase_points(point_display) {
        this.point_total++;
        document.getElementById(point_display).innerHTML = this.point_total
        prayer_effects()
    }
}


// Handles form submission for creating a new team and updates the leaderboard
document.addEventListener('DOMContentLoaded', init, false);
function init(){
    var team_form = document.getElementById("team_form")
    team_form.addEventListener("submit", function(event) {
        event.preventDefault()
        
        var team_name = document.getElementById("team_name").value
        display_team_list.push(team_name)
        team_list.push(new Team(team_name, 0, "img.png", 1))

        team_list.forEach(function(entry) {
            document.getElementById("team_name_display").innerHTML = entry.display_name()
        })
        document.getElementById("team_list").innerHTML = display_team_list.join("<br>")
    })
};

